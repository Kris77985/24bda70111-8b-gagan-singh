# Authentication API with Winston Logging

A modern Node.js authentication server built with Express, MongoDB, and Winston for comprehensive logging.

## Features

✅ **Express 5.2.1** - Fast and lightweight web framework  
✅ **MongoDB with Mongoose** - Robust database integration  
✅ **Winston Logging** - Production-grade logging system  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Rate Limiting** - Protection against abuse with `rate-limiter-flexible`  
✅ **CORS Support** - Cross-origin resource sharing enabled  
✅ **Environment Configuration** - `.env` file support with `dotenv`  
✅ **Hot Reload** - Nodemon for development workflow  
✅ **Password Hashing** - Argon2 for secure password storage  

## Project Structure

```
24BDA70023-8b-anhad/
├── index.js                          # Main server entry point
├── package.json                      # Project dependencies & scripts
├── .env                              # Environment variables (not in git)
├── logs/                             # Winston logs directory
│   ├── combined.log                  # All logs (info, warn, error)
│   └── error.log                     # Error-level logs only
│
├── config/
│   ├── db.js                         # MongoDB connection setup
│   └── logger.js                     # Winston logger configuration
│
├── middleware/
│   ├── logger.middleware.js          # Request/response logging middleware
│   ├── error.middleware.js           # Global error handler
│   └── ratelimit.middleware.js       # Rate limiting protection
│
├── models/
│   └── user.model.js                 # User schema definition
│
├── controllers/
│   └── auth.controller.js            # Authentication handlers (register/login)
│
└── routes/
    └── auth.routes.js                # Auth API endpoints
```

## Installation

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- MongoDB Account (Atlas or local)

### Setup Steps

1. **Clone and Navigate to Project**
```bash
cd 24BDA70023-8b-ankita-pingua
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/database-name
PORT=5000
LOG_LEVEL=info
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=5m
NODE_ENV=development
```

## Running the Application

### Development Server
```bash
pnpm dev
```

Starts the server with **Nodemon** for automatic hot reloading:
```
✅ Server running on http://localhost:5000
```

### Access Logs
- **Combined Logs**: `logs/combined.log` (all levels)
- **Error Logs**: `logs/error.log` (errors only)
- **Console Output**: Colored terminal logs during development

## API Endpoints

### Authentication Routes
Base URL: `/api/auth`

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Winston Logging Implementation

### Log Levels
- **error** (0): Error messages → `error.log` & `combined.log`
- **warn** (1): Warning messages → `combined.log`
- **info** (2): General information → `combined.log`

### Log Format
```
2026-04-15 17:40:18 [info]: ✅ Server running on http://localhost:5000
2026-04-15 17:40:18 [error]: Database connection failed: connection timeout
```

### Middleware Logging

**Request Logger Middleware** (`logger.middleware.js`):
- Logs HTTP method, URL, status code, and response time
- Uses `res.on('finish')` to log only after response is processed
- Status-based logging: info (2xx), warn (4xx), error (5xx)

**Error Handler Middleware** (`error.middleware.js`):
- Captures all unhandled errors
- Logs full stack traces for 5xx errors
- Logs warnings for 4xx errors

### Logger Usage in Code

```javascript
// Info logs
logger.info(`User logged in successfully: ${email}`);

// Warning logs
logger.warn(`Login attempt with non-existent email: ${email}`);

// Error logs with stack trace
logger.error(`Login error: ${error.message}`);

// Database logs
logger.info("MongoDB Connection Successful");
logger.error(`Database connection failed: ${error.message}`);
```

## Dependencies

### Core
- **express@5.2.1** - Web framework
- **mongoose@9.4.1** - MongoDB ODM
- **dotenv@16.6.1** - Environment variable loader

### Security & Authentication
- **jsonwebtoken@9.0.3** - JWT token generation
- **argon2@0.44.0** - Password hashing
- **http-errors@2.0.1** - HTTP error utilities

### Logging & Monitoring
- **winston@3.19.0** - Logging framework

### Performance & Protection
- **rate-limiter-flexible@11.0.0** - Rate limiting
- **cors@2.8.6** - CORS middleware

### HTTP Utilities
- **http-status-codes@2.3.0** - HTTP status constants

### Development
- **nodemon@3.0.2** - Auto-restart server during development

## Best Practices Implemented

✅ **Use Winston Logger**
- Always use `logger.info()`, `logger.warn()`, `logger.error()` instead of `console.log()`
- Logs are automatically timestamped and categorized by level

✅ **Secure Environment Variables**
- Store sensitive keys in `.env` file
- **Never commit `.env` to Git** - it's in `.gitignore`
- Never log sensitive information like passwords or tokens

✅ **Request Logging**
- Uses `res.on('finish')` to log requests after processing completes
- Logs include HTTP method, URL, status code, and response duration
- Status-based logging for better error tracking

✅ **Rate Limiting**
- Configured to allow 10 requests per 60 seconds per IP
- Returns 429 (Too Many Requests) status when limit exceeded

✅ **Error Handling**
- Global error middleware catches all unhandled errors
- Full stack traces logged for debugging
- Proper HTTP status codes returned to clients

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `LOG_LEVEL` | info | Winston log level (error, warn, info, debug) |
| `MONGO_URI` | - | MongoDB connection string |
| `JWT_SECRET` | - | JWT signing secret |
| `JWT_REFRESH_SECRET` | - | Refresh token secret |
| `JWT_EXPIRES_IN` | 5m | JWT expiration time |
| `NODE_ENV` | development | Application environment |

## Troubleshooting

### Logs folder not created
The `logs/` folder is created automatically by Winston on first run. Ensure write permissions in the project directory.

### MongoDB connection failed
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB Atlas network access settings
- Ensure credentials are URL-encoded if they contain special characters

### Port already in use
Change the `PORT` in `.env` or use a different port:
```bash
PORT=5001 pnpm dev
```

### Rate limiting not working
Check that `rate-limiter-flexible` is installed:
```bash
pnpm install rate-limiter-flexible
```

### Serverless Function Crashed (500 Error)
If you see "This Serverless Function has crashed" on Vercel:
1. Make sure `vercel.json` is in the root directory
2. Verify all environment variables are set in Vercel dashboard:
   - `MONGO_URI` - Must be valid MongoDB connection string
   - `JWT_SECRET` - Required for authentication
3. Check Vercel logs: Deployments → [latest] → Logs
4. Ensure Node.js version is 18+ in `package.json`
5. Make sure app is exported as default: `export default app;`

### Logs in Serverless
When deployed to serverless, logs appear in:
- **Vercel Console** - Real-time logs while function runs
- **`logs/combined.log` file** - Stored in project (local only, not persisted on Vercel)

For production logging on Vercel, consider:
- Log streaming to external service (LogRocket, Sentry, etc.)
- Using Vercel's built-in logging dashboard

## Development Workflow

1. **Edit Files** - Make changes to code
2. **Auto Reload** - Nodemon automatically restarts server
3. **Check Logs** - Monitor `combined.log` and `error.log` in `logs/` folder
4. **Test API** - Use Postman, VS Code REST Client, or curl

Example with curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John Doe"}'
```

## Deployment

### Deploy to Vercel (Recommended for Serverless)

1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and select your GitHub repository

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add the following variables:
     - `MONGO_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Your JWT secret key
     - `JWT_REFRESH_SECRET` - Your refresh token secret
     - `LOG_LEVEL` - Set to "info"

3. **Deploy**
   - Vercel automatically deploys on every push to main branch
   - Your API will be available at `https://your-project.vercel.app`

### Deploy to Traditional Hosting (Heroku, Railway, etc.)

1. **Build and Start**
```bash
pnpm install
pnpm dev
```

2. **Set Environment Variables** on Hosting Platform
3. **Deploy** via git push or CLI

### Application Architecture

The application is configured to work in **both** environments:

- **Local/Traditional** (port 5000): Uses `app.listen()`
- **Serverless** (Vercel/AWS): Exports app as module for handler

The `vercel.json` file configures Vercel to:
- Build with Node.js runtime
- Route all requests to `index.js`
- Inject environment variables at build time

## Git Workflow

The project is initialized with Git. Commits are tracked:
```bash
git add .
git commit -m "Add Winston logging setup"
git push -u origin main
```

`.gitignore` includes:
- `node_modules/`
- `.env`
- `logs/`

## License

ISC


