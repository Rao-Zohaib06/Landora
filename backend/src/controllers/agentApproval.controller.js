import User from '../models/User.model.js';

/**
 * Get all pending agents
 * @route GET /api/admin/agents/pending
 * @access Admin only
 */
export const getPendingAgents = async (req, res, next) => {
  try {
    const agents = await User.find({
      role: 'agent',
      status: 'pending',
    })
      .select('-passwordHash -refreshToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        agents,
        count: agents.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all agents with filter support
 * @route GET /api/admin/agents
 * @access Admin only
 */
export const getAllAgents = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = { role: 'agent' };
    if (status) {
      filter.status = status;
    }

    const agents = await User.find(filter)
      .select('-passwordHash -refreshToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        agents,
        count: agents.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve an agent
 * @route PUT /api/admin/agents/:id/approve
 * @access Admin only
 */
export const approveAgent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const agent = await User.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent',
      });
    }

    if (agent.status === 'active' && agent.approvedByAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Agent is already approved',
      });
    }

    agent.status = 'active';
    agent.approvedByAdmin = true;
    agent.approvedAt = new Date();
    agent.rejectedAt = undefined;

    await agent.save();

    // Remove sensitive data before sending response
    const agentData = agent.toObject();
    delete agentData.passwordHash;
    delete agentData.refreshToken;

    res.status(200).json({
      success: true,
      message: 'Agent approved successfully',
      data: {
        agent: agentData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject an agent
 * @route PUT /api/admin/agents/:id/reject
 * @access Admin only
 */
export const rejectAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const agent = await User.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent',
      });
    }

    agent.status = 'rejected';
    agent.approvedByAdmin = false;
    agent.rejectedAt = new Date();
    agent.approvedAt = undefined;

    if (reason) {
      agent.notes = reason;
    }

    await agent.save();

    // Remove sensitive data before sending response
    const agentData = agent.toObject();
    delete agentData.passwordHash;
    delete agentData.refreshToken;

    res.status(200).json({
      success: true,
      message: 'Agent rejected successfully',
      data: {
        agent: agentData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get approved agents (public)
 * @route GET /api/agents/approved
 * @access Public
 */
export const getApprovedAgents = async (req, res, next) => {
  try {
    const agents = await User.find({
      role: 'agent',
      status: 'active',
      approvedByAdmin: true,
    })
      .select('name email phone profile rating agentProfile activeListings')
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        agents,
        count: agents.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend an agent
 * @route PUT /api/admin/agents/:id/suspend
 * @access Admin only
 */
export const suspendAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const agent = await User.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent',
      });
    }

    agent.status = 'suspended';

    if (reason) {
      agent.notes = reason;
    }

    await agent.save();

    // Remove sensitive data before sending response
    const agentData = agent.toObject();
    delete agentData.passwordHash;
    delete agentData.refreshToken;

    res.status(200).json({
      success: true,
      message: 'Agent suspended successfully',
      data: {
        agent: agentData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reactivate a suspended agent
 * @route PUT /api/admin/agents/:id/reactivate
 * @access Admin only
 */
export const reactivateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const agent = await User.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent',
      });
    }

    if (!agent.approvedByAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Agent was never approved. Use approve endpoint instead.',
      });
    }

    agent.status = 'active';

    await agent.save();

    // Remove sensitive data before sending response
    const agentData = agent.toObject();
    delete agentData.passwordHash;
    delete agentData.refreshToken;

    res.status(200).json({
      success: true,
      message: 'Agent reactivated successfully',
      data: {
        agent: agentData,
      },
    });
  } catch (error) {
    next(error);
  }
};
