# Agent Approval System - Complete Documentation

## Overview
The Agent Approval System ensures that only verified agents can access the platform and appear on public listings. Admins have complete control over agent approvals, rejections, suspensions, and reactivations.

---

## Backend Implementation

### 1. User Model Updates
**File:** `backend/src/models/User.model.js`

#### New Fields:
```javascript
status: {
  type: String,
  enum: ['active', 'inactive', 'pending', 'suspended', 'rejected'],
  default: 'pending',
}
approvedByAdmin: {
  type: Boolean,
  default: false,
}
approvedAt: {
  type: Date,
}
rejectedAt: {
  type: Date,
}
```

#### Status Flow:
- **pending** → New agent signup (default)
- **active** → Admin approved the agent
- **rejected** → Admin rejected the agent
- **suspended** → Admin suspended an active agent
- **active** (again) → Admin reactivated a suspended agent

---

### 2. Agent Approval Controller
**File:** `backend/src/controllers/agentApproval.controller.js`

#### Endpoints:

**GET /api/admin/agents/pending**
- Returns all agents with status='pending'
- Admin only

**GET /api/admin/agents**
- Returns all agents (filterable by status)
- Query params: `?status=pending|active|rejected|suspended`
- Admin only

**PUT /api/admin/agents/:id/approve**
- Approves an agent
- Sets `status='active'`, `approvedByAdmin=true`, `approvedAt=Date.now()`
- Admin only

**PUT /api/admin/agents/:id/reject**
- Rejects an agent
- Sets `status='rejected'`, `approvedByAdmin=false`, `rejectedAt=Date.now()`
- Body: `{ reason: string }` (optional)
- Admin only

**PUT /api/admin/agents/:id/suspend**
- Suspends an active agent
- Sets `status='suspended'`
- Body: `{ reason: string }` (optional)
- Admin only

**PUT /api/admin/agents/:id/reactivate**
- Reactivates a suspended agent
- Sets `status='active'`
- Only works if agent was previously approved
- Admin only

**GET /api/agents/approved**
- Returns all approved agents (status='active' AND approvedByAdmin=true)
- Public endpoint (no authentication required)
- Used for displaying agents on public pages

---

### 3. Authentication Middleware Updates
**File:** `backend/src/middleware/auth.middleware.js`

#### Agent Status Checks:
```javascript
// Blocks agents with status != 'active'
if (user.status !== 'active') {
  // Special messages for agents
  if (user.role === 'agent' && user.status === 'pending') {
    return res.status(403).json({
      statusCode: 'AGENT_PENDING_APPROVAL',
      message: 'Your agent account is pending approval.'
    });
  }
  if (user.role === 'agent' && user.status === 'rejected') {
    return res.status(403).json({
      statusCode: 'AGENT_REJECTED',
      message: 'Your agent account has been rejected.'
    });
  }
}

// Additional check for agents
if (user.role === 'agent' && !user.approvedByAdmin) {
  return res.status(403).json({
    statusCode: 'AGENT_PENDING_APPROVAL',
    message: 'Your agent account is pending admin approval.'
  });
}
```

#### Result:
- Unapproved agents **CANNOT** access any protected routes
- They receive specific error messages based on their status
- Frontend can detect these errors and display appropriate messages

---

### 4. Routes Configuration
**File:** `backend/src/server.js`

```javascript
import agentApprovalRoutes from './routes/agentApproval.routes.js';
app.use('/api/admin/agents', agentApprovalRoutes);
```

---

## Frontend Implementation

### 1. API Integration
**File:** `frontend/lib/api.ts`

```typescript
export const agentApprovalAPI = {
  getPendingAgents: () => api.get("/admin/agents/pending"),
  getAllAgents: (params?: { status?: string }) => 
    api.get("/admin/agents", { params }),
  approveAgent: (id: string) => 
    api.put(`/admin/agents/${id}/approve`),
  rejectAgent: (id: string, reason?: string) => 
    api.put(`/admin/agents/${id}/reject`, { reason }),
  suspendAgent: (id: string, reason?: string) => 
    api.put(`/admin/agents/${id}/suspend`, { reason }),
  reactivateAgent: (id: string) => 
    api.put(`/admin/agents/${id}/reactivate`),
  getApprovedAgents: () => 
    api.get("/agents/approved"),
};
```

---

### 2. Admin Dashboard Page
**File:** `frontend/app/admin/agents/page.tsx`

#### Features:
- **Two tabs**: Pending Agents | All Agents
- **Agent table** with columns:
  - Agent name & location
  - Contact info (email, phone)
  - Details (agency, experience, license)
  - Status badge
  - Registration date
  - Action buttons

#### Action Buttons:
- **Pending agents**: Approve | Reject
- **Active agents**: Suspend
- **Suspended agents**: Reactivate
- **Processing state**: Buttons disabled while action in progress

#### Status Badges:
- 🟡 **Pending** - Yellow badge with clock icon
- 🟢 **Active** - Green badge with check icon
- 🔴 **Rejected** - Red badge with X icon
- ⚫ **Suspended** - Gray badge

---

### 3. Agent Dashboard Updates
**File:** `frontend/app/agent/page.tsx`

#### Status Checks (Before showing dashboard):

**1. Pending Approval:**
```tsx
if (user?.status === "pending" || !user?.approvedByAdmin) {
  return <PendingApprovalCard />;
}
```
Shows:
- Clock icon
- "Account Pending Approval" title
- Information about review process
- What features they'll get after approval
- Yellow status badge

**2. Rejected:**
```tsx
if (user?.status === "rejected") {
  return <RejectedCard />;
}
```
Shows:
- X icon
- "Account Not Approved" title
- Contact support message
- Red status badge

**3. Suspended:**
```tsx
if (user?.status === "suspended") {
  return <SuspendedCard />;
}
```
Shows:
- Alert icon
- "Account Suspended" title
- Contact admin message
- Gray status badge

**4. Active & Approved:**
Only then show the full dashboard with:
- Green "Status: Active & Approved" badge
- All performance metrics
- Full functionality

---

### 4. Custom Hook
**File:** `frontend/hooks/use-agents-approval.ts`

```typescript
// For admin use
export function useAgents(params?: { status?: string }) {
  // Returns: agents, loading, error, refetch,
  // approveAgent, rejectAgent, suspendAgent, reactivateAgent
}

// For public use
export function useApprovedAgents() {
  // Returns: agents (approved only), loading, error
}
```

---

## User Flow

### Agent Registration Flow:
1. User signs up with role='agent'
2. Account created with `status='pending'`, `approvedByAdmin=false`
3. Agent receives success message
4. Agent logs in → sees "Pending Approval" screen
5. Agent CANNOT access any protected routes

### Admin Approval Flow:
1. Admin logs in
2. Navigates to `/admin/agents`
3. Sees "Pending Agents" tab with all pending agents
4. Reviews agent details
5. Clicks **Approve** → Agent immediately becomes active
6. Agent can now access full dashboard

### Agent Post-Approval:
1. Agent logs in
2. Sees full dashboard with green "Active & Approved" badge
3. Has access to all features:
   - Lead management
   - Listing creation
   - Commission tracking
   - Customer tools
   - Analytics

### Public Visibility:
1. Only approved agents (status='active' AND approvedByAdmin=true) appear on:
   - Property listings
   - Agent directory
   - Contact pages
2. API endpoint: `GET /api/agents/approved` (public, no auth required)

---

## Testing Checklist

### Backend Tests:
- ✅ Agent signup creates user with status='pending'
- ✅ Unapproved agent cannot access protected routes
- ✅ Admin can fetch pending agents
- ✅ Admin can approve agent → agent status becomes 'active'
- ✅ Admin can reject agent → agent status becomes 'rejected'
- ✅ Admin can suspend active agent
- ✅ Admin can reactivate suspended agent
- ✅ Public endpoint returns only approved agents

### Frontend Tests:
- ✅ Pending agent sees approval waiting screen
- ✅ Rejected agent sees rejection message
- ✅ Suspended agent sees suspension message
- ✅ Approved agent sees full dashboard
- ✅ Admin can view pending agents table
- ✅ Admin can approve/reject with single click
- ✅ Status badges display correctly
- ✅ Actions trigger re-fetch of agent list

---

## Security Considerations

1. **Authentication Required**: All admin endpoints require authentication + admin role
2. **Agent Blocking**: Unapproved agents cannot bypass the check
3. **Status Validation**: Backend validates all status transitions
4. **No Hardcoded Data**: All agents come from MongoDB
5. **Public Endpoint**: Only approved agents are exposed publicly

---

## API Response Examples

### GET /api/admin/agents/pending
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+92 300 1234567",
        "status": "pending",
        "approvedByAdmin": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "agentProfile": {
          "agency": "Prime Properties",
          "experience": 5,
          "licenseNumber": "AP-12345"
        }
      }
    ],
    "count": 1
  }
}
```

### PUT /api/admin/agents/:id/approve
```json
{
  "success": true,
  "message": "Agent approved successfully",
  "data": {
    "agent": {
      "_id": "...",
      "name": "John Doe",
      "status": "active",
      "approvedByAdmin": true,
      "approvedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

---

## Summary

The Agent Approval System is now **fully implemented** with:
- ✅ Complete backend API
- ✅ Admin approval dashboard
- ✅ Agent status display
- ✅ Access control at middleware level
- ✅ Public approved agents endpoint
- ✅ No hardcoded data
- ✅ Real-time status updates

All agents must be approved by admin before accessing the platform or appearing publicly.
