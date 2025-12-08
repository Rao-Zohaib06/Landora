import InstallmentPlan from '../models/InstallmentPlan.model.js';
import Plot from '../models/Plot.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';
import User from '../models/User.model.js';
import { sendInstallmentReminder } from '../utils/email.utils.js';

// @desc    Get all installment plans
// @route   GET /api/installments
// @access  Private
export const getInstallmentPlans = async (req, res, next) => {
  try {
    const { buyerId, plotId, status, overdue, page = 1, limit = 20 } = req.query;

    const query = {};

    // Agents can only see their own customers' installments
    if (req.user.role === 'agent') {
      // This would require a relationship between agent and buyers
      // For now, we'll show all if agent, but filter by buyerId if provided
      if (buyerId) query.buyerId = buyerId;
    } else if (req.user.role === 'user') {
      // Users can only see their own installments
      query.buyerId = req.user.id;
    } else {
      // Admin can see all
      if (buyerId) query.buyerId = buyerId;
    }

    if (plotId) query.plotId = plotId;
    if (status) query.status = status;

    // Filter overdue installments
    if (overdue === 'true') {
      query.nextDueDate = { $lt: new Date() };
      query.status = 'active';
    }

    const skip = (page - 1) * limit;

    const plans = await InstallmentPlan.find(query)
      .populate('buyerId', 'name email phone')
      .populate('plotId', 'plotNo sizeMarla block')
      .populate('projectId', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await InstallmentPlan.countDocuments(query);

    res.json({
      success: true,
      data: {
        plans,
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

// @desc    Get single installment plan
// @route   GET /api/installments/:id
// @access  Private
export const getInstallmentPlan = async (req, res, next) => {
  try {
    const plan = await InstallmentPlan.findById(req.params.id)
      .populate('buyerId', 'name email phone profile')
      .populate('plotId')
      .populate('projectId');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Installment plan not found',
      });
    }

    // Users can only view their own plans
    if (req.user.role === 'user' && plan.buyerId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create installment plan
// @route   POST /api/installments
// @access  Private/Admin
export const createInstallmentPlan = async (req, res, next) => {
  try {
    const { buyerId, plotId, totalAmount, downPayment, frequency, installments } = req.body;

    if (!buyerId || !plotId || !totalAmount || !installments || installments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate plot exists
    const plot = await Plot.findById(plotId).populate('projectId');
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    // Validate buyer exists
    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found',
      });
    }

    // Create installment plan
    const plan = await InstallmentPlan.create({
      buyerId,
      plotId,
      projectId: plot.projectId._id,
      totalAmount,
      downPayment: downPayment || 0,
      frequency: frequency || 'monthly',
      installments: installments.map((inst, index) => ({
        installmentNo: index + 1,
        dueDate: new Date(inst.dueDate),
        amount: inst.amount,
      })),
      status: 'active',
    });

    // Create ledger entry for down payment if paid
    if (downPayment > 0) {
      await LedgerEntry.create({
        type: 'credit',
        account: 'buyer',
        category: 'installment',
        amount: downPayment,
        refId: plan._id,
        refType: 'InstallmentPlan',
        description: `Down payment for Plot ${plot.plotNo}`,
        userId: buyerId,
        projectId: plot.projectId._id,
        createdBy: req.user.id,
      });
    }

    res.status(201).json({
      success: true,
      data: { plan },
      message: 'Installment plan created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pay installment
// @route   POST /api/installments/:id/pay
// @access  Private
export const payInstallment = async (req, res, next) => {
  try {
    const { installmentNo, amount, paymentReference, paidDate } = req.body;

    if (!installmentNo || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Installment number and amount are required',
      });
    }

    const plan = await InstallmentPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Installment plan not found',
      });
    }

    // Users can only pay their own installments
    if (req.user.role === 'user' && plan.buyerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only pay your own installments',
      });
    }

    const installment = plan.installments.find(
      (inst) => inst.installmentNo === Number(installmentNo)
    );

    if (!installment) {
      return res.status(404).json({
        success: false,
        message: 'Installment not found',
      });
    }

    if (installment.paid) {
      return res.status(400).json({
        success: false,
        message: 'This installment is already paid',
      });
    }

    // Update installment
    installment.paid = true;
    installment.paidDate = paidDate ? new Date(paidDate) : new Date();
    installment.paidAmount = amount;
    installment.paymentReference = paymentReference;
    installment.status = amount >= installment.amount ? 'paid' : 'partial';

    // Recalculate plan totals
    await plan.save();

    // Create ledger entry
    await LedgerEntry.create({
      type: 'credit',
      account: 'buyer',
      category: 'installment',
      amount,
      refId: plan._id,
      refType: 'InstallmentPlan',
      description: `Installment #${installmentNo} payment for Plot ${plan.plotId}`,
      userId: plan.buyerId,
      projectId: plan.projectId,
      paymentMethod: 'bank-transfer',
      paymentReference,
      createdBy: req.user.id,
    });

    // Check if plan is completed
    const allPaid = plan.installments.every((inst) => inst.paid);
    if (allPaid && plan.downPaymentPaid) {
      plan.status = 'completed';
      await plan.save();
    }

    res.json({
      success: true,
      data: { plan },
      message: 'Installment paid successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pay down payment
// @route   POST /api/installments/:id/down-payment
// @access  Private
export const payDownPayment = async (req, res, next) => {
  try {
    const { amount, paymentReference } = req.body;

    const plan = await InstallmentPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Installment plan not found',
      });
    }

    if (plan.downPaymentPaid) {
      return res.status(400).json({
        success: false,
        message: 'Down payment already paid',
      });
    }

    plan.downPaymentPaid = true;
    plan.downPaymentDate = new Date();
    await plan.save();

    // Create ledger entry
    await LedgerEntry.create({
      type: 'credit',
      account: 'buyer',
      category: 'installment',
      amount: amount || plan.downPayment,
      refId: plan._id,
      refType: 'InstallmentPlan',
      description: `Down payment for Plot ${plan.plotId}`,
      userId: plan.buyerId,
      projectId: plan.projectId,
      paymentReference,
      createdBy: req.user.id,
    });

    res.json({
      success: true,
      data: { plan },
      message: 'Down payment recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue installments
// @route   GET /api/installments/overdue
// @access  Private/Admin
export const getOverdueInstallments = async (req, res, next) => {
  try {
    const plans = await InstallmentPlan.find({
      status: 'active',
      'installments.paid': false,
    })
      .populate('buyerId', 'name email phone')
      .populate('plotId', 'plotNo')
      .populate('projectId', 'name');

    const overdueInstallments = [];

    plans.forEach((plan) => {
      plan.installments.forEach((inst) => {
        if (!inst.paid && new Date(inst.dueDate) < new Date()) {
          overdueInstallments.push({
            planId: plan._id,
            installmentNo: inst.installmentNo,
            buyer: plan.buyerId,
            plot: plan.plotId,
            project: plan.projectId,
            dueDate: inst.dueDate,
            amount: inst.amount,
            daysOverdue: Math.floor(
              (new Date() - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      });
    });

    res.json({
      success: true,
      data: {
        overdueInstallments,
        total: overdueInstallments.length,
        totalAmount: overdueInstallments.reduce(
          (sum, inst) => sum + inst.amount,
          0
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send installment reminders
// @route   POST /api/installments/:id/remind
// @access  Private/Admin
export const sendReminder = async (req, res, next) => {
  try {
    const plan = await InstallmentPlan.findById(req.params.id)
      .populate('buyerId', 'name email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Installment plan not found',
      });
    }

    const nextDue = plan.installments.find(
      (inst) => !inst.paid && new Date(inst.dueDate) >= new Date()
    );

    if (!nextDue) {
      return res.status(400).json({
        success: false,
        message: 'No upcoming installments found',
      });
    }

    const emailResult = await sendInstallmentReminder(plan.buyerId, nextDue);

    res.json({
      success: true,
      message: 'Reminder sent successfully',
      emailResult,
    });
  } catch (error) {
    next(error);
  }
};

