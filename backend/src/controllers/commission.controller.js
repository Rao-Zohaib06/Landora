import Commission from '../models/Commission.model.js';
import CommissionRule from '../models/CommissionRule.model.js';
import {
  calculateCommission,
  createCommission,
  approveCommission,
  payCommission,
} from '../services/commission.service.js';

// @desc    Get all commissions
// @route   GET /api/commissions
// @access  Private
export const getCommissions = async (req, res, next) => {
  try {
    const { agentId, status, plotId, page = 1, limit = 20 } = req.query;

    const query = {};
    
    // Agents can only see their own commissions
    if (req.user.role === 'agent') {
      query.agentId = req.user.id;
    } else if (agentId) {
      query.agentId = agentId;
    }

    if (status) query.status = status;
    if (plotId) query.plotId = plotId;

    const skip = (page - 1) * limit;

    const commissions = await Commission.find(query)
      .populate('agentId', 'name email')
      .populate('plotId', 'plotNo sizeMarla')
      .populate('projectId', 'name')
      .populate('approvedBy', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Commission.countDocuments(query);

    res.json({
      success: true,
      data: {
        commissions,
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

// @desc    Get single commission
// @route   GET /api/commissions/:id
// @access  Private
export const getCommission = async (req, res, next) => {
  try {
    const commission = await Commission.findById(req.params.id)
      .populate('agentId', 'name email phone')
      .populate('plotId')
      .populate('projectId')
      .populate('approvedBy', 'name');

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: 'Commission not found',
      });
    }

    // Agents can only view their own commissions
    if (req.user.role === 'agent' && commission.agentId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { commission },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate commission
// @route   POST /api/commissions/calculate
// @access  Private/Admin
export const calculateCommissionAmount = async (req, res, next) => {
  try {
    const { plotId, agentId, salePrice } = req.body;

    if (!plotId || !agentId || !salePrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide plotId, agentId, and salePrice',
      });
    }

    const result = await calculateCommission({
      plotId,
      agentId,
      salePrice,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create commission
// @route   POST /api/commissions
// @access  Private/Admin
export const createCommissionRecord = async (req, res, next) => {
  try {
    const { agentId, plotId, saleId, amount, ruleId, projectId } = req.body;

    if (!agentId || !plotId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide agentId, plotId, and amount',
      });
    }

    const commission = await createCommission({
      agentId,
      plotId,
      saleId,
      amount,
      ruleId,
      projectId,
    });

    res.status(201).json({
      success: true,
      data: { commission },
      message: 'Commission created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve commission
// @route   PUT /api/commissions/:id/approve
// @access  Private/Admin
export const approveCommissionRecord = async (req, res, next) => {
  try {
    const commission = await approveCommission(req.params.id, req.user.id);

    res.json({
      success: true,
      data: { commission },
      message: 'Commission approved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pay commission
// @route   PUT /api/commissions/:id/pay
// @access  Private/Admin
export const payCommissionRecord = async (req, res, next) => {
  try {
    const { paymentDate, paymentReference } = req.body;

    const commission = await payCommission(req.params.id, {
      paymentDate,
      paymentReference,
    });

    res.json({
      success: true,
      data: { commission },
      message: 'Commission marked as paid',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get commission rules
// @route   GET /api/commissions/rules
// @access  Private/Admin
export const getCommissionRules = async (req, res, next) => {
  try {
    const { projectId, active } = req.query;

    const query = {};
    if (projectId) query.projectId = projectId;
    if (active !== undefined) query.active = active === 'true';

    const rules = await CommissionRule.find(query)
      .populate('projectId', 'name')
      .populate('createdBy', 'name')
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      data: { rules },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create commission rule
// @route   POST /api/commissions/rules
// @access  Private/Admin
export const createCommissionRule = async (req, res, next) => {
  try {
    const ruleData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const rule = await CommissionRule.create(ruleData);

    res.status(201).json({
      success: true,
      data: { rule },
      message: 'Commission rule created successfully',
    });
  } catch (error) {
    next(error);
  }
};

