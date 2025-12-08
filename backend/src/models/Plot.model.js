import mongoose from 'mongoose';

const transferHistorySchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  transferDate: {
    type: Date,
    default: Date.now,
  },
  transferType: {
    type: String,
    enum: ['sale', 'gift', 'inheritance', 'other'],
  },
  amount: Number,
  documents: [String],
  notes: String,
});

const coOwnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharePercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const plotSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    plotNo: {
      type: String,
      required: [true, 'Plot number is required'],
    },
    sizeMarla: {
      type: Number,
      required: [true, 'Plot size is required'],
    },
    block: {
      type: String,
      trim: true,
    },
    phase: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'blocked', 'disputed', 'reserved'],
      default: 'available',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    originalPrice: Number, // Price at time of purchase
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    coOwners: [coOwnerSchema],
    transferHistory: [transferHistorySchema],
    booking: {
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      bookingDate: Date,
      bookingAmount: Number,
      bookingStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
      },
      expiryDate: Date,
    },
    features: {
      corner: {
        type: Boolean,
        default: false,
      },
      parkFacing: {
        type: Boolean,
        default: false,
      },
      mainRoad: {
        type: Boolean,
        default: false,
      },
      direction: {
        type: String,
        enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'],
      },
    },
    images: [String],
    notes: String,
    soldAt: Date,
    salePrice: Number,
  },
  {
    timestamps: true,
  }
);

// Indexes
plotSchema.index({ projectId: 1, plotNo: 1 }, { unique: true });
plotSchema.index({ status: 1 });
plotSchema.index({ buyerId: 1 });
plotSchema.index({ sellerId: 1 });
plotSchema.index({ block: 1, phase: 1 });

// Virtual for full plot identifier
plotSchema.virtual('fullIdentifier').get(function () {
  return `${this.block || ''}-${this.plotNo}`.trim();
});

export default mongoose.model('Plot', plotSchema);

