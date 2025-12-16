require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Railway-specific: Trust proxy for proper IP forwarding
app.set('trust proxy', 1);

// Data file paths
const DATA_DIR = path.join(__dirname, '../database');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MISSIONS_FILE = path.join(DATA_DIR, 'missions.json');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'suggestions.json');

// Middleware
// CORS - Allow Railway domains and localhost
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.railway\.app$/] 
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('../frontend'));

// ==================== DATA STORAGE FUNCTIONS ====================

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

async function readJSON(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeJSON(filePath, defaultValue);
      return defaultValue;
    }
    throw err;
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function initializeData() {
  await ensureDataDir();
  
  const users = await readJSON(USERS_FILE, []);
  
  // Create default admin if no users exist
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('Abhi143$', 10);
    users.push({
      id: 1,
      email: 'abhinav.reddivari@gmail.com',
      password: hashedPassword,
      codename: 'The Founder',
      rank: 'The Almighty',
      goatLevel: 100,
      rizz: 100,
      status: 'Active',
      isAdmin: true,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    await writeJSON(USERS_FILE, users);
    console.log('✓ Default admin user created');
  }
}

// ==================== MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users = await readJSON(USERS_FILE);
    let user = users.find(u => u.email === email);

    if (!user) {
      // Auto-register new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        email,
        password: hashedPassword,
        codename: `Agent-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        rank: 'Initiate',
        goatLevel: Math.floor(Math.random() * 50) + 25,
        rizz: Math.floor(Math.random() * 50) + 25,
        status: 'Active',
        isAdmin: false,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      await writeJSON(USERS_FILE, users);
      user = newUser;
    } else {
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== USER ROUTES ====================

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, codename, rank, goatLevel, rizz, isAdmin } = req.body;

    if (!email || !password || !codename) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const users = await readJSON(USERS_FILE);
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      email,
      password: hashedPassword,
      codename,
      rank: rank || 'Initiate',
      goatLevel: goatLevel || 50,
      rizz: rizz || 50,
      status: 'Active',
      isAdmin: isAdmin || false,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJSON(USERS_FILE, users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { codename, rank, goatLevel, rizz, status, isAdmin } = req.body;

    const users = await readJSON(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = {
      ...users[userIndex],
      codename,
      rank,
      goatLevel,
      rizz,
      status,
      isAdmin,
      updatedAt: new Date().toISOString()
    };

    await writeJSON(USERS_FILE, users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const users = await readJSON(USERS_FILE);
    const filteredUsers = users.filter(u => u.id !== id);

    if (users.length === filteredUsers.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    await writeJSON(USERS_FILE, filteredUsers);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== MISSION ROUTES ====================

app.get('/api/missions', authenticateToken, async (req, res) => {
  try {
    const missions = await readJSON(MISSIONS_FILE);
    res.json(missions);
  } catch (err) {
    console.error('Get missions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/missions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, requiredRank, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    const missions = await readJSON(MISSIONS_FILE);
    const newMission = {
      id: missions.length > 0 ? Math.max(...missions.map(m => m.id)) + 1 : 1,
      title,
      description,
      requiredRank: requiredRank || 'Initiate',
      status: status || 'Active',
      createdAt: new Date().toISOString()
    };

    missions.push(newMission);
    await writeJSON(MISSIONS_FILE, missions);
    res.status(201).json(newMission);
  } catch (err) {
    console.error('Create mission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/missions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, requiredRank, status } = req.body;

    const missions = await readJSON(MISSIONS_FILE);
    const missionIndex = missions.findIndex(m => m.id === id);

    if (missionIndex === -1) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    missions[missionIndex] = {
      ...missions[missionIndex],
      title,
      description,
      requiredRank,
      status,
      updatedAt: new Date().toISOString()
    };

    await writeJSON(MISSIONS_FILE, missions);
    res.json(missions[missionIndex]);
  } catch (err) {
    console.error('Update mission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/missions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const missions = await readJSON(MISSIONS_FILE);
    const filteredMissions = missions.filter(m => m.id !== id);

    if (missions.length === filteredMissions.length) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    await writeJSON(MISSIONS_FILE, filteredMissions);
    res.json({ message: 'Mission deleted successfully' });
  } catch (err) {
    console.error('Delete mission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== SUGGESTION ROUTES ====================

app.get('/api/suggestions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const suggestions = await readJSON(SUGGESTIONS_FILE);
    res.json(suggestions);
  } catch (err) {
    console.error('Get suggestions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/suggestions', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Suggestion text required' });
    }

    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.id === req.user.id);

    const suggestions = await readJSON(SUGGESTIONS_FILE);
    const newSuggestion = {
      id: suggestions.length > 0 ? Math.max(...suggestions.map(s => s.id)) + 1 : 1,
      text,
      from: user.codename,
      userId: user.id,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    suggestions.push(newSuggestion);
    await writeJSON(SUGGESTIONS_FILE, suggestions);
    res.status(201).json(newSuggestion);
  } catch (err) {
    console.error('Create suggestion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/suggestions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const suggestions = await readJSON(SUGGESTIONS_FILE);
    const filteredSuggestions = suggestions.filter(s => s.id !== id);

    if (suggestions.length === filteredSuggestions.length) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    await writeJSON(SUGGESTIONS_FILE, filteredSuggestions);
    res.json({ message: 'Suggestion deleted successfully' });
  } catch (err) {
    console.error('Delete suggestion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GYATT PPL Backend is running' });
});

// Start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 GYATT PPL Backend running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`💾 Data stored in JSON files at ${DATA_DIR}`);
    
    // Railway-specific logging
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.log(`🚂 Running on Railway in ${process.env.RAILWAY_ENVIRONMENT} environment`);
      console.log(`🌐 Public URL: https://${process.env.RAILWAY_STATIC_URL || 'your-app.railway.app'}`);
    }
  });
});
