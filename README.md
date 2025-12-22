# Landora - Real Estate Management System

**Zameen ka Har Raaz, Landora Ke Pass**

A comprehensive real estate management system built with Next.js and Node.js, designed to streamline property management, sales, and agent operations in Pakistan.

## 🏗️ Project Overview

Landora is a full-stack real estate management platform featuring:
- Property listing and management
- Agent dashboard and approval system
- Admin panel for complete system control
- Commission tracking and calculations
- Customer and lead management
- Financial tools and calculators
- Installment and payment tracking
- Project and plot management

## 👨‍💻 Developer

**Rao Zohaib**
- Email: raozohaibofficial06@gmail.com
- Phone: +92 303 7550673
- GitHub: [Rao-Zohaib06](https://github.com/Rao-Zohaib06)

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **Animations:** Framer Motion
- **State Management:** Zustand
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer, Cloudinary
- **Email:** Nodemailer
- **Validation:** Express Validator
- **Security:** bcryptjs, express-rate-limit

## 📁 Project Structure

```
real_estate_management_system/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory (routes)
│   ├── components/       # Reusable React components
│   ├── contexts/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and helpers
│   └── public/          # Static assets
│
└── backend/              # Node.js backend API
    └── src/
        ├── config/       # Configuration files
        ├── controllers/  # Route controllers
        ├── middleware/   # Express middleware
        ├── models/       # MongoDB models
        ├── routes/       # API routes
        ├── scripts/      # Utility scripts
        ├── services/     # Business logic
        └── utils/        # Helper functions
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 👤 User Roles

### Admin
- Full system access
- User management (create, edit, delete)
- Agent approval/rejection
- Financial oversight
- System configuration

**Default Admin Credentials:**
```
Email: admin@landora.com
Password: admin123
```

### Agent
- Property listings management
- Lead tracking
- Customer management
- Commission tracking
- Personal dashboard

### Customer/User
- Browse properties
- Contact agents
- Save favorites
- View projects
- Use calculators

## 🎯 Key Features

### For Admins
- ✅ Complete user management
- ✅ Agent approval system
- ✅ Commission tracking & rules
- ✅ Financial reports
- ✅ Plot and project management
- ✅ Bank account management
- ✅ Seller payment tracking
- ✅ Installment monitoring

### For Agents
- ✅ Property listing management
- ✅ Lead management system
- ✅ Customer relationship tracking
- ✅ Commission calculations
- ✅ Personal performance dashboard
- ✅ Notification system

### For Users
- ✅ Advanced property search
- ✅ Property listings (Buy/Rent)
- ✅ Project exploration
- ✅ Property calculators
  - Loan Calculator
  - Area Converter
  - Construction Calculator
- ✅ Contact forms
- ✅ Agent discovery

## 🔌 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Agent Endpoints
- `GET /api/agent/listings` - Get agent listings
- `POST /api/agent/listings` - Create listing
- `GET /api/agent/leads` - Get agent leads
- `GET /api/agent/customers` - Get customers

For complete API documentation, import the `POSTMAN_COLLECTION.json` file in the backend folder.

## 📊 Database Models

- **User** - User accounts (Admin, Agent, Customer)
- **Listing** - Property listings
- **Project** - Real estate projects
- **Plot** - Individual plots
- **Lead** - Sales leads
- **Commission** - Commission records
- **Installment** - Payment installments
- **Partner** - Business partners
- **BankAccount** - Bank accounts
- **Notification** - System notifications

## 🛠️ Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with nodemon
npm run start    # Start production server
npm run seed     # Seed database
npm run test     # Run tests
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- Input validation and sanitization
- Protected routes and middleware
- CORS configuration
- Environment variable protection

## 🎨 Design System

- **Primary Color:** Purple (#6139DB)
- **Dark:** #111111
- **Gray:** #3A3C40
- **Background:** #FAFAFA
- **Typography:** System fonts with custom sizing
- **Components:** Radix UI primitives with custom styling

## 📄 Documentation Files

- `ADMIN_QUICK_START.md` - Admin user guide
- `ADMIN_TESTING_GUIDE.md` - Testing procedures
- `AGENT_DASHBOARD_COMPLETE.md` - Agent features
- `BACKEND_CONNECTION.md` - API integration guide
- `MONGODB_SETUP.md` - Database setup
- `POSTMAN_COLLECTION.json` - API collection

## 🤝 Contributing

This is a personal project by Rao Zohaib. For inquiries or collaboration:
- Email: raozohaibofficial06@gmail.com
- Phone: +92 303 7550673

## 📝 License

MIT License - feel free to use this project for learning and personal purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Pakistan's real estate market needs
- Designed for scalability and performance

---

**© 2024-2025 Landora. Developed by Rao Zohaib. All rights reserved.**

*Zameen ka Har Raaz, Landora Ke Pass* 🏡
