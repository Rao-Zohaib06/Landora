import mongoose from 'mongoose';

const sellerPaymentSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plot',
      required: [true, 'Plot ID is required'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    mode: {
      type: String,
      enum: ['lump-sum', 'installments'],
      default: 'lump-sum',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: Date,
    paidAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue', 'cancelled'],
      default: 'pending',
    },
    paymentReference: String,
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount',
    },
    notes: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sellerPaymentSchema.index({ sellerId: 1 });
sellerPaymentSchema.index({ plotId: 1 });
sellerPaymentSchema.index({ status: 1 });
sellerPaymentSchema.index({ dueDate: 1 });

export default mongoose.model('SellerPayment', sellerPaymentSchema);

