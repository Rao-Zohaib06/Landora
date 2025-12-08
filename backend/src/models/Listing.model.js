import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent ID is required'],
    },
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plot',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Listing title is required'],
    },
    description: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    area: {
      value: Number,
      unit: {
        type: String,
        enum: ['marla', 'kanal', 'square-feet'],
        default: 'marla',
      },
    },
    location: {
      city: String,
      area: String,
      address: String,
    },
    features: [String],
    images: [String],
    videos: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold', 'expired'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    rejectionReason: String,
    views: {
      type: Number,
      default: 0,
    },
    inquiries: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        message: String,
        contact: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
listingSchema.index({ agentId: 1 });
listingSchema.index({ plotId: 1 });
listingSchema.index({ projectId: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ createdAt: -1 });

export default mongoose.model('Listing', listingSchema);

