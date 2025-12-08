import mongoose from 'mongoose';

const ledgerEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['debit', 'credit'],
      required: [true, 'Entry type is required'],
    },
    account: {
      type: String,
      required: [true, 'Account is required'],
      enum: [
        'buyer',
        'seller',
        'partner',
        'agent-commission',
        'income',
        'expense',
        'bank',
        'cash',
      ],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'plot-sale',
        'installment',
        'commission',
        'seller-payment',
        'partner-profit',
        'capital-injection',
        'capital-withdrawal',
        'expense',
        'other',
      ],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    refType: {
      type: String,
      required: true,
      enum: [
        'Plot',
        'InstallmentPlan',
        'Commission',
        'SellerPayment',
        'Partner',
        'Transaction',
        'BankAccount',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    balance: Number, // Running balance for the account
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank-transfer', 'cheque', 'online', 'other'],
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount',
    },
    reconciled: {
      type: Boolean,
      default: false,
    },
    reconciledAt: Date,
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ledgerEntrySchema.index({ account: 1, date: -1 });
ledgerEntrySchema.index({ refId: 1, refType: 1 });
ledgerEntrySchema.index({ projectId: 1 });
ledgerEntrySchema.index({ userId: 1 });
ledgerEntrySchema.index({ date: -1 });
ledgerEntrySchema.index({ reconciled: 1 });

export default mongoose.model('LedgerEntry', ledgerEntrySchema);

