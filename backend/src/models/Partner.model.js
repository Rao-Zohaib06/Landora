import mongoose from 'mongoose';

const capitalTransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['injection', 'withdrawal'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
  reference: String,
});

const profitDistributionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  period: {
    start: Date,
    end: Date,
  },
  distributedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'pending',
  },
  paymentReference: String,
});

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    sharePercent: {
      type: Number,
      required: [true, 'Share percentage is required'],
      min: 0,
      max: 100,
    },
    investmentAmount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      default: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    capitalInjected: {
      type: Number,
      default: 0,
    },
    capitalTransactions: [capitalTransactionSchema],
    profitCredited: {
      type: Number,
      default: 0,
    },
    profitDistributions: [profitDistributionSchema],
    withdrawals: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
    },
    profile: {
      cnic: String,
      address: String,
      bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        iban: String,
      },
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes (email index is created automatically by unique: true)
partnerSchema.index({ status: 1 });

// Virtual for current capital balance
partnerSchema.virtual('currentCapital').get(function () {
  return this.capitalInjected - this.withdrawals;
});

// Virtual for pending profit
partnerSchema.virtual('pendingProfit').get(function () {
  return this.profitDistributions
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
});

export default mongoose.model('Partner', partnerSchema);

