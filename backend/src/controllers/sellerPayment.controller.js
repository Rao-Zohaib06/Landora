import SellerPayment from '../models/SellerPayment.model.js';
import Plot from '../models/Plot.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';
import User from '../models/User.model.js';

// Get all seller payments
export const getAllSellerPayments = async (req, res, next) => {
  try {
    const { sellerId, projectId, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (sellerId) query.sellerId = sellerId;
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;

    const payments = await SellerPayment.find(query)
      .populate('sellerId', 'name email phone')
      .populate('plotId', 'plotNo block phase')
      .populate('projectId', 'name')
      .populate('bankAccount', 'name accountNo bank')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await SellerPayment.countDocuments(query);

    // Calculate totals
    const totalPayable = await SellerPayment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalPaid = await SellerPayment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);

    const totalPending = await SellerPayment.aggregate([
      { $match: { status: { $in: ['pending', 'partial'] } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$amount', '$paidAmount'] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        payments,
        stats: {
          totalPayable: totalPayable[0]?.total || 0,
          totalPaid: totalPaid[0]?.total || 0,
          totalPending: totalPending[0]?.total || 0,
        },
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

// Get seller payment by ID
export const getSellerPaymentById = async (req, res, next) => {
  try {
    const payment = await SellerPayment.findById(req.params.id)
      .populate('sellerId', 'name email phone')
      .populate('plotId', 'plotNo block phase')
      .populate('projectId', 'name')
      .populate('bankAccount', 'name accountNo bank');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Seller payment not found',
      });
    }

    // Get ledger entries
    const ledgerEntries = await LedgerEntry.find({
      refId: payment._id,
      refType: 'SellerPayment',
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: {
        payment,
        ledgerEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create seller payment
export const createSellerPayment = async (req, res, next) => {
  try {
    const {
      sellerId,
      plotId,
      projectId,
      amount,
      mode,
      dueDate,
      paymentReference,
      bankAccount,
      notes,
    } = req.body;

    // Verify plot exists
    const plot = await Plot.findById(plotId);
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    // Verify seller exists
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Invalid seller ID',
      });
    }

    const payment = await SellerPayment.create({
      sellerId,
      plotId,
      projectId,
      amount,
      mode,
      dueDate,
      paymentReference,
      bankAccount,
      notes,
      processedBy: req.user.id,
      status: 'pending',
    });

    // Create ledger entry
    await LedgerEntry.create({
      type: 'debit',
      account: 'seller',
      category: 'seller-payment',
      amount,
      refId: payment._id,
      refType: 'SellerPayment',
      description: `Seller payment for plot ${plot.plotNo}`,
      userId: sellerId,
      projectId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: { payment },
      message: 'Seller payment created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update seller payment
export const updateSellerPayment = async (req, res, next) => {
  try {
    const payment = await SellerPayment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Seller payment not found',
      });
    }

    Object.assign(payment, req.body);
    await payment.save();

    res.json({
      success: true,
      data: { payment },
      message: 'Seller payment updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Record payment to seller
export const recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, paymentReference, bankAccount, notes } = req.body;

    const payment = await SellerPayment.findById(id)
      .populate('sellerId', 'name email')
      .populate('plotId', 'plotNo');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Seller payment not found',
      });
    }

    const paymentAmount = amount || payment.amount - payment.paidAmount;
    const newPaidAmount = payment.paidAmount + paymentAmount;

    if (newPaidAmount > payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount exceeds total payable',
      });
    }

    payment.paidAmount = newPaidAmount;
    payment.paidDate = paymentDate || new Date();

    if (newPaidAmount >= payment.amount) {
      payment.status = 'paid';
    } else if (newPaidAmount > 0) {
      payment.status = 'partial';
    }

    if (paymentReference) payment.paymentReference = paymentReference;
    if (bankAccount) payment.bankAccount = bankAccount;
    if (notes) payment.notes = notes;

    await payment.save();

    // Create ledger entry
    await LedgerEntry.create({
      type: 'debit',
      account: 'seller',
      category: 'seller-payment',
      amount: paymentAmount,
      refId: payment._id,
      refType: 'SellerPayment',
      description: `Payment to seller ${payment.sellerId.name} for plot ${payment.plotId.plotNo}`,
      userId: payment.sellerId._id,
      projectId: payment.projectId,
      paymentMethod: 'bank-transfer',
      bankAccount,
      createdBy: req.user.id,
    });

    res.json({
      success: true,
      data: { payment },
      message: 'Payment recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get seller payment ledger
export const getSellerPaymentLedger = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await SellerPayment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Seller payment not found',
      });
    }

    const ledgerEntries = await LedgerEntry.find({
      refId: payment._id,
      refType: 'SellerPayment',
    })
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: {
        payment: {
          id: payment._id,
          amount: payment.amount,
          paidAmount: payment.paidAmount,
          pendingAmount: payment.amount - payment.paidAmount,
          status: payment.status,
        },
        ledgerEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

