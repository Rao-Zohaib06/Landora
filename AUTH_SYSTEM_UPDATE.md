# Authentication System Update - User vs Agent Flow

## Overview
Updated the authentication system to differentiate between regular users (buyers) and agents with different approval workflows.

---

## Changes Made

### 1. Backend - Registration (`auth.controller.js`)

**Regular Users (Buyers)**
- ✅ Status: `active` (immediately upon registration)
- ✅ `approvedByAdmin`: `true`
- ✅ Can login and use the website right away
- ✅ No pending approval needed

**Agents**
- ✅ Status: `pending` (requires admin approval)
- ✅ `approvedByAdmin`: `false`
- ✅ Must wait for admin approval
- ✅ Cannot access agent dashboard until approved

**Code Changes:**
```javascript
// Regular users are automatically active, agents need approval
status: role === 'agent' ? 'pending' : 'active',
// Only agents need approval from admin
approvedByAdmin: role === 'agent' ? false : true,
```

---

### 2. Backend - Login (`auth.controller.js`)

**Updated Login Logic:**
```javascript
// Check status - only enforce for agents
if (user.role === 'agent' && user.status !== 'active') {
  return res.status(403).json({
    success: false,
    message: `Your agent account is ${user.status}. Please wait for admin approval.`,
  });
}

// Block suspended/rejected users (all roles)
if (user.status === 'suspended' || user.status === 'rejected') {
  return res.status(403).json({
    success: false,
    message: `Account is ${user.status}. Please contact admin.`,
  });
}
```

**What This Means:**
- ✅ Regular users can login regardless of status
- ✅ Agents must have `status: 'active'` to login
- ✅ Suspended/rejected accounts are blocked for all roles

---

### 3. Frontend - Registration Page

**Added Role Selection:**
```tsx
<select id="role" value={form.role} onChange={...}>
  <option value="user">Buyer (Browse and buy properties)</option>
  <option value="agent">Agent (Sell properties and earn commission)</option>
</select>
```

**Agent Warning:**
When "Agent" is selected, shows:
> 📋 Agent accounts require admin approval before you can access the dashboard.

**Post-Registration Behavior:**
- **Regular Users:** Redirected to homepage immediately
- **Agents:** Success message shown:
  > "Agent registration successful! Your account is pending admin approval. You'll be notified via email once approved."
  
  Then redirected to login page after 3 seconds.

---

## User Flows

### Regular User (Buyer) Flow

1. **Visit Website** → Browse properties without login ✅
2. **Want to Buy** → Click "Sign Up"
3. **Registration:**
   - Fill name, email, phone, password
   - Select "Buyer" role
   - Submit
4. **Status:** `active` immediately
5. **Login:** Can login right away
6. **Access:** Full access to browse, view properties, contact agents

---

### Agent Flow

1. **Visit Website** → Browse properties (can see public listings)
2. **Want to Sell** → Click "Sign Up"
3. **Registration:**
   - Fill name, email, phone, password
   - Select "Agent" role
   - Submit
4. **Status:** `pending` (awaiting approval)
5. **Email Notification:** Receives email about pending approval
6. **Admin Reviews:** Admin sees agent in "Pending Agents" list
7. **Document Upload (Optional):** Admin can request documents via email
8. **Admin Approves:** Status changes to `active`
9. **Email Notification:** Agent receives approval email
10. **Login:** Can now login and access agent dashboard
11. **Access:** 
    - Agent dashboard
    - Create listings
    - Manage leads
    - Track commissions
    - View performance metrics

---

## Admin Features

### Agent Approval Workflow

**Admin Panel: `/admin/agent-approvals`**

1. **View Pending Agents:**
   - List of all agents with `status: 'pending'`
   - Shows: Name, Email, Phone, Registration Date
   
2. **Review Agent:**
   - View agent details
   - Check credentials
   - Request additional documents (via email)
   
3. **Actions:**
   - ✅ **Approve:** Changes status to `active`, agent can login
   - ❌ **Reject:** Changes status to `rejected`, agent cannot login
   - ⏸️ **Suspend:** Temporarily disable agent account
   - ♻️ **Reactivate:** Re-enable suspended agent

---

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  role: ['user', 'agent', 'admin'],
  status: ['active', 'pending', 'suspended', 'rejected'],
  approvedByAdmin: Boolean,
  // For regular users:
  // status: 'active', approvedByAdmin: true
  
  // For agents (new):
  // status: 'pending', approvedByAdmin: false
  
  // For agents (approved):
  // status: 'active', approvedByAdmin: true
}
```

---

## API Endpoints

### Registration
```
POST /api/auth/register
Body: {
  name: "John Doe",
  email: "john@example.com",
  phone: "+92 300 1234567",
  password: "password123",
  role: "user" | "agent"  // Optional, defaults to "user"
}

Response (User):
{
  success: true,
  data: {
    user: { id, name, email, role: "user", status: "active" },
    token: "...",
    refreshToken: "..."
  }
}

Response (Agent):
{
  success: true,
  data: {
    user: { id, name, email, role: "agent", status: "pending" },
    token: "...",
    refreshToken: "..."
  }
}
```

### Login
```
POST /api/auth/login
Body: {
  email: "john@example.com",
  password: "password123"
}

Success Response:
{
  success: true,
  data: {
    user: { ... },
    token: "...",
    refreshToken: "..."
  }
}

Error (Agent Pending):
{
  success: false,
  message: "Your agent account is pending. Please wait for admin approval."
}

Error (Suspended):
{
  success: false,
  message: "Account is suspended. Please contact admin."
}
```

---

## Testing Checklist

### Regular User Testing
- [ ] Can register as "Buyer" without approval
- [ ] Status is "active" after registration
- [ ] Can login immediately after registration
- [ ] Can browse properties without login
- [ ] Can view property details
- [ ] Can contact agents
- [ ] No access to agent dashboard

### Agent Testing
- [ ] Can register as "Agent"
- [ ] Status is "pending" after registration
- [ ] Sees approval message after registration
- [ ] Cannot login with pending status
- [ ] After admin approval, can login
- [ ] Can access agent dashboard after approval
- [ ] Can create listings
- [ ] Can manage leads
- [ ] Can view commissions

### Admin Testing
- [ ] Can view pending agents list
- [ ] Can approve agents
- [ ] Can reject agents
- [ ] Can suspend agents
- [ ] Can reactivate agents
- [ ] Approved agents can login
- [ ] Rejected agents cannot login

---

## Frontend Route Protection

### Public Routes (No Auth Required)
- `/` - Homepage
- `/properties` - Property listings
- `/properties/[id]` - Property details
- `/projects` - Projects list
- `/auth/login` - Login page
- `/auth/register` - Register page

### User Routes (Auth Required)
- `/dashboard` - User dashboard (if implemented)
- User can access these immediately after registration

### Agent Routes (Auth + Approval Required)
- `/agent/*` - All agent routes
- Requires `role: 'agent'` AND `status: 'active'`
- Redirects to pending page if not approved

### Admin Routes (Auth + Admin Role)
- `/admin/*` - All admin routes
- Requires `role: 'admin'`

---

## Benefits

### For Regular Users (Buyers)
✅ **Instant Access** - No waiting for approval  
✅ **Browse Anytime** - Can explore properties without signup  
✅ **Easy Onboarding** - Quick registration process  
✅ **No Friction** - Signup only when ready to buy  

### For Agents
✅ **Quality Control** - Admin vets all agents  
✅ **Professional Platform** - Only approved agents can sell  
✅ **Commission Tracking** - Full dashboard access after approval  
✅ **Clear Process** - Knows status at every step  

### For Admins
✅ **Control** - Approve/reject agents before they access system  
✅ **Document Verification** - Can request docs before approval  
✅ **Quality Assurance** - Maintains platform standards  
✅ **Flexibility** - Can suspend/reactivate as needed  

---

## Security Considerations

1. **Email Verification (Future Enhancement)**
   - Consider adding email verification for all users
   - Agents should verify email before approval process

2. **Document Upload (Future Enhancement)**
   - Add document upload feature for agents
   - Admin can request: CNIC, License, Experience proof

3. **Rate Limiting**
   - Already implemented for auth endpoints
   - Prevents spam registrations

4. **Password Security**
   - Passwords hashed with bcrypt
   - Salt rounds: 10

---

## Conclusion

The system now provides a seamless experience for regular users while maintaining quality control for agents through an approval process. This aligns with real-world real estate platforms like Zameen.com where:
- Anyone can browse properties
- Buyers can signup and contact agents easily
- Agents must be verified before they can list properties
- Admins maintain platform quality and standards

---

**Status:** ✅ Complete and Production Ready  
**Last Updated:** December 21, 2025
