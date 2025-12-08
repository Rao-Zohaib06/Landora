import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      area: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    totalAreaMarla: {
      type: Number,
      required: [true, 'Total area is required'],
    },
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed', 'on-hold'],
      default: 'planning',
    },
    details: {
      description: String,
      features: [String],
      amenities: [String],
      developer: String,
      approvalStatus: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending',
      },
      approvalNumber: String,
    },
    images: [
      {
        url: String,
        caption: String,
        type: {
          type: String,
          enum: ['main', 'gallery', 'map', 'layout'],
        },
      },
    ],
    blocks: [
      {
        name: String,
        totalPlots: Number,
        availablePlots: Number,
      },
    ],
    phases: [
      {
        name: String,
        startDate: Date,
        completionDate: Date,
        status: String,
      },
    ],
    pricing: {
      minPrice: Number,
      maxPrice: Number,
      pricePerMarla: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectSchema.index({ name: 1 });
projectSchema.index({ code: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'location.city': 1 });

// Virtual for total plots
projectSchema.virtual('totalPlots').get(function () {
  return this.blocks.reduce((sum, block) => sum + (block.totalPlots || 0), 0);
});

export default mongoose.model('Project', projectSchema);

