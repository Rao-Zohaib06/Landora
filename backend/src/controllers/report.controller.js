import LedgerEntry from '../models/LedgerEntry.model.js';
import Plot from '../models/Plot.model.js';
import InstallmentPlan from '../models/InstallmentPlan.model.js';
import Commission from '../models/Commission.model.js';
import SellerPayment from '../models/SellerPayment.model.js';
import Partner from '../models/Partner.model.js';
import Project from '../models/Project.model.js';

// @desc    Generate Profit & Loss Report
// @route   GET /api/reports/profit-loss
// @access  Private/Admin
export const getProfitLossReport = async (req, res, next) => {
  try {
    const { projectId, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const projectFilter = projectId ? { projectId } : {};

    // Income (plot sales)
    const incomeEntries = await LedgerEntry.find({
      type: 'credit',
      account: 'income',
      category: 'plot-sale',
      ...dateFilter,
      ...projectFilter,
    });

    const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);

    // Expenses
    const expenseEntries = await LedgerEntry.find({
      type: 'debit',
      account: 'expense',
      ...dateFilter,
      ...projectFilter,
    });

    const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

    // Commissions paid
    const commissionEntries = await LedgerEntry.find({
      type: 'debit',
      account: 'agent-commission',
      category: 'commission',
      ...dateFilter,
      ...projectFilter,
    });

    const totalCommissions = commissionEntries.reduce((sum, entry) => sum + entry.amount, 0);

    // Seller payments
    const sellerPaymentEntries = await LedgerEntry.find({
      type: 'debit',
      account: 'seller',
      category: 'seller-payment',
      ...dateFilter,
      ...projectFilter,
    });

    const totalSellerPayments = sellerPaymentEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    // Partner profit distributions
    const partnerProfitEntries = await LedgerEntry.find({
      type: 'debit',
      account: 'partner',
      category: 'partner-profit',
      ...dateFilter,
      ...projectFilter,
    });

    const totalPartnerProfits = partnerProfitEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    const grossProfit = totalIncome - totalSellerPayments;
    const netProfit = grossProfit - totalExpenses - totalCommissions - totalPartnerProfits;

    res.json({
      success: true,
      data: {
        report: {
          period: {
            start: startDate || 'All time',
            end: endDate || 'All time',
          },
          project: projectId || 'All projects',
          income: {
            total: totalIncome,
            breakdown: {
              plotSales: totalIncome,
            },
          },
          expenses: {
            total: totalExpenses,
            breakdown: {
              general: totalExpenses,
            },
          },
          costs: {
            sellerPayments: totalSellerPayments,
            commissions: totalCommissions,
            partnerProfits: totalPartnerProfits,
            total: totalSellerPayments + totalCommissions + totalPartnerProfits,
          },
          profit: {
            gross: grossProfit,
            net: netProfit,
            margin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Cash Flow Report
// @route   GET /api/reports/cash-flow
// @access  Private/Admin
export const getCashFlowReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Cash inflows
    const inflows = await LedgerEntry.find({
      type: 'credit',
      account: { $in: ['income', 'buyer'] },
      ...dateFilter,
    }).sort({ date: 1 });

    // Cash outflows
    const outflows = await LedgerEntry.find({
      type: 'debit',
      account: {
        $in: ['seller', 'agent-commission', 'partner', 'expense'],
      },
      ...dateFilter,
    }).sort({ date: 1 });

    // Group by period
    const grouped = {};
    const allEntries = [...inflows, ...outflows];

    allEntries.forEach((entry) => {
      const date = new Date(entry.date);
      let key;

      if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        const week = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-W${week}`;
      } else {
        key = date.toISOString().split('T')[0];
      }

      if (!grouped[key]) {
        grouped[key] = { period: key, inflows: 0, outflows: 0, net: 0 };
      }

      if (entry.type === 'credit') {
        grouped[key].inflows += entry.amount;
      } else {
        grouped[key].outflows += entry.amount;
      }

      grouped[key].net = grouped[key].inflows - grouped[key].outflows;
    });

    const cashFlow = Object.values(grouped).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    const totalInflows = inflows.reduce((sum, entry) => sum + entry.amount, 0);
    const totalOutflows = outflows.reduce((sum, entry) => sum + entry.amount, 0);

    res.json({
      success: true,
      data: {
        report: {
          period: {
            start: startDate || 'All time',
            end: endDate || 'All time',
          },
          groupBy,
          summary: {
            totalInflows,
            totalOutflows,
            netCashFlow: totalInflows - totalOutflows,
          },
          cashFlow,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Receivables Aging Report
// @route   GET /api/reports/receivables-aging
// @access  Private/Admin
export const getReceivablesAgingReport = async (req, res, next) => {
  try {
    const plans = await InstallmentPlan.find({
      status: 'active',
    })
      .populate('buyerId', 'name email phone')
      .populate('plotId', 'plotNo')
      .populate('projectId', 'name');

    const aging = {
      current: { count: 0, amount: 0, items: [] },
      days30: { count: 0, amount: 0, items: [] },
      days60: { count: 0, amount: 0, items: [] },
      days90: { count: 0, amount: 0, items: [] },
      over90: { count: 0, amount: 0, items: [] },
    };

    const today = new Date();

    plans.forEach((plan) => {
      plan.installments.forEach((inst) => {
        if (!inst.paid) {
          const daysPastDue = Math.floor(
            (today - new Date(inst.dueDate)) / (1000 * 60 * 60 * 24)
          );

          const item = {
            planId: plan._id,
            installmentNo: inst.installmentNo,
            buyer: plan.buyerId,
            plot: plan.plotId,
            project: plan.projectId,
            dueDate: inst.dueDate,
            amount: inst.amount,
            daysPastDue,
          };

          if (daysPastDue <= 0) {
            aging.current.count++;
            aging.current.amount += inst.amount;
            aging.current.items.push(item);
          } else if (daysPastDue <= 30) {
            aging.days30.count++;
            aging.days30.amount += inst.amount;
            aging.days30.items.push(item);
          } else if (daysPastDue <= 60) {
            aging.days60.count++;
            aging.days60.amount += inst.amount;
            aging.days60.items.push(item);
          } else if (daysPastDue <= 90) {
            aging.days90.count++;
            aging.days90.amount += inst.amount;
            aging.days90.items.push(item);
          } else {
            aging.over90.count++;
            aging.over90.amount += inst.amount;
            aging.over90.items.push(item);
          }
        }
      });
    });

    const totalReceivables =
      aging.current.amount +
      aging.days30.amount +
      aging.days60.amount +
      aging.days90.amount +
      aging.over90.amount;

    res.json({
      success: true,
      data: {
        report: {
          generatedAt: new Date(),
          summary: {
            totalReceivables,
            totalCount:
              aging.current.count +
              aging.days30.count +
              aging.days60.count +
              aging.days90.count +
              aging.over90.count,
          },
          aging,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Monthly Progress Report (MPR)
// @route   GET /api/reports/monthly-progress
// @access  Private/Admin
export const getMonthlyProgressReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const reportMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const reportYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);

    // Sales summary
    const plotsSold = await Plot.countDocuments({
      status: 'sold',
      soldAt: { $gte: startDate, $lte: endDate },
    });

    const salesValue = await Plot.aggregate([
      {
        $match: {
          status: 'sold',
          soldAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$salePrice' },
        },
      },
    ]);

    const totalSalesValue = salesValue[0]?.total || 0;

    // New bookings
    const newBookings = await Plot.countDocuments({
      'booking.bookingDate': { $gte: startDate, $lte: endDate },
    });

    // Installments collected
    const installmentPayments = await LedgerEntry.find({
      type: 'credit',
      account: 'buyer',
      category: 'installment',
      date: { $gte: startDate, $lte: endDate },
    });

    const totalInstallmentsCollected = installmentPayments.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    // Commissions paid
    const commissionsPaid = await Commission.countDocuments({
      status: 'paid',
      paymentDate: { $gte: startDate, $lte: endDate },
    });

    const commissionAmount = await Commission.aggregate([
      {
        $match: {
          status: 'paid',
          paymentDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalCommissionsPaid = commissionAmount[0]?.total || 0;

    // New projects
    const newProjects = await Project.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // New plots added
    const newPlots = await Plot.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Active agents
    const activeAgents = await Commission.distinct('agentId', {
      createdAt: { $gte: startDate, $lte: endDate },
    });

    res.json({
      success: true,
      data: {
        report: {
          period: {
            month: reportMonth,
            year: reportYear,
            startDate,
            endDate,
          },
          sales: {
            plotsSold,
            totalSalesValue,
            averageSaleValue: plotsSold > 0 ? totalSalesValue / plotsSold : 0,
          },
          bookings: {
            newBookings,
          },
          collections: {
            installmentsCollected: installmentPayments.length,
            totalAmount: totalInstallmentsCollected,
          },
          commissions: {
            paid: commissionsPaid,
            totalAmount: totalCommissionsPaid,
          },
          projects: {
            newProjects,
          },
          plots: {
            newPlots,
          },
          agents: {
            activeCount: activeAgents.length,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Project-wise Report
// @route   GET /api/reports/project/:projectId
// @access  Private/Admin
export const getProjectReport = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Plot statistics
    const totalPlots = await Plot.countDocuments({ projectId });
    const soldPlots = await Plot.countDocuments({ projectId, status: 'sold' });
    const availablePlots = await Plot.countDocuments({ projectId, status: 'available' });
    const reservedPlots = await Plot.countDocuments({ projectId, status: 'reserved' });

    // Sales value
    const salesData = await Plot.aggregate([
      {
        $match: {
          projectId: project._id,
          status: 'sold',
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$salePrice' },
          averagePrice: { $avg: '$salePrice' },
        },
      },
    ]);

    const totalSales = salesData[0]?.totalSales || 0;
    const averagePrice = salesData[0]?.averagePrice || 0;

    // Pending installments
    const pendingPlans = await InstallmentPlan.find({
      projectId,
      status: 'active',
    });

    const pendingInstallments = pendingPlans.reduce((sum, plan) => {
      return (
        sum +
        plan.installments
          .filter((inst) => !inst.paid)
          .reduce((instSum, inst) => instSum + inst.amount, 0)
      );
    }, 0);

    // Commissions
    const commissions = await Commission.find({ projectId });
    const totalCommissions = commissions.reduce((sum, comm) => sum + comm.amount, 0);
    const paidCommissions = commissions
      .filter((comm) => comm.status === 'paid')
      .reduce((sum, comm) => sum + comm.amount, 0);

    res.json({
      success: true,
      data: {
        report: {
          project: {
            id: project._id,
            name: project.name,
            code: project.code,
            status: project.status,
          },
          plots: {
            total: totalPlots,
            sold: soldPlots,
            available: availablePlots,
            reserved: reservedPlots,
            soldPercentage: totalPlots > 0 ? ((soldPlots / totalPlots) * 100).toFixed(2) : 0,
          },
          sales: {
            totalSales,
            averagePrice,
            totalPlotsSold: soldPlots,
          },
          receivables: {
            pendingInstallments: pendingInstallments,
          },
          commissions: {
            total: totalCommissions,
            paid: paidCommissions,
            pending: totalCommissions - paidCommissions,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

