import Plot from '../models/Plot.model.js';
import Project from '../models/Project.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';

// @desc    Get all plots
// @route   GET /api/plots
// @access  Public
export const getPlots = async (req, res, next) => {
  try {
    const {
      projectId,
      status,
      block,
      phase,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (block) query.block = block;
    if (phase) query.phase = phase;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minSize || maxSize) {
      query.sizeMarla = {};
      if (minSize) query.sizeMarla.$gte = Number(minSize);
      if (maxSize) query.sizeMarla.$lte = Number(maxSize);
    }

    const skip = (page - 1) * limit;

    const plots = await Plot.find(query)
      .populate('projectId', 'name location')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Plot.countDocuments(query);

    res.json({
      success: true,
      data: {
        plots,
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

// @desc    Get single plot
// @route   GET /api/plots/:id
// @access  Public
export const getPlot = async (req, res, next) => {
  try {
    const plot = await Plot.findById(req.params.id)
      .populate('projectId')
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name email phone')
      .populate('coOwners.userId', 'name email');

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    res.json({
      success: true,
      data: { plot },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create plot
// @route   POST /api/plots
// @access  Private/Admin
export const createPlot = async (req, res, next) => {
  try {
    const plotData = req.body;

    // Check if project exists
    const project = await Project.findById(plotData.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check for duplicate plot number in project
    const existingPlot = await Plot.findOne({
      projectId: plotData.projectId,
      plotNo: plotData.plotNo,
    });

    if (existingPlot) {
      return res.status(400).json({
        success: false,
        message: 'Plot number already exists in this project',
      });
    }

    const plot = await Plot.create({
      ...plotData,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: { plot },
      message: 'Plot created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update plot
// @route   PUT /api/plots/:id
// @access  Private/Admin
export const updatePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('projectId');

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    res.json({
      success: true,
      data: { plot },
      message: 'Plot updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete plot
// @route   DELETE /api/plots/:id
// @access  Private/Admin
export const deletePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findById(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    if (plot.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sold plot',
      });
    }

    await plot.deleteOne();

    res.json({
      success: true,
      message: 'Plot deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign buyer to plot
// @route   POST /api/plots/:id/assign-buyer
// @access  Private/Admin
export const assignBuyer = async (req, res, next) => {
  try {
    const { buyerId } = req.body;

    const plot = await Plot.findById(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    if (plot.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Plot is ${plot.status} and cannot be assigned`,
      });
    }

    plot.buyerId = buyerId;
    plot.status = 'reserved';
    await plot.save();

    res.json({
      success: true,
      data: { plot },
      message: 'Buyer assigned successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer plot ownership
// @route   POST /api/plots/:id/transfer
// @access  Private/Admin
export const transferPlot = async (req, res, next) => {
  try {
    const { toUserId, transferType, amount, documents, notes } = req.body;

    const plot = await Plot.findById(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    // Add to transfer history
    plot.transferHistory.push({
      from: plot.buyerId || plot.sellerId,
      to: toUserId,
      transferType: transferType || 'sale',
      amount,
      documents,
      notes,
    });

    // Update ownership
    const previousOwner = plot.buyerId || plot.sellerId;
    plot.buyerId = toUserId;
    plot.sellerId = previousOwner;

    await plot.save();

    res.json({
      success: true,
      data: { plot },
      message: 'Plot transferred successfully',
    });
  } catch (error) {
    next(error);
  }
};

