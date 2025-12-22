import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const timelineEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const leadSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: {
      type: String,
      required: true,
    },
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plot',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'won', 'lost'],
      default: 'new',
    },
    channel: {
      type: String,
      enum: ['website', 'phone', 'walk-in', 'referral', 'social-media', 'other'],
      default: 'other',
    },
    notes: [noteSchema],
    timeline: [timelineEventSchema],
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    budget: Number,
    preferredLocation: String,
    requirements: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
leadSchema.index({ agentId: 1, status: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model('Lead', leadSchema);

