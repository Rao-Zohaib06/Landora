import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['admin', 'agent', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'suspended'],
      default: 'pending',
    },
    profile: {
      cnic: String,
      address: String,
      city: String,
      country: {
        type: String,
        default: 'Pakistan',
      },
      avatar: String,
      bio: String,
    },
    kycDocuments: [
      {
        type: {
          type: String,
          enum: ['cnic', 'license', 'certificate', 'other'],
        },
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    activeListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
      },
    ],
    // Agent specific fields
    agentProfile: {
      licenseNumber: String,
      agency: String,
      experience: Number, // years
      specialization: [String],
      commissionRate: {
        type: Number,
        default: 0,
      },
    },
    // User specific fields
    preferences: {
      propertyTypes: [String],
      locations: [String],
      budgetRange: {
        min: Number,
        max: Number,
      },
    },
    lastLogin: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
};

export default mongoose.model('User', userSchema);

