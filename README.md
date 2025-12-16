# GYATT PPL - Web Service

Full-stack web application with user management, missions, and rankings.

## 🚂 Quick Deploy to Railway

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select your repo

3. **Set Environment Variables in Railway:**
   ```
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   NODE_ENV=production
   ```

4. **Done!** Your app will be live at `https://your-app.railway.app`

**Default login:** `abhinav.reddivari@gmail.com` / `Abhi143$` (change this!)

---

## Local Development

```bash
cd backend
npm install
npm start
```

Open http://localhost:3000

---

## API Endpoints

**Auth:**
- `POST /api/auth/login` - Login/register

**Users:** (require auth)
- `GET /api/user/profile` - Get current user
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

**Missions:** (require auth)
- `GET /api/missions` - Get all missions
- `POST /api/missions` - Create mission (admin)
- `PUT /api/missions/:id` - Update mission (admin)
- `DELETE /api/missions/:id` - Delete mission (admin)

**Suggestions:** (require auth)
- `GET /api/suggestions` - Get all (admin)
- `POST /api/suggestions` - Submit suggestion
- `DELETE /api/suggestions/:id` - Delete (admin)

---

## Project Structure

```
gyattppl/
├── backend/
│   ├── server.js          # Main Express server
│   ├── middleware.js      # JWT authentication
│   ├── package.json       # Dependencies
│   └── .env              # Config (template only!)
├── frontend/
│   ├── index.html        # Main app UI
│   ├── api.js            # API client
│   └── integration.js    # Helper functions
├── database/
│   └── .gitkeep          # Data files created automatically
├── railway.json          # Railway config
├── nixpacks.toml         # Build config
└── README.md
```

---

## Integrating Your HTML

To connect your original HTML to the API:

1. Add before closing `</body>`:
   ```html
   <script src="integration.js"></script>
   ```

2. Replace localStorage calls with API calls:
   ```javascript
   // OLD
   const users = JSON.parse(localStorage.getItem('gyatt_users'));
   
   // NEW
   const users = await getUsersAPI();
   ```

See `frontend/integration.js` for all available functions.

---

## Tech Stack

- **Backend:** Node.js, Express, JWT, bcrypt
- **Frontend:** Vanilla JS, HTML, CSS
- **Storage:** JSON files
- **Deploy:** Railway (auto-detects everything)

---

## Security Notes

- Change JWT_SECRET in production
- Change default admin password after first login
- Use HTTPS (Railway provides this automatically)

---

**The Gyatts will prevail!** 🔥

- 🔐 **Authentication**: Secure JWT-based authentication with auto-registration
- 👤 **User Profiles**: Track codenames, ranks, GOAT levels, and Rizz scores
- 📋 **Missions**: Create and manage organizational missions
- 💬 **Suggestions**: Submit feedback to administrators
- 👑 **Admin Panel**: Full CRUD operations for users, missions, and suggestions
- 💾 **JSON Storage**: Simple file-based data persistence

## Tech Stack

**Backend:**
- Node.js + Express
- JWT for authentication
- Bcrypt for password hashing
- JSON file storage

**Frontend:**
- Vanilla JavaScript
- Responsive CSS
- Modern UI with custom styling

## Project Structure

```
gyattppl/
├── backend/
│   ├── server.js          # Main Express server
│   ├── middleware.js      # Authentication middleware
│   ├── package.json       # Node dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── index.html        # Main HTML file
│   └── api.js            # API client
├── database/
│   ├── users.json        # User data (auto-created)
│   ├── missions.json     # Mission data (auto-created)
│   └── suggestions.json  # Suggestions (auto-created)
└── README.md
```

## Installation

### Prerequisites
- Node.js 14+ and npm installed

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

The `.env` file is already created with default values:
```
PORT=3000
JWT_SECRET=gyatt_ppl_secret_key_change_in_production
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` in production!

### Step 3: Start the Server

```bash
# From the backend directory
npm start

# Or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:3000`

## Default Admin Account

```
Email: abhinav.reddivari@gmail.com
Password: Abhi143$
```

**Important:** Change this password after first login in production!

## API Documentation

### Authentication

#### POST `/api/auth/login`
Login or auto-register a new user.

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "codename": "Agent-XYZ123",
    "rank": "Initiate",
    "goatLevel": 45,
    "rizz": 38,
    "status": "Active",
    "isAdmin": false,
    "joinDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Endpoints

All user endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### GET `/api/user/profile`
Get current user's profile.

#### GET `/api/users` (Admin only)
Get all users.

#### POST `/api/users` (Admin only)
Create a new user.

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "codename": "Agent-Smith",
  "rank": "Operative",
  "goatLevel": 75,
  "rizz": 80,
  "isAdmin": false
}
```

#### PUT `/api/users/:id` (Admin only)
Update a user.

```json
{
  "codename": "Updated-Name",
  "rank": "Sentinel",
  "goatLevel": 85,
  "rizz": 90,
  "status": "Active",
  "isAdmin": false
}
```

#### DELETE `/api/users/:id` (Admin only)
Delete a user.

### Mission Endpoints

#### GET `/api/missions`
Get all missions.

#### POST `/api/missions` (Admin only)
Create a new mission.

```json
{
  "title": "Operation Sunrise",
  "description": "Secure the target location",
  "requiredRank": "Operative",
  "status": "Active"
}
```

#### PUT `/api/missions/:id` (Admin only)
Update a mission.

#### DELETE `/api/missions/:id` (Admin only)
Delete a mission.

### Suggestion Endpoints

#### GET `/api/suggestions` (Admin only)
Get all suggestions.

#### POST `/api/suggestions`
Submit a suggestion.

```json
{
  "text": "My suggestion for improvement..."
}
```

#### DELETE `/api/suggestions/:id` (Admin only)
Delete a suggestion.

## Frontend Integration

The frontend needs to be updated to use the API. Here's a basic example:

```html
<script src="api.js"></script>
<script>
const api = new APIClient();

// Login
async function login() {
  try {
    const user = await api.login('email@example.com', 'password');
    console.log('Logged in:', user);
    // Update UI
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Get profile
async function loadProfile() {
  try {
    const user = await api.getProfile();
    // Display user data
  } catch (error) {
    console.error('Failed to load profile:', error.message);
  }
}
</script>
```

## Ranks Hierarchy

1. **Initiate** - You have been noticed. Your journey begins here.
2. **Observer** - You watch, you learn, you adapt.
3. **Operative** - Action becomes you. Missions are your calling.
4. **Sentinel** - You guard the secrets. You enforce the code.
5. **Architect** - You shape reality. Your influence is undeniable.
6. **The Almighty** - Power absolute. Judgment final.

## Data Storage

All data is stored in JSON files in the `database/` directory:

- **users.json**: User accounts and profiles
- **missions.json**: Mission data
- **suggestions.json**: User feedback

The files are automatically created on first run with the default admin user.

## Security Notes

1. **Change the JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Change the default admin password** immediately
4. **Implement rate limiting** for production use
5. **Add input validation** for production
6. **Use a proper database** for production (PostgreSQL, MySQL, MongoDB)

## Development

### Running in Development Mode

```bash
cd backend
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Testing the API

You can test the API using curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abhinav.reddivari@gmail.com","password":"Abhi143$"}'

# Get profile (replace TOKEN with the JWT from login)
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer TOKEN"
```

Or use tools like Postman, Insomnia, or Thunder Client.

## Deployment

### Environment Variables

Set these environment variables in production:

```
PORT=3000
JWT_SECRET=your_very_secure_secret_key_here
NODE_ENV=production
```

### Process Manager

Use PM2 for production:

```bash
npm install -g pm2
cd backend
pm2 start server.js --name gyattppl
pm2 save
pm2 startup
```

### Reverse Proxy

Use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Server won't start

- Check if port 3000 is already in use
- Ensure all dependencies are installed: `npm install`
- Check the `.env` file exists

### Authentication fails

- Verify JWT_SECRET is set correctly
- Check token is included in Authorization header
- Ensure token hasn't expired (7-day validity)

### Data not persisting

- Check write permissions on the `database/` directory
- Verify JSON files are valid (no syntax errors)

## License

Proprietary - GYATT PPL Organization

## Support

For issues or questions, submit a suggestion through the application or contact the administrator.

---

**The Gyatts will prevail** 🔥
