# Landora Real Estate Management System - Backend API

Complete backend API for the Landora Real Estate Management System built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/landora?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_REFRESH_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (username/password)
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/landora`
6. Add connection string to `.env` as `MONGODB_URI`

### Running the Server

**Development mode (with auto-reload)**
```bash
npm run dev
```

**Production mode**
```bash
npm start
```

**Seed database with sample data**
```bash
npm run seed
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/             # Route controllers
│   │   ├── auth.controller.js
│   │   └── plot.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/                  # Mongoose models
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   ├── Plot.model.js
│   │   ├── Partner.model.js
│   │   ├── Commission.model.js
│   │   ├── CommissionRule.model.js
│   │   ├── InstallmentPlan.model.js
│   │   ├── SellerPayment.model.js
│   │   ├── LedgerEntry.model.js
│   │   ├── BankAccount.model.js
│   │   └── Listing.model.js
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── plot.routes.js
│   │   └── ...
│   ├── services/                # Business logic
│   │   ├── commission.service.js
│   │   ├── saleWorkflow.service.js
│   │   └── profitDistribution.service.js
│   ├── utils/                   # Utilities
│   │   ├── jwt.utils.js
│   │   ├── email.utils.js
│   │   └── csvParser.utils.js
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   └── server.js                # Express app entry point
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## 🔐 Authentication

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92 300 1234567",
  "password": "password123",
  "role": "user"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@landora.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@landora.com",
      "role": "admin"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

### Using Token
Include token in Authorization header:
```
Authorization: Bearer <token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### Plots
- `GET /api/plots` - Get all plots (with filters)
- `GET /api/plots/:id` - Get single plot
- `POST /api/plots` - Create plot (Admin only)
- `PUT /api/plots/:id` - Update plot (Admin only)
- `DELETE /api/plots/:id` - Delete plot (Admin only)
- `POST /api/plots/:id/assign-buyer` - Assign buyer (Admin only)
- `POST /api/plots/:id/transfer` - Transfer ownership (Admin only)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin only)

### Commissions
- `GET /api/commissions` - Get commissions
- `POST /api/commissions/calculate` - Calculate commission (Admin only)

### Other Endpoints
- `/api/users` - User management
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

## 🔄 Sale Workflow

When a plot is sold, the system automatically:

1. Updates plot status to "sold"
2. Creates installment plan (if payment mode is installments)
3. Calculates and creates commission record
4. Creates seller payment record
5. Updates ledger entries
6. Sends notification emails

Example API call:
```bash
POST /api/plots/:plotId/sell
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "buyerId": "buyer-user-id",
  "salePrice": 5000000,
  "paymentMode": "installments",
  "installmentPlan": {
    "downPayment": 1000000,
    "frequency": "monthly",
    "installments": [
      {
        "dueDate": "2024-02-01",
        "amount": 200000
      }
    ]
  }
}
```

## 📊 Bank Statement Import

### Upload CSV/Excel
```bash
POST /api/imports/bank-statement
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

file: <bank-statement.csv>
bankAccountId: <bank-account-id>
```

The system will:
1. Parse CSV/Excel file
2. Auto-match transactions with ledger entries
3. Return matched and unmatched transactions
4. Allow manual matching for unmatched items

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Default Credentials (After Seeding)

**Admin:**
- Email: `admin@landora.com`
- Password: `admin123`

**Agent:**
- Email: `agent@landora.com`
- Password: `agent123`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting on auth endpoints
- Input validation
- CORS protection

## 📧 Email Notifications

Configure email in `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@landora.com
```

Email notifications are sent for:
- Booking confirmations
- Installment reminders
- Commission approvals
- Payment confirmations

## 🛠️ Development

### Adding New Models
1. Create model in `src/models/`
2. Export from model file
3. Use in controllers and services

### Adding New Routes
1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Import and use in `server.js`

### Business Logic
Place complex business logic in `src/services/` for reusability.

## 📄 License

MIT

## 🤝 Support

For issues and questions, please contact the development team.

