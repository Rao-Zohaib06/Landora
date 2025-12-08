import Listing from '../models/Listing.model.js';
import Plot from '../models/Plot.model.js';
import Project from '../models/Project.model.js';
import User from '../models/User.model.js';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res, next) => {
  try {
    const {
      agentId,
      projectId,
      status,
      minPrice,
      maxPrice,
      city,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (agentId) query.agentId = agentId;
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (city) query['location.city'] = city;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const listings = await Listing.find(query)
      .populate('agentId', 'name email phone')
      .populate('projectId', 'name location')
      .populate('plotId', 'plotNo sizeMarla block')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('agentId', 'name email phone profile')
      .populate('projectId')
      .populate('plotId')
      .populate('approvedBy', 'name');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({
      success: true,
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
// @access  Private/Agent
export const createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      agentId: req.user.id,
    };

    // Validate project exists
    if (listingData.projectId) {
      const project = await Project.findById(listingData.projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }
    }

    // Validate plot exists and is available (if plotId provided)
    if (listingData.plotId) {
      const plot = await Plot.findById(listingData.plotId);
      if (!plot) {
        return res.status(404).json({
          success: false,
          message: 'Plot not found',
        });
      }
      if (plot.status !== 'available' && plot.status !== 'reserved') {
        return res.status(400).json({
          success: false,
          message: 'Plot is not available for listing',
        });
      }
    }

    const listing = await Listing.create(listingData);

    // Add to agent's active listings
    await User.findByIdAndUpdate(req.user.id, {
      $push: { activeListings: listing._id },
    });

    res.status(201).json({
      success: true,
      data: { listing },
      message: 'Listing created successfully. Pending admin approval.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private/Agent or Admin
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Agents can only update their own listings
    if (req.user.role === 'agent' && listing.agentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own listings',
      });
    }

    // If status is being changed to approved/rejected, only admin can do it
    if (req.body.status && req.user.role !== 'admin') {
      delete req.body.status;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('agentId', 'name email')
      .populate('projectId', 'name')
      .populate('plotId', 'plotNo');

    res.json({
      success: true,
      data: { listing: updatedListing },
      message: 'Listing updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private/Agent or Admin
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Agents can only delete their own listings
    if (req.user.role === 'agent' && listing.agentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own listings',
      });
    }

    // Remove from agent's active listings
    await User.findByIdAndUpdate(listing.agentId, {
      $pull: { activeListings: listing._id },
    });

    await listing.deleteOne();

    res.json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve listing
// @route   PUT /api/listings/:id/approve
// @access  Private/Admin
export const approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    )
      .populate('agentId', 'name email')
      .populate('projectId', 'name');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.json({
      success: true,
      data: { listing },
      message: 'Listing approved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject listing
// @route   PUT /api/listings/:id/reject
// @access  Private/Admin
export const rejectListing = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason,
        approvedBy: req.user.id,
      },
      { new: true }
    )
      .populate('agentId', 'name email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.json({
      success: true,
      data: { listing },
      message: 'Listing rejected',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add inquiry to listing
// @route   POST /api/listings/:id/inquiry
// @access  Public
export const addInquiry = async (req, res, next) => {
  try {
    const { message, contact } = req.body;

    if (!message || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Message and contact are required',
      });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          inquiries: {
            userId: req.user?.id || null,
            message,
            contact,
          },
        },
      },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

