import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import plotRoutes from './routes/plot.routes.js';
import listingRoutes from './routes/listing.routes.js';
import agentRoutes from './routes/agent.routes.js';
import agentApprovalRoutes from './routes/agentApproval.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import commissionRoutes from './routes/commission.routes.js';
import installmentRoutes from './routes/installment.routes.js';
import sellerPaymentRoutes from './routes/sellerPayment.routes.js';
import ledgerRoutes from './routes/ledger.routes.js';
import bankAccountRoutes from './routes/bankAccount.routes.js';
import importRoutes from './routes/import.routes.js';
import reportRoutes from './routes/report.routes.js';
import fileRoutes from './routes/file.routes.js';
import calculatorRoutes from './routes/calculator.routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin/agents', agentApprovalRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/installments', installmentRoutes);
app.use('/api/seller-payments', sellerPaymentRoutes);
app.use('/api/ledgers', ledgerRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/calculators', calculatorRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

