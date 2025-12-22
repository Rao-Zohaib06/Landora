import Partner from '../models/Partner.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';

// Get all partners
export const getAllPartners = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const partners = await Partner.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Partner.countDocuments(query);

    // Calculate stats for each partner
    const partnersWithStats = partners.map(partner => {
      const profitDistributed = partner.profitDistributions
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pendingProfit = partner.profitDistributions
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        ...partner.toObject(),
        profitDistributed,
        pendingProfit,
        currentCapital: partner.capitalInjected - partner.withdrawals,
      };
    });

    res.json({
      success: true,
      data: {
        partners: partnersWithStats,
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

// Get partner by ID
export const getPartnerById = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    // Get ledger entries for this partner
    const ledgerEntries = await LedgerEntry.find({
      account: 'partner',
      userId: partner._id,
    }).sort({ date: -1 });

    const profitDistributed = partner.profitDistributions
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingProfit = partner.profitDistributions
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      data: {
        partner: {
          ...partner.toObject(),
          profitDistributed,
          pendingProfit,
          currentCapital: partner.capitalInjected - partner.withdrawals,
        },
        ledgerEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new partner
export const createPartner = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      sharePercent,
      investmentAmount,
      profile,
      notes,
    } = req.body;

    // Validate share percentage doesn't exceed 100%
    const totalShares = await Partner.aggregate([
      { $group: { _id: null, total: { $sum: '$sharePercent' } } },
    ]);
    const currentTotal = totalShares[0]?.total || 0;
    
    if (currentTotal + sharePercent > 100) {
      return res.status(400).json({
        success: false,
        message: `Total share percentage would exceed 100%. Current total: ${currentTotal}%`,
      });
    }

    const partner = await Partner.create({
      name,
      email,
      phone,
      sharePercent,
      investmentAmount: investmentAmount || 0,
      capitalInjected: investmentAmount || 0,
      profile,
      notes,
      status: 'active',
    });

    // Create capital injection transaction
    if (investmentAmount > 0) {
      partner.capitalTransactions.push({
        amount: investmentAmount,
        type: 'injection',
        date: new Date(),
        notes: 'Initial investment',
      });
      await partner.save();

      // Create ledger entry
      await LedgerEntry.create({
        type: 'credit',
        account: 'partner',
        category: 'capital-injection',
        amount: investmentAmount,
        refId: partner._id,
        refType: 'Partner',
        description: `Capital injection from ${partner.name}`,
        userId: partner._id,
        paymentMethod: 'bank-transfer',
      });
    }

    res.status(201).json({
      success: true,
      data: { partner },
      message: 'Partner created successfully',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    next(error);
  }
};

// Update partner
export const updatePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    // If sharePercent is being updated, validate total
    if (req.body.sharePercent && req.body.sharePercent !== partner.sharePercent) {
      const totalShares = await Partner.aggregate([
        { $match: { _id: { $ne: partner._id } } },
        { $group: { _id: null, total: { $sum: '$sharePercent' } } },
      ]);
      const currentTotal = totalShares[0]?.total || 0;
      
      if (currentTotal + req.body.sharePercent > 100) {
        return res.status(400).json({
          success: false,
          message: `Total share percentage would exceed 100%`,
        });
      }
    }

    Object.assign(partner, req.body);
    await partner.save();

    res.json({
      success: true,
      data: { partner },
      message: 'Partner updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete partner
export const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    // Soft delete by setting status to terminated
    partner.status = 'terminated';
    await partner.save();

    res.json({
      success: true,
      message: 'Partner terminated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Add capital injection/withdrawal
export const addCapitalTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, notes, reference } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    if (type === 'injection') {
      partner.capitalInjected += amount;
    } else if (type === 'withdrawal') {
      if (partner.capitalInjected - partner.withdrawals < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient capital balance',
        });
      }
      partner.withdrawals += amount;
    }

    partner.capitalTransactions.push({
      amount,
      type,
      date: new Date(),
      notes,
      reference,
    });

    await partner.save();

    // Create ledger entry
    await LedgerEntry.create({
      type: type === 'injection' ? 'credit' : 'debit',
      account: 'partner',
      category: type === 'injection' ? 'capital-injection' : 'capital-withdrawal',
      amount,
      refId: partner._id,
      refType: 'Partner',
      description: `${type === 'injection' ? 'Capital injection' : 'Capital withdrawal'} - ${notes || 'N/A'}`,
      userId: partner._id,
      paymentMethod: 'bank-transfer',
    });

    res.json({
      success: true,
      data: { partner },
      message: `Capital ${type} recorded successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Distribute profit to partner
export const distributeProfit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { projectId, period, amount, paymentReference } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    // Calculate partner's share based on their percentage
    const calculatedAmount = (amount * partner.sharePercent) / 100;

    partner.profitDistributions.push({
      amount: calculatedAmount,
      projectId,
      period,
      status: 'pending',
      paymentReference,
    });

    partner.profitCredited += calculatedAmount;
    await partner.save();

    // Create ledger entry
    await LedgerEntry.create({
      type: 'credit',
      account: 'partner',
      category: 'partner-profit',
      amount: calculatedAmount,
      refId: partner._id,
      refType: 'Partner',
      description: `Profit distribution - ${projectId ? 'Project specific' : 'General'}`,
      userId: partner._id,
      projectId,
    });

    res.json({
      success: true,
      data: { partner },
      message: 'Profit distribution recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Approve and pay profit distribution
export const approveProfitDistribution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { distributionId, paymentReference } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    const distribution = partner.profitDistributions.id(distributionId);
    if (!distribution) {
      return res.status(404).json({
        success: false,
        message: 'Profit distribution not found',
      });
    }

    distribution.status = 'paid';
    if (paymentReference) {
      distribution.paymentReference = paymentReference;
    }
    distribution.distributedAt = new Date();

    await partner.save();

    res.json({
      success: true,
      data: { partner },
      message: 'Profit distribution approved and paid',
    });
  } catch (error) {
    next(error);
  }
};

// Get partner ledger
export const getPartnerLedger = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    const query = {
      account: 'partner',
      userId: partner._id,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const ledgerEntries = await LedgerEntry.find(query)
      .populate('projectId', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: {
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
        },
        ledgerEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

