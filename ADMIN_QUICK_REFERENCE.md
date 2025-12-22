# 🚀 Admin Panel - Quick Reference

## 📍 Access URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/admin/dashboard` | Overview & statistics |
| **Users** | `/admin/users` | Manage all users (CRUD) |
| **Agent Approval** | `/admin/agents` | Approve/reject agents |
| **Projects** | `/admin/projects` | Manage projects |
| **Plots** | `/admin/plots` | Manage plots |
| **Commissions** | `/admin/commissions` | Track agent commissions |
| **Partners** | `/admin/partners` | Manage partners |
| **Ledgers** | `/admin/ledgers` | View financial ledger |
| **Bank Accounts** | `/admin/bank-accounts` | Manage bank accounts |
| **Installments** | `/admin/installments` | Track installment plans |
| **Seller Payments** | `/admin/seller-payments` | Manage seller payments |
| **Reports** | `/admin/reports` | Generate reports |

---

## 👤 User Management - Quick Actions

### View All Users
1. Go to `/admin/users`
2. See statistics at top (Total, Active, Pending, Agents)
3. View users in table below

### Search Users
- Type in search box to filter by name, email, or phone

### Filter by Role
- Click tabs: **All** | **Admin** | **Agent** | **User**

### Edit User
1. Click **Edit** button (pencil icon)
2. Modify fields in dialog:
   - Name
   - Email
   - Phone
   - Role (dropdown)
   - Status (dropdown)
3. Click **Save Changes**

### Delete User
1. Click **Delete** button (red trash icon)
2. Review user details in confirmation dialog
3. Click **Delete User** to confirm

---

## ✅ Agent Approval - Quick Actions

### View Pending Agents
1. Go to `/admin/agents`
2. Click **Pending** tab
3. See all agents awaiting approval

### Approve Agent
1. Find agent in pending list
2. Click **Approve** button
3. Agent status changes to Active
4. Agent can now login and access commissions

### Reject Agent
1. Find agent in pending list
2. Click **Reject** button
3. Enter rejection reason (optional)
4. Agent cannot login

### Suspend Agent
1. Go to **All** tab
2. Find active agent
3. Click **Suspend** button
4. Enter suspension reason
5. Agent cannot login until reactivated

### Reactivate Agent
1. Find suspended agent
2. Click **Activate** button
3. Agent can login again

---

## 📊 Status & Role Badges

### User Roles (Colors)
- 🟣 **Admin** - Purple badge
- 🔵 **Agent** - Blue badge
- 🟢 **User** - Green badge

### User Status (Colors)
- 🟢 **Active** - Green badge (can login)
- 🟡 **Pending** - Yellow badge (awaiting approval)
- 🔴 **Suspended** - Red badge (blocked)
- ⚪ **Inactive** - Gray badge

---

## 🔑 Key Features

### ✅ Implemented
- Full CRUD for users (Create, Read, Update, Delete)
- Agent approval workflow
- Search & filtering
- Statistics dashboard
- Role-based access control
- Status management
- Confirmation dialogs
- Error handling
- Loading states
- Responsive design

### 🎯 User vs Agent
| Feature | Regular User | Agent |
|---------|-------------|-------|
| **Registration** | Instant active | Pending approval |
| **Login** | Immediate | After approval |
| **Property Browsing** | ✅ Yes | ✅ Yes (after approval) |
| **Commissions** | ❌ No | ✅ Yes (after approval) |
| **Approval Required** | ❌ No | ✅ Yes |

---

## 🛠️ Backend API Endpoints

### User Management
```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get single user
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

### Agent Approval
```
GET    /api/agent-approvals/pending      - Get pending agents
GET    /api/agent-approvals/all          - Get all agents
POST   /api/agent-approvals/:id/approve  - Approve agent
POST   /api/agent-approvals/:id/reject   - Reject agent
POST   /api/agent-approvals/:id/suspend  - Suspend agent
POST   /api/agent-approvals/:id/activate - Reactivate agent
```

---

## 🐛 Troubleshooting

### Users table is empty
**Check:**
1. Backend running? (`http://localhost:5000`)
2. MongoDB connected?
3. Browser console for errors?
4. Network tab for API calls?

### Can't edit/delete users
**Check:**
1. Logged in as admin?
2. Browser console for errors?
3. Dialog component installed?
4. Network tab shows API calls?

### Agent approval not working
**Check:**
1. Agent has role = 'agent'?
2. Agent status = 'pending'?
3. Backend logs for errors?
4. API endpoints working?

---

## ✨ Quick Commands

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Check for Errors
Open browser console (F12) and look for:
- Red errors
- Failed API calls in Network tab
- 404 or 500 status codes

---

## 📖 Full Documentation

For detailed information, see:
1. **ADMIN_UPDATE_COMPLETE.md** - Complete summary
2. **ADMIN_PAGES_IMPLEMENTATION.md** - Technical details
3. **ADMIN_TESTING_GUIDE.md** - Testing instructions
4. **AUTH_SYSTEM_UPDATE.md** - Authentication system

---

## ✅ Everything Works!

All admin pages are:
- ✅ Functional
- ✅ Error-free
- ✅ Properly integrated
- ✅ Documented
- ✅ Production-ready

**You're all set!** 🎉
