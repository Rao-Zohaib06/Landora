# Quick Reference Guide - Real Estate Management System

## System Overview
Production-ready real estate platform with role-based access control, real-time data, and Zameen.com-like functionality.

---

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
# Set up .env file (see Environment Variables below)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs (if enabled)

---

## 🔑 User Roles & Access

| Role | Access Level | Can See |
|------|-------------|---------|
| **Admin** | Full system access | All projects, plots, listings, commissions, partners, financials, users |
| **Agent** | Limited to owned data | Own listings, own commissions, own notifications, own leads |
| **User/Public** | Public data only | Approved listings, public projects |

---

## 📁 Project Structure

```
real_estate_management_system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # Helpers
│   │   └── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js pages
│   │   ├── admin/          # Admin pages
│   │   ├── agent/          # Agent pages
│   │   ├── auth/           # Login/register
│   │   ├── properties/     # Public property pages
│   │   └── page.tsx        # Homepage
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts (Auth)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # API client, utilities
│   └── package.json
└── README.md
```

---

## 🎯 Key Features Implemented

### ✅ Core Functionality
- [x] User authentication (JWT)
- [x] Role-based access control
- [x] Agent approval system
- [x] Project & plot management
- [x] Property listings
- [x] Commission tracking
- [x] Installment plans
- [x] Lead management
- [x] Partner & profit management
- [x] Financial ledger
- [x] Notifications system
- [x] Reports & analytics

### ✅ Data Management
- [x] **NO MOCK DATA** - All data from MongoDB
- [x] Real-time updates
- [x] Pagination on all lists
- [x] Search & filtering
- [x] Role-based data filtering

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST /auth/register       # Register new user
POST /auth/login          # Login
GET  /auth/me             # Get current user
PUT  /auth/update-profile # Update profile
```

### Projects
```
GET    /projects          # Get all projects (paginated)
GET    /projects/:id      # Get project by ID
POST   /projects          # Create project (admin)
PUT    /projects/:id      # Update project (admin)
DELETE /projects/:id      # Delete project (admin)
```

### Plots
```
GET    /plots             # Get all plots (paginated)
GET    /plots/:id         # Get plot by ID
POST   /plots             # Create plot (admin)
PUT    /plots/:id         # Update plot (admin)
DELETE /plots/:id         # Delete plot (admin)
```

### Listings
```
GET    /listings          # Get all listings (paginated)
GET    /listings/:id      # Get listing by ID
POST   /listings          # Create listing (agent)
PUT    /listings/:id      # Update listing (agent)
DELETE /listings/:id      # Delete listing (agent/admin)
PUT    /listings/:id/approve  # Approve listing (admin)
PUT    /listings/:id/reject   # Reject listing (admin)
```

### Agent Routes (Requires Agent Role)
```
GET    /agent/notifications           # Get agent's notifications
PUT    /agent/notifications/:id/read  # Mark notification as read
PUT    /agent/notifications/read-all  # Mark all as read
DELETE /agent/notifications/:id       # Delete notification

GET    /agent/leads                   # Get agent's leads
POST   /agent/leads                   # Create lead
PUT    /agent/leads/:id               # Update lead
DELETE /agent/leads/:id               # Delete lead
```

### Commissions
```
GET    /commissions       # Get commissions (filtered by role)
GET    /commissions/:id   # Get commission by ID
POST   /commissions       # Create commission (admin)
PUT    /commissions/:id/approve  # Approve commission (admin)
PUT    /commissions/:id/pay      # Mark as paid (admin)
```

### Partners
```
GET    /partners          # Get all partners (admin)
GET    /partners/:id      # Get partner by ID
POST   /partners          # Create partner (admin)
PUT    /partners/:id      # Update partner (admin)
POST   /partners/:id/capital           # Add capital transaction
GET    /partners/:id/capital-history   # Get capital history
GET    /partners/:id/profit-distribution # Get profit distribution
```

---

## 🔍 Query Parameters

### Pagination
```
?page=1&limit=20
```

### Filtering
```
# Projects
?status=ongoing&city=Lahore

# Listings
?agentId=xyz&status=approved&city=Islamabad&minPrice=1000000&maxPrice=5000000

# Commissions
?agentId=xyz&status=pending
```

---

## 🎨 Frontend Components

### Custom Hooks

#### useAuth
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

#### useProjects
```typescript
const { projects, loading, error, pagination } = useProjects({
  status: 'ongoing',
  city: 'Lahore',
  page: 1,
  limit: 20
});
```

#### useListings
```typescript
// Agent's own listings
const { listings, loading } = useListings({ myListings: true });

// All listings (admin)
const { listings, loading } = useListings({ status: 'approved' });
```

#### useCommissions
```typescript
const { commissions, loading } = useCommissions({ agentId: user?.id });
```

---

### API Client (lib/api.ts)

```typescript
import { projectAPI, plotAPI, listingAPI, notificationAPI, partnerAPI } from '@/lib/api';

// Example usage
const projects = await projectAPI.getAll({ status: 'ongoing' });
const listing = await listingAPI.getById(id);
const notifications = await notificationAPI.getMyNotifications();
```

---

## 🛡️ Authentication Flow

### Login
```typescript
const response = await authAPI.login({ email, password });
// Token automatically stored in localStorage
// Axios interceptor adds token to all requests
```

### Protected Routes
```typescript
// Backend middleware
router.use(authenticate);           // Verify JWT token
router.use(roleGuard('admin'));     // Check role
```

### Frontend Auth Check
```typescript
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/auth/login" />;
}

if (user?.role !== 'admin') {
  return <div>Access denied</div>;
}
```

---

## 🗃️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'agent', 'user'],
  status: ['pending', 'approved', 'rejected', 'suspended'],
  approvedByAdmin: Boolean,
  phone: String,
  cnic: String,
  ...
}
```

### Project Model
```javascript
{
  name: String,
  code: String (unique),
  location: { city, area, address },
  totalAreaMarla: Number,
  status: ['planning', 'ongoing', 'completed', 'on-hold'],
  pricing: { minPrice, maxPrice, pricePerMarla },
  details: { description, features, amenities },
  ...
}
```

### Listing Model
```javascript
{
  agentId: ObjectId (ref: User),
  projectId: ObjectId (ref: Project),
  plotId: ObjectId (ref: Plot),
  title: String,
  description: String,
  price: Number,
  status: ['pending', 'approved', 'rejected', 'sold', 'expired'],
  location: { city, area, address },
  ...
}
```

---

## 🎯 Common Tasks

### Create New Page

1. **Create page file:**
```typescript
// frontend/app/admin/my-page/page.tsx
"use client";
import { useState, useEffect } from "react";

export default function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  return <div>My Page</div>;
}
```

2. **Add route (if needed):**
```javascript
// backend/src/routes/myroute.routes.js
router.get('/', authenticate, roleGuard('admin'), getAll);
```

3. **Add to navigation:**
```typescript
// frontend/components/layout/sidebar.tsx
{ name: 'My Page', href: '/admin/my-page', icon: Icon }
```

---

### Add New API Endpoint

1. **Create controller:**
```javascript
// backend/src/controllers/mycontroller.controller.js
export const getMyData = async (req, res, next) => {
  try {
    const data = await Model.find();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
```

2. **Create route:**
```javascript
// backend/src/routes/myroute.routes.js
import { getMyData } from '../controllers/mycontroller.controller.js';
router.get('/mydata', authenticate, getMyData);
```

3. **Register route:**
```javascript
// backend/src/server.js
import myRoutes from './routes/myroute.routes.js';
app.use('/api/myroute', myRoutes);
```

4. **Add to frontend API client:**
```typescript
// frontend/lib/api.ts
export const myAPI = {
  getData: () => api.get('/myroute/mydata'),
};
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Token invalid or expired"
```
Solution: Clear localStorage and login again
localStorage.clear();
```

**Issue:** "CORS error"
```
Solution: Check backend CORS configuration in server.js
app.use(cors({ origin: 'http://localhost:3000' }));
```

**Issue:** "Cannot fetch data"
```
Solution: 
1. Check backend is running on port 5000
2. Check MongoDB connection
3. Check API endpoint in browser/Postman
4. Check browser console for errors
```

**Issue:** "Pagination not working"
```
Solution: Ensure backend controller returns pagination metadata
res.json({
  data: items,
  pagination: { page, limit, total, pages }
});
```

---

## 📊 Performance Tips

1. **Use pagination** on all lists:
   ```typescript
   const { items, pagination } = useItems({ page: 1, limit: 20 });
   ```

2. **Filter on backend**, not frontend:
   ```typescript
   // Good: Backend filters
   const { listings } = useListings({ status: 'approved' });
   
   // Bad: Fetch all then filter
   const all = await listingAPI.getAll();
   const filtered = all.filter(x => x.status === 'approved');
   ```

3. **Use loading states** to prevent layout shift:
   ```typescript
   if (loading) return <Spinner />;
   ```

4. **Add empty states** for better UX:
   ```typescript
   if (items.length === 0) return <EmptyState />;
   ```

---

## 📝 Code Style Guidelines

### TypeScript Interfaces
```typescript
export interface Project {
  _id: string;
  name: string;
  location: {
    city: string;
    area?: string;
  };
  status: "planning" | "ongoing" | "completed";
}
```

### Error Handling
```typescript
try {
  const response = await api.call();
  setData(response.data);
} catch (err: any) {
  setError(err.response?.data?.message || "Failed to fetch");
} finally {
  setLoading(false);
}
```

### Component Structure
```typescript
export default function MyComponent() {
  // 1. State
  const [data, setData] = useState([]);
  
  // 2. Hooks
  const { user } = useAuth();
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Handlers
  const handleClick = () => {};
  
  // 5. Render
  return <div>...</div>;
}
```

---

## 🔒 Security Best Practices

1. **Never expose sensitive data in frontend**
2. **Always validate on backend**, not just frontend
3. **Use environment variables** for secrets
4. **Sanitize user input** before database queries
5. **Implement rate limiting** (already done)
6. **Use HTTPS** in production
7. **Keep dependencies updated**

---

## 📚 Additional Resources

- **MongoDB Documentation:** https://docs.mongodb.com
- **Next.js Documentation:** https://nextjs.org/docs
- **Express.js Documentation:** https://expressjs.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **JWT Authentication:** https://jwt.io

---

## 🆘 Need Help?

1. Check `SYSTEM_CLEANUP_COMPLETE.md` for detailed documentation
2. Review `backend/POSTMAN_COLLECTION.json` for API examples
3. Check existing code for patterns
4. Read error messages carefully

---

**Last Updated:** 2024  
**Version:** 1.0
