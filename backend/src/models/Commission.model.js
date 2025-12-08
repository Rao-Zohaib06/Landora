import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent ID is required'],
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
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
    },
    amount: {
      type: Number,
      required: [true, 'Commission amount is required'],
      min: 0,
    },
    calculatedAmount: Number, // Original calculated amount
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommissionRule',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'cancelled'],
      default: 'pending',
    },
    paymentDate: Date,
    paymentReference: String,
    notes: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
commissionSchema.index({ agentId: 1 });
commissionSchema.index({ plotId: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ createdAt: -1 });

export default mongoose.model('Commission', commissionSchema);

