import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  installmentNo: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paidDate: Date,
  paidAmount: {
    type: Number,
    default: 0,
  },
  paymentReference: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'partial'],
    default: 'pending',
  },
  lateFee: {
    type: Number,
    default: 0,
  },
  notes: String,
});

const installmentPlanSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer ID is required'],
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
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    downPayment: {
      type: Number,
      required: [true, 'Down payment is required'],
      default: 0,
    },
    downPaymentPaid: {
      type: Boolean,
      default: false,
    },
    downPaymentDate: Date,
    installments: [installmentSchema],
    startDate: {
      type: Date,
      default: Date.now,
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'bi-annual', 'annual', 'custom'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'defaulted'],
      default: 'active',
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
    },
    nextDueDate: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
installmentPlanSchema.index({ buyerId: 1 });
installmentPlanSchema.index({ plotId: 1 });
installmentPlanSchema.index({ status: 1 });
installmentPlanSchema.index({ nextDueDate: 1 });

// Calculate remaining amount before save
installmentPlanSchema.pre('save', function (next) {
  const paid = this.installments.reduce(
    (sum, inst) => sum + (inst.paidAmount || 0),
    0
  );
  this.totalPaid = paid + (this.downPaymentPaid ? this.downPayment : 0);
  this.remainingAmount = this.totalAmount - this.totalPaid;

  // Find next due date
  const nextDue = this.installments.find(
    (inst) => !inst.paid && new Date(inst.dueDate) >= new Date()
  );
  this.nextDueDate = nextDue ? nextDue.dueDate : null;

  next();
});

export default mongoose.model('InstallmentPlan', installmentPlanSchema);

