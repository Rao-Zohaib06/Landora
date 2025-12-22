# Admin Panel Testing Guide

## 🚀 Quick Start

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend server running on `http://localhost:3000`
3. MongoDB connected and running
4. Admin account created and logged in

### Admin Login
```
URL: http://localhost:3000/auth/login
Email: admin@example.com (or your admin account)
Password: your_admin_password
```

After login, navigate to: `http://localhost:3000/admin/dashboard`

---

## 📋 Testing Checklist

### 1. User Management (`/admin/users`)

#### Display Tests
- [ ] Navigate to `/admin/users`
- [ ] Verify statistics cards show:
  - Total Users count
  - Active Users count
  - Pending Approval count (agents awaiting approval)
  - Total Agents count
- [ ] Verify users table displays with columns:
  - Name
  - Email
  - Phone
  - Role (with colored badges)
  - Status (with colored badges)
  - Created date
  - Actions (Edit/Delete buttons)

#### Search Tests
- [ ] Type in search box
- [ ] Verify filtering by name works
- [ ] Verify filtering by email works
- [ ] Verify filtering by phone works

#### Role Filter Tests
- [ ] Click "All" tab → shows all users
- [ ] Click "Admin" tab → shows only admins
- [ ] Click "Agent" tab → shows only agents
- [ ] Click "User" tab → shows only regular users

#### Edit User Tests
1. [ ] Click Edit button on any user
2. [ ] Verify edit dialog opens
3. [ ] Verify all fields are populated:
   - Name
   - Email
   - Phone
   - Role (dropdown)
   - Status (dropdown)
4. [ ] Change name → Click "Save Changes"
5. [ ] Verify success and page refreshes
6. [ ] Verify changes are saved
7. [ ] Test changing role (user → agent → admin)
8. [ ] Test changing status (active → pending → suspended → inactive)

#### Delete User Tests
1. [ ] Click Delete button (red trash icon)
2. [ ] Verify confirmation dialog appears
3. [ ] Verify user details are shown
4. [ ] Click "Cancel" → dialog closes, nothing deleted
5. [ ] Click Delete again
6. [ ] Click "Delete User" → user is removed
7. [ ] Verify user disappears from list

#### Error Handling Tests
- [ ] Disconnect internet → verify error message appears
- [ ] Try editing with invalid email → verify validation
- [ ] Try deleting non-existent user → verify error message

---

### 2. Agent Approval (`/admin/agents`)

#### Display Tests
- [ ] Navigate to `/admin/agents`
- [ ] Verify "Pending" tab shows agents with status = pending
- [ ] Verify "All" tab shows all agents regardless of status
- [ ] Verify agent cards display:
  - Name
  - Email
  - Phone
  - Status badge
  - License number (if available)
  - Agency (if available)
  - Experience
  - Specializations

#### Approval Tests
1. [ ] Find a pending agent
2. [ ] Click "Approve" button
3. [ ] Verify agent disappears from pending list
4. [ ] Check "All" tab → agent status should be "Active"
5. [ ] Verify agent can now login successfully

#### Rejection Tests
1. [ ] Find a pending agent
2. [ ] Click "Reject" button
3. [ ] Enter rejection reason in prompt
4. [ ] Verify agent status changes to "Rejected"
5. [ ] Verify agent cannot login

#### Suspension Tests
1. [ ] Find an active agent in "All" tab
2. [ ] Click "Suspend" button
3. [ ] Enter suspension reason
4. [ ] Verify agent status changes to "Suspended"
5. [ ] Verify agent cannot login

#### Reactivation Tests
1. [ ] Find a suspended agent
2. [ ] Click "Activate" button
3. [ ] Verify agent status changes to "Active"
4. [ ] Verify agent can login again

---

### 3. Projects Management (`/admin/projects`)

#### Display Tests
- [ ] Navigate to `/admin/projects`
- [ ] Verify projects grid displays
- [ ] Verify each project card shows:
  - Project name
  - Location (city)
  - Total plots
  - Sold plots
  - Progress bar
  - Status

#### Search Tests
- [ ] Type project name → verify filtering
- [ ] Type city name → verify filtering

#### Create Project Tests
1. [ ] Click "Add Project" button
2. [ ] Fill in project details
3. [ ] Submit form
4. [ ] Verify new project appears in list

#### Edit Project Tests
1. [ ] Click on a project card
2. [ ] Verify project details page loads
3. [ ] Edit project information
4. [ ] Save changes
5. [ ] Verify changes are reflected

---

### 4. Plots Management (`/admin/plots`)

#### Display Tests
- [ ] Navigate to `/admin/plots`
- [ ] Verify plots table displays
- [ ] Verify columns show:
  - Plot number
  - Project name
  - Size
  - Price
  - Status
  - Actions

#### Filter Tests
- [ ] Test status filters:
  - Available
  - Sold
  - Blocked
  - Disputed
  - Reserved
- [ ] Test project filter dropdown
- [ ] Verify multiple filters work together

#### Search Tests
- [ ] Search by plot number
- [ ] Search by project name

#### Create Plot Tests
1. [ ] Click "Add Plot"
2. [ ] Select project
3. [ ] Fill plot details
4. [ ] Submit
5. [ ] Verify plot appears in list

---

### 5. Commissions (`/admin/commissions`)

#### Display Tests
- [ ] Navigate to `/admin/commissions`
- [ ] Verify statistics cards show:
  - Total commissions
  - Paid amount
  - Pending amount
- [ ] Verify commissions table displays

#### Filter Tests
- [ ] Filter by agent
- [ ] Filter by status (pending/paid/cancelled)
- [ ] Filter by date range

#### Payment Tests
1. [ ] Find pending commission
2. [ ] Mark as paid
3. [ ] Verify status updates
4. [ ] Verify statistics update

---

### 6. Partners (`/admin/partners`)

#### Display Tests
- [ ] Navigate to `/admin/partners`
- [ ] Verify partners list displays
- [ ] Verify partner cards show:
  - Name
  - Share percentage
  - Total investment
  - Returns

#### Search Tests
- [ ] Search by partner name
- [ ] Search by project

---

### 7. Ledgers (`/admin/ledgers`)

#### Display Tests
- [ ] Navigate to `/admin/ledgers`
- [ ] Verify ledger entries table displays
- [ ] Verify columns show:
  - Date
  - Transaction type
  - Amount
  - Description
  - Related entity

#### Filter Tests
- [ ] Filter by transaction type (income/expense)
- [ ] Filter by date range
- [ ] Filter by amount range

---

### 8. Bank Accounts (`/admin/bank-accounts`)

#### Display Tests
- [ ] Navigate to `/admin/bank-accounts`
- [ ] Verify bank accounts list displays
- [ ] Verify account cards show:
  - Account title
  - Account number
  - Bank name
  - Balance

#### Create Account Tests
1. [ ] Click "Add Account"
2. [ ] Fill account details
3. [ ] Submit
4. [ ] Verify account appears

---

### 9. Installments (`/admin/installments`)

#### Display Tests
- [ ] Navigate to `/admin/installments`
- [ ] Verify installment plans display
- [ ] Verify each plan shows:
  - Plot/property details
  - Total amount
  - Paid amount
  - Due amount
  - Payment schedule

#### Payment Tests
1. [ ] Find an installment
2. [ ] Record payment
3. [ ] Verify payment is recorded
4. [ ] Verify balances update

---

### 10. Seller Payments (`/admin/seller-payments`)

#### Display Tests
- [ ] Navigate to `/admin/seller-payments`
- [ ] Verify seller payments list displays
- [ ] Verify payment details show:
  - Seller name
  - Plot details
  - Amount
  - Payment date
  - Status

---

### 11. Reports (`/admin/reports`)

#### Display Tests
- [ ] Navigate to `/admin/reports`
- [ ] Verify report types are available:
  - Sales report
  - Commission report
  - Financial report
  - Agent performance

#### Generation Tests
1. [ ] Select report type
2. [ ] Select date range
3. [ ] Click "Generate"
4. [ ] Verify report displays
5. [ ] Test export to PDF/CSV (if available)

---

### 12. Dashboard (`/admin/dashboard`)

#### Display Tests
- [ ] Navigate to `/admin/dashboard`
- [ ] Verify overview statistics display:
  - Total users
  - Total agents
  - Total projects
  - Total plots
  - Active listings
  - Pending approvals
- [ ] Verify recent activities display
- [ ] Verify quick actions are available

---

## 🔍 General Tests (All Pages)

### Navigation Tests
- [ ] Verify sidebar navigation works
- [ ] Verify all menu items are clickable
- [ ] Verify active page is highlighted
- [ ] Verify breadcrumbs show correct path

### Responsive Tests
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all features work on all screen sizes

### Loading States
- [ ] Verify loading spinner appears while fetching data
- [ ] Verify skeleton screens (if any) display properly
- [ ] Verify loading doesn't block UI unnecessarily

### Error States
- [ ] Verify error messages display clearly
- [ ] Verify error messages are user-friendly
- [ ] Verify retry options are available
- [ ] Verify error doesn't crash the application

### Empty States
- [ ] Verify empty states display when no data
- [ ] Verify empty state messages are helpful
- [ ] Verify call-to-action buttons are available

### Performance Tests
- [ ] Verify pages load within 2 seconds
- [ ] Verify no console errors
- [ ] Verify no memory leaks
- [ ] Verify smooth scrolling
- [ ] Verify animations are smooth

---

## 🐛 Common Issues & Solutions

### Issue: Users table is empty
**Solution**: 
1. Check if backend is running
2. Check MongoDB connection
3. Check browser console for API errors
4. Verify JWT token is valid

### Issue: Edit/Delete buttons not working
**Solution**:
1. Check browser console for errors
2. Verify admin permissions
3. Check network tab for API calls
4. Verify dialog component is installed

### Issue: Agent approval not working
**Solution**:
1. Check agent status in database
2. Verify agent approval API endpoints
3. Check backend logs for errors
4. Verify admin permissions

### Issue: Statistics showing 0
**Solution**:
1. Check if data exists in database
2. Verify API responses in network tab
3. Check calculation logic
4. Refresh the page

---

## ✅ Success Criteria

All admin pages pass when:
- [ ] All display tests pass
- [ ] All CRUD operations work
- [ ] All filters and searches work
- [ ] All error handling works
- [ ] All loading states work
- [ ] All empty states work
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on all devices
- [ ] Performance is acceptable
- [ ] User experience is smooth

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend logs
3. Verify database connection
4. Check API responses in network tab
5. Review this testing guide
6. Check ADMIN_PAGES_IMPLEMENTATION.md for technical details

---

**Happy Testing! 🎉**
