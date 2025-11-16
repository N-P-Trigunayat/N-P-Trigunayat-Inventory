# Backend Setup & Deployment Guide

## 📋 Quick Start

Your inventory system backend is ready to deploy for **FREE** using **Node.js + Express + Supabase**.

---

## 🚀 Step 1: Set Up Supabase (FREE)

1. **Create account**: Go to [supabase.com](https://supabase.com) → Sign up (free)
2. **Create project**: 
   - Project name: `inventory-system`
   - Choose free tier
   - Select region closest to India
3. **Copy credentials**:
   - Go to Project Settings → API
   - Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY`

---

## 📦 Step 2: Set Up Backend Locally

### 2.1 Install Node.js
- Download from [nodejs.org](https://nodejs.org) (LTS version)
- Verify: `node --version` and `npm --version`

### 2.2 Setup Backend Files
```bash
# Create project folder
mkdir inventory-backend
cd inventory-backend

# Copy all backend files into this folder
# (package.json, server.js, routes/, middleware/, etc.)

# Install dependencies
npm install
```

### 2.3 Configure Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your Supabase credentials:
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your-super-secret-key-here-min-32-chars
PORT=3000
NODE_ENV=development
```

### 2.4 Setup Database
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase-setup.sql`
3. Paste and execute the SQL
4. ✅ Tables created automatically

---

## ✅ Step 3: Test Backend Locally

```bash
# Start development server
npm start

# Expected output:
# ✅ Backend running on http://localhost:3000

# Test health check:
# Open browser → http://localhost:3000/api/health
# Should see: {"status":"Backend is running!"}
```

---

## 🌐 Step 4: Deploy to FREE Hosting

### Option A: **Render.com** (Recommended - Easiest)

1. **Create account**: [render.com](https://render.com) (use GitHub)
2. **Create Web Service**:
   - Connect GitHub repo with backend code
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
3. **Add Environment Variables**:
   - Go to Environment → Add all variables from `.env`
4. **Deploy**: Click "Deploy" → ✅ Live in 2-3 mins
5. **Get URL**: `https://your-app-name.onrender.com`

### Option B: **Railway.app** (Alternative)

1. Create account at [railway.app](https://railway.app)
2. Create project → Deploy from GitHub
3. Add environment variables
4. Deploy ✅

### Option C: **Heroku** (Alternative)

1. Install Heroku CLI
2. Run:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

---

## 🔗 Step 5: Connect Frontend to Backend

In your `app.js`, update API calls:

```javascript
// Replace localhost with your deployed URL
const API_URL = 'https://your-app-name.onrender.com/api';

// Login example:
async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
}

// Get products:
async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return await response.json();
}

// Create product (with auth):
async function createProduct(product) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  return await response.json();
}
```

---

## 📚 API Endpoints Reference

### **Categories**
- `GET /api/categories` - Get all categories

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Protected)
- `PUT /api/products/:id` - Update product (Protected)
- `DELETE /api/products/:id` - Delete product (Protected)

### **Invoices**
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice (Protected)

### **Authentication**
- `POST /api/auth/login` - Login
  ```json
  {
    "email": "admin@np.com",
    "password": "admin123"
  }
  ```

---

## 🔐 Default Credentials
- **Email**: `admin@np.com`
- **Password**: `admin123`
- ⚠️ Change these in production!

---

## ✨ Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| **Supabase** | 500MB DB + 1GB bandwidth |
| **Render.com** | 750 hours/month |
| **Railway** | $5/month free credit |

Perfect for MVP & development! 🎉

---

## 🐛 Troubleshooting

**"Cannot find module"**
- Run: `npm install`

**"Cannot connect to Supabase"**
- Check `.env` credentials
- Verify SUPABASE_URL and SUPABASE_KEY

**"401 Unauthorized"**
- Send `Authorization: Bearer TOKEN` header
- Login first to get token

**"CORS error"**
- Backend allows CORS automatically
- Check frontend URL matches

---

## 📞 Support Resources

- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Express Docs: [expressjs.com](https://expressjs.com)
- Render Docs: [render.com/docs](https://render.com/docs)

---

**Your backend is production-ready! 🚀**
