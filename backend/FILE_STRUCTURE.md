# Landora Backend - Complete File Structure

## 📁 Backend Directory Tree

```
backend/
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── POSTMAN_COLLECTION.json      # Postman API collection
├── README.md                    # Complete documentation
├── FILE_STRUCTURE.md            # This file
│
└── src/
    ├── server.js                # Express app entry point
    │
    ├── config/
    │   └── database.js          # MongoDB connection setup
    │
    ├── models/                  # Mongoose Models
    │   ├── User.model.js        # User model (admin/agent/user)
    │   ├── Project.model.js     # Project model
    │   ├── Plot.model.js        # Plot model with transfer history
    │   ├── Partner.model.js     # Partner model with profit distribution
    │   ├── Commission.model.js  # Commission records
    │   ├── CommissionRule.model.js  # Commission calculation rules
    │   ├── InstallmentPlan.model.js # Installment payment plans
    │   ├── SellerPayment.model.js   # Seller payment records
    │   ├── LedgerEntry.model.js     # General ledger entries
    │   ├── BankAccount.model.js     # Bank accounts with transactions
    │   └── Listing.model.js         # Property listings
    │
    ├── middleware/              # Express Middleware
    │   ├── auth.middleware.js   # JWT authentication & role guards
    │   ├── errorHandler.js      # Global error handler
    │   └── rateLimiter.js      # Rate limiting for auth endpoints
    │
    ├── controllers/             # Route Controllers
    │   ├── auth.controller.js   # Authentication (register/login/me)
    │   ├── user.controller.js   # User CRUD operations
    │   ├── project.controller.js # Project CRUD operations
    │   ├── plot.controller.js   # Plot CRUD & transfer operations
    │   └── commission.controller.js # Commission management
    │
    ├── routes/                  # API Routes
    │   ├── auth.routes.js       # /api/auth endpoints
    │   ├── user.routes.js       # /api/users endpoints
    │   ├── project.routes.js    # /api/projects endpoints
    │   ├── plot.routes.js       # /api/plots endpoints
    │   ├── listing.routes.js    # /api/listings endpoints
    │   ├── agent.routes.js      # /api/agents endpoints
    │   ├── partner.routes.js    # /api/partners endpoints
    │   ├── commission.routes.js # /api/commissions endpoints
    │   ├── installment.routes.js # /api/installments endpoints
    │   ├── sellerPayment.routes.js # /api/seller-payments endpoints
    │   ├── ledger.routes.js    # /api/ledgers endpoints
    │   ├── bankAccount.routes.js # /api/bank-accounts endpoints
    │   ├── import.routes.js    # /api/imports endpoints
    │   ├── report.routes.js     # /api/reports endpoints
    │   └── file.routes.js      # /api/files endpoints
    │
    ├── services/                # Business Logic Services
    │   ├── commission.service.js      # Commission calculation logic
    │   ├── saleWorkflow.service.js    # Plot sale workflow automation
    │   └── profitDistribution.service.js # Partner profit distribution
    │
    ├── utils/                   # Utility Functions
    │   ├── jwt.utils.js         # JWT token generation/verification
    │   ├── email.utils.js       # Email sending (nodemailer)
    │   └── csvParser.utils.js   # CSV/Excel parsing utilities
    │
    └── scripts/                 # Database Scripts
        └── seed.js              # Database seeding script
```

## 📋 File Details

### Core Files

1. **server.js** - Main Express application entry point
   - Sets up Express app
   - Configures middleware (CORS, JSON parsing)
   - Registers all routes
   - Handles graceful shutdown
   - Starts server on configured PORT

2. **config/database.js** - MongoDB connection
   - Mongoose connection setup
   - Connection event handlers
   - Graceful shutdown handling

### Models (11 Total)

1. **User.model.js** - User accounts (admin/agent/user)
   - Authentication fields
   - Role-based access
   - Profile & KYC documents
   - Agent-specific fields

2. **Project.model.js** - Real estate projects
   - Location & area details
   - Status tracking
   - Blocks & phases
   - Pricing information

3. **Plot.model.js** - Individual plots
   - Plot details (size, block, phase)
   - Ownership tracking (buyer/seller)
   - Transfer history
   - Co-ownership support
   - Booking system

4. **Partner.model.js** - Business partners
   - Share percentage
   - Investment tracking
   - Profit distribution records
   - Capital transactions

5. **Commission.model.js** - Agent commissions
   - Commission amounts
   - Status tracking (pending/approved/paid)
   - Payment references

6. **CommissionRule.model.js** - Commission calculation rules
   - Project-specific or general rules
   - Plot size ranges
   - Percent or fixed amounts
   - Priority system

7. **InstallmentPlan.model.js** - Payment plans
   - Installment schedules
   - Payment tracking
   - Due date management

8. **SellerPayment.model.js** - Seller payments
   - Payment amounts & dates
   - Status tracking
   - Payment references

9. **LedgerEntry.model.js** - General ledger
   - Debit/Credit entries
   - Account categorization
   - Reference tracking
   - Reconciliation support

10. **BankAccount.model.js** - Bank accounts
    - Account details
    - Transaction history
    - Auto-matching support

11. **Listing.model.js** - Property listings
    - Agent-created listings
    - Approval workflow
    - Media attachments

### Middleware

1. **auth.middleware.js**
   - `authenticate` - JWT verification
   - `roleGuard` - Role-based access control

2. **errorHandler.js**
   - Global error handler
   - Mongoose error formatting
   - Development error details

3. **rateLimiter.js**
   - Auth endpoint rate limiting
   - General API rate limiting

### Controllers

1. **auth.controller.js** - Authentication endpoints
2. **user.controller.js** - User management
3. **project.controller.js** - Project CRUD
4. **plot.controller.js** - Plot management & transfers
5. **commission.controller.js** - Commission management

### Services

1. **commission.service.js**
   - Calculate commission based on rules
   - Create commission records
   - Approve & pay commissions

2. **saleWorkflow.service.js**
   - Complete sale workflow automation
   - Creates installments, commissions, payments
   - Updates ledger entries

3. **profitDistribution.service.js**
   - Calculate partner profit shares
   - Distribute profits
   - Track distributions

### Utilities

1. **jwt.utils.js** - Token generation/verification
2. **email.utils.js** - Email notifications
3. **csvParser.utils.js** - CSV/Excel parsing & bank matching

### Scripts

1. **seed.js** - Database seeding
   - Creates admin & agent users
   - Sample project & plots
   - Commission rules
   - Partners

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh token
- `GET /me` - Get current user
- `POST /logout` - Logout

### Users (`/api/users`)
- `GET /` - Get all users (Admin)
- `GET /:id` - Get user (Admin)
- `POST /` - Create user (Admin)
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (Admin)
- `GET /me` - Get own profile
- `PUT /me` - Update own profile

### Projects (`/api/projects`)
- `GET /` - Get all projects
- `GET /:id` - Get project
- `POST /` - Create project (Admin)
- `PUT /:id` - Update project (Admin)
- `DELETE /:id` - Delete project (Admin)

### Plots (`/api/plots`)
- `GET /` - Get all plots (with filters)
- `GET /:id` - Get plot
- `POST /` - Create plot (Admin)
- `PUT /:id` - Update plot (Admin)
- `DELETE /:id` - Delete plot (Admin)
- `POST /:id/assign-buyer` - Assign buyer (Admin)
- `POST /:id/transfer` - Transfer ownership (Admin)

### Commissions (`/api/commissions`)
- `GET /` - Get commissions
- `GET /:id` - Get commission
- `POST /calculate` - Calculate commission (Admin)
- `POST /` - Create commission (Admin)
- `PUT /:id/approve` - Approve commission (Admin)
- `PUT /:id/pay` - Pay commission (Admin)
- `GET /rules` - Get commission rules (Admin)
- `POST /rules` - Create commission rule (Admin)

### Other Endpoints (Placeholders)
- `/api/listings` - Property listings
- `/api/agents` - Agent profiles
- `/api/partners` - Partner management
- `/api/installments` - Installment plans
- `/api/seller-payments` - Seller payments
- `/api/ledgers` - Ledger entries
- `/api/bank-accounts` - Bank accounts
- `/api/imports` - CSV/Excel imports
- `/api/reports` - Financial reports
- `/api/files` - File uploads

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production mode
npm start

# Seed database
npm run seed

# Run tests
npm test
```

## 📝 Environment Variables

See `.env.example` for all required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)
- `EMAIL_*` - Email configuration (optional)
- `CLOUDINARY_*` - File upload configuration (optional)

## 🔐 Default Credentials (After Seeding)

- **Admin**: admin@landora.com / admin123
- **Agent**: agent@landora.com / agent123

## 📊 Database Collections

After seeding, you'll have:
- Users (admin, agent)
- Projects (1 sample project)
- Plots (10 sample plots)
- Commission Rules (3 rules)
- Partners (2 partners)

## 🎯 Next Steps

1. Complete remaining controllers (listings, installments, etc.)
2. Implement report generation endpoints
3. Add file upload functionality
4. Implement bank statement import
5. Add automated reminder jobs
6. Write unit/integration tests

