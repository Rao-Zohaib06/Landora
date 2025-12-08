import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true,
  },
  balance: Number,
  reference: String,
  matched: {
    type: Boolean,
    default: false,
  },
  matchedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LedgerEntry',
  },
  category: String,
  notes: String,
});

const bankAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Account name is required'],
    },
    bank: {
      type: String,
      required: [true, 'Bank name is required'],
    },
    accountNo: {
      type: String,
      required: [true, 'Account number is required'],
      unique: true,
    },
    accountType: {
      type: String,
      enum: ['current', 'savings', 'business'],
      default: 'current',
    },
    currency: {
      type: String,
      default: 'PKR',
      enum: ['PKR', 'USD', 'EUR'],
    },
    balance: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    openingDate: {
      type: Date,
      default: Date.now,
    },
    iban: String,
    swiftCode: String,
    branch: String,
    transactions: [transactionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
bankAccountSchema.index({ accountNo: 1 });
bankAccountSchema.index({ bank: 1 });
bankAccountSchema.index({ isActive: 1 });

export default mongoose.model('BankAccount', bankAccountSchema);

