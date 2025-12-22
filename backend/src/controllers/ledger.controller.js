import LedgerEntry from '../models/LedgerEntry.model.js';
import InstallmentPlan from '../models/InstallmentPlan.model.js';

// Get all ledger entries
export const getAllLedgerEntries = async (req, res, next) => {
  try {
    const {
      account,
      type,
      category,
      projectId,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    if (account) query.account = account;
    if (type) query.type = type;
    if (category) query.category = category;
    if (projectId) query.projectId = projectId;
    if (userId) query.userId = userId;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await LedgerEntry.find(query)
      .populate('projectId', 'name')
      .populate('userId', 'name email')
      .populate('createdBy', 'name')
      .populate('bankAccount', 'name accountNo')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await LedgerEntry.countDocuments(query);

    res.json({
      success: true,
      data: {
        entries,
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

// Get ledger by account type
export const getLedgerByAccount = async (req, res, next) => {
  try {
    const { account } = req.params;
    const { userId, startDate, endDate } = req.query;

    const query = { account };

    if (userId) query.userId = userId;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await LedgerEntry.find(query)
      .populate('projectId', 'name')
      .populate('userId', 'name email')
      .populate('bankAccount', 'name accountNo')
      .sort({ date: -1 });

    // Calculate running balance
    let balance = 0;
    const entriesWithBalance = entries.map((entry) => {
      if (entry.type === 'credit') {
        balance += entry.amount;
      } else {
        balance -= entry.amount;
      }
      return {
        ...entry.toObject(),
        balance,
      };
    });

    res.json({
      success: true,
      data: {
        account,
        entries: entriesWithBalance,
        currentBalance: balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get receivables aging report
export const getReceivablesAging = async (req, res, next) => {
  try {
    // Get all buyer installments
    const installments = await InstallmentPlan.find({
      status: { $in: ['active', 'overdue'] },
    })
      .populate('buyerId', 'name email')
      .populate('plotId', 'plotNo block phase')
      .populate('projectId', 'name');

    const now = new Date();
    const agingBuckets = {
      '0-30': [],
      '31-60': [],
      '61-90': [],
      '90+': [],
    };

    let totalReceivables = 0;

    for (const installment of installments) {
      const nextDueDate = installment.nextDueDate || installment.startDate;
      const daysOverdue = Math.floor((now - nextDueDate) / (1000 * 60 * 60 * 24));
      
      const remainingAmount = installment.totalAmount - installment.paidAmount;
      totalReceivables += remainingAmount;

      const entry = {
        installmentId: installment._id,
        buyer: installment.buyerId.name,
        plot: `${installment.plotId.plotNo}`,
        project: installment.projectId.name,
        remainingAmount,
        daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
        nextDueDate,
      };

      if (daysOverdue <= 30) {
        agingBuckets['0-30'].push(entry);
      } else if (daysOverdue <= 60) {
        agingBuckets['31-60'].push(entry);
      } else if (daysOverdue <= 90) {
        agingBuckets['61-90'].push(entry);
      } else {
        agingBuckets['90+'].push(entry);
      }
    }

    // Calculate totals by bucket
    const summary = {
      '0-30': agingBuckets['0-30'].reduce((sum, e) => sum + e.remainingAmount, 0),
      '31-60': agingBuckets['31-60'].reduce((sum, e) => sum + e.remainingAmount, 0),
      '61-90': agingBuckets['61-90'].reduce((sum, e) => sum + e.remainingAmount, 0),
      '90+': agingBuckets['90+'].reduce((sum, e) => sum + e.remainingAmount, 0),
      totalReceivables,
    };

    res.json({
      success: true,
      data: {
        report: {
          summary,
          details: agingBuckets,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export ledger to CSV
export const exportLedger = async (req, res, next) => {
  try {
    const { account, startDate, endDate } = req.query;

    const query = {};
    if (account) query.account = account;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await LedgerEntry.find(query)
      .populate('projectId', 'name')
      .populate('userId', 'name email')
      .sort({ date: -1 });

    // Convert to CSV format
    const csvRows = [
      ['Date', 'Type', 'Account', 'Category', 'Description', 'Amount', 'Balance'].join(','),
    ];

    let balance = 0;
    entries.forEach((entry) => {
      if (entry.type === 'credit') {
        balance += entry.amount;
      } else {
        balance -= entry.amount;
      }

      csvRows.push([
        entry.date.toISOString().split('T')[0],
        entry.type,
        entry.account,
        entry.category,
        entry.description,
        entry.amount,
        balance,
      ].join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ledger-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// Reconcile ledger entry
export const reconcileLedgerEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await LedgerEntry.findById(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Ledger entry not found',
      });
    }

    entry.reconciled = true;
    entry.reconciledAt = new Date();
    await entry.save();

    res.json({
      success: true,
      data: { entry },
      message: 'Ledger entry reconciled successfully',
    });
  } catch (error) {
    next(error);
  }
};

