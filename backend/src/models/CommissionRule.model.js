import mongoose from 'mongoose';

const commissionRuleSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    plotSizeRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: Infinity,
      },
    },
    type: {
      type: String,
      enum: ['percent', 'fixed'],
      required: [true, 'Commission type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Commission value is required'],
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0, // Higher priority rules are checked first
    },
    description: String,
    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
    effectiveTo: Date,
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
commissionRuleSchema.index({ projectId: 1, active: 1 });
commissionRuleSchema.index({ priority: -1 });

export default mongoose.model('CommissionRule', commissionRuleSchema);

