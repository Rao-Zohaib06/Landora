import Lead from '../models/Lead.model.js';
import Plot from '../models/Plot.model.js';
import Project from '../models/Project.model.js';

// Get all leads for agent
export const getMyLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { agentId: req.user.id };

    if (status) {
      query.status = status;
    }

    const leads = await Lead.find(query)
      .populate('plotId', 'plotNo block phase')
      .populate('projectId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get lead by ID
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('plotId', 'plotNo block phase price')
      .populate('projectId', 'name location')
      .populate('agentId', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Verify agent owns this lead
    if (lead.agentId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this lead',
      });
    }

    res.json({
      success: true,
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

// Create new lead
export const createLead = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      plotId,
      projectId,
      channel,
      budget,
      preferredLocation,
      requirements,
    } = req.body;

    const lead = await Lead.create({
      agentId: req.user.id,
      name,
      email,
      phone,
      plotId,
      projectId,
      channel: channel || 'other',
      budget,
      preferredLocation,
      requirements,
      status: 'new',
    });

    // Add initial timeline event
    lead.timeline.push({
      event: 'Lead Created',
      description: `Lead created by ${req.user.name}`,
    });
    await lead.save();

    res.status(201).json({
      success: true,
      data: { lead },
      message: 'Lead created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update lead status
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Verify agent owns this lead
    if (lead.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this lead',
      });
    }

    const oldStatus = lead.status;
    lead.status = status;

    // Add timeline event
    lead.timeline.push({
      event: 'Status Changed',
      description: `Status changed from ${oldStatus} to ${status}`,
    });

    await lead.save();

    res.json({
      success: true,
      data: { lead },
      message: 'Lead status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Add note to lead
export const addLeadNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Verify agent owns this lead
    if (lead.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this lead',
      });
    }

    lead.notes.push({
      note,
      createdBy: req.user.id,
    });

    // Add timeline event
    lead.timeline.push({
      event: 'Note Added',
      description: `Note added by ${req.user.name}`,
    });

    await lead.save();

    res.json({
      success: true,
      data: { lead },
      message: 'Note added successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update lead
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Verify agent owns this lead
    if (lead.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this lead',
      });
    }

    Object.assign(lead, req.body);
    await lead.save();

    res.json({
      success: true,
      data: { lead },
      message: 'Lead updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete lead
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Verify agent owns this lead
    if (lead.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this lead',
      });
    }

    await Lead.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

