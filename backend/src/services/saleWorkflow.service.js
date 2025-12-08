import Plot from '../models/Plot.model.js';
import InstallmentPlan from '../models/InstallmentPlan.model.js';
import Commission from '../models/Commission.model.js';
import SellerPayment from '../models/SellerPayment.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';
import { calculateCommission, createCommission } from './commission.service.js';
import { sendBookingConfirmation } from '../utils/email.utils.js';

/**
 * Process plot sale workflow
 * @param {Object} saleData - { plotId, buyerId, salePrice, paymentMode, installmentPlan? }
 * @param {String} adminId - Admin user ID processing the sale
 * @returns {Object} Sale result
 */
export const processSale = async (saleData, adminId) => {
  const { plotId, buyerId, salePrice, paymentMode, installmentPlan } = saleData;

  // Get plot
  const plot = await Plot.findById(plotId).populate('projectId');
  if (!plot) {
    throw new Error('Plot not found');
  }

  if (plot.status !== 'available' && plot.status !== 'reserved') {
    throw new Error(`Plot is ${plot.status} and cannot be sold`);
  }

  // Start transaction-like workflow
  try {
    // 1. Update plot status
    plot.status = 'sold';
    plot.buyerId = buyerId;
    plot.soldAt = new Date();
    plot.salePrice = salePrice;
    await plot.save();

    // 2. Create installment plan if needed
    let installmentPlanDoc = null;
    if (paymentMode === 'installments' && installmentPlan) {
      const { downPayment, frequency, installments } = installmentPlan;
      
      installmentPlanDoc = await InstallmentPlan.create({
        buyerId,
        plotId,
        projectId: plot.projectId._id,
        totalAmount: salePrice,
        downPayment,
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
          category: 'plot-sale',
          amount: downPayment,
          refId: installmentPlanDoc._id,
          refType: 'InstallmentPlan',
          description: `Down payment for Plot ${plot.plotNo}`,
          userId: buyerId,
          projectId: plot.projectId._id,
        });
      }
    } else {
      // Full payment - create ledger entry
      await LedgerEntry.create({
        type: 'credit',
        account: 'income',
        category: 'plot-sale',
        amount: salePrice,
        refId: plot._id,
        refType: 'Plot',
        description: `Full payment for Plot ${plot.plotNo}`,
        userId: buyerId,
        projectId: plot.projectId._id,
      });
    }

    // 3. Calculate and create commission (if agent involved)
    let commissionDoc = null;
    if (plot.booking?.bookedBy) {
      const commissionCalc = await calculateCommission({
        plotId: plot._id,
        agentId: plot.booking.bookedBy,
        salePrice,
      });

      if (commissionCalc.amount > 0) {
        commissionDoc = await createCommission({
          agentId: plot.booking.bookedBy,
          plotId: plot._id,
          projectId: plot.projectId._id,
          amount: commissionCalc.amount,
          ruleId: commissionCalc.ruleId,
        });

        // Create ledger entry for commission payable
        await LedgerEntry.create({
          type: 'debit',
          account: 'agent-commission',
          category: 'commission',
          amount: commissionCalc.amount,
          refId: commissionDoc._id,
          refType: 'Commission',
          description: `Commission for Plot ${plot.plotNo}`,
          userId: plot.booking.bookedBy,
          projectId: plot.projectId._id,
        });
      }
    }

    // 4. Create seller payment record
    if (plot.sellerId) {
      const sellerPaymentAmount = salePrice * 0.7; // Example: 70% to seller
      
      await SellerPayment.create({
        sellerId: plot.sellerId,
        plotId: plot._id,
        projectId: plot.projectId._id,
        amount: sellerPaymentAmount,
        mode: paymentMode === 'installments' ? 'installments' : 'lump-sum',
        dueDate: paymentMode === 'installments' ? new Date() : new Date(),
        status: 'pending',
      });

      // Create ledger entry for seller payable
      await LedgerEntry.create({
        type: 'debit',
        account: 'seller',
        category: 'seller-payment',
        amount: sellerPaymentAmount,
        refId: plot._id,
        refType: 'Plot',
        description: `Seller payment for Plot ${plot.plotNo}`,
        userId: plot.sellerId,
        projectId: plot.projectId._id,
      });
    }

    // 5. Send notification email (if configured)
    try {
      const buyer = await import('../models/User.model.js').then(m => m.default.findById(buyerId));
      if (buyer) {
        await sendBookingConfirmation(buyer, plot);
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return {
      success: true,
      plot,
      installmentPlan: installmentPlanDoc,
      commission: commissionDoc,
      message: 'Sale processed successfully',
    };
  } catch (error) {
    // Rollback plot status on error
    plot.status = 'available';
    await plot.save();
    throw error;
  }
};

