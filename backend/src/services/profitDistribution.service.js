import Partner from '../models/Partner.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';

/**
 * Calculate profit distribution for partners
 * @param {String} projectId
 * @param {Number} totalProfit
 * @param {Object} period - { start, end }
 * @returns {Array} Profit distribution array
 */
export const calculateProfitDistribution = async (projectId, totalProfit, period) => {
  const partners = await Partner.find({ status: 'active' });

  if (partners.length === 0) {
    return [];
  }

  // Verify total share percentage
  const totalShare = partners.reduce((sum, p) => sum + p.sharePercent, 0);
  if (totalShare !== 100) {
    throw new Error(`Total share percentage is ${totalShare}%, must equal 100%`);
  }

  const distributions = partners.map((partner) => {
    const profitAmount = (totalProfit * partner.sharePercent) / 100;

    return {
      partnerId: partner._id,
      partnerName: partner.name,
      sharePercent: partner.sharePercent,
      profitAmount: Math.round(profitAmount * 100) / 100,
    };
  });

  return distributions;
};

/**
 * Distribute profit to partners
 * @param {String} projectId
 * @param {Number} totalProfit
 * @param {Object} period - { start, end }
 * @param {String} processedBy - Admin user ID
 * @returns {Object} Distribution result
 */
export const distributeProfit = async (projectId, totalProfit, period, processedBy) => {
  const distributions = await calculateProfitDistribution(projectId, totalProfit, period);

  const results = [];

  for (const dist of distributions) {
    const partner = await Partner.findById(dist.partnerId);

    // Add profit distribution record
    partner.profitDistributions.push({
      amount: dist.profitAmount,
      projectId,
      period,
      status: 'pending',
    });

    partner.profitCredited += dist.profitAmount;
    await partner.save();

    // Create ledger entry
    const ledgerEntry = await LedgerEntry.create({
      type: 'debit',
      account: 'partner',
      category: 'partner-profit',
      amount: dist.profitAmount,
      refId: partner._id,
      refType: 'Partner',
      description: `Profit distribution for ${partner.name} - ${dist.sharePercent}%`,
      projectId,
      userId: partner._id,
      createdBy: processedBy,
    });

    results.push({
      partner: partner.name,
      amount: dist.profitAmount,
      ledgerEntryId: ledgerEntry._id,
    });
  }

  return {
    success: true,
    totalProfit,
    distributions: results,
    message: 'Profit distributed successfully',
  };
};

/**
 * Approve and pay profit distribution
 * @param {String} partnerId
 * @param {String} distributionId
 * @param {Object} paymentData - { paymentDate, paymentReference, bankAccount }
 * @returns {Object} Updated distribution
 */
export const approveProfitDistribution = async (partnerId, distributionId, paymentData) => {
  const partner = await Partner.findById(partnerId);
  if (!partner) {
    throw new Error('Partner not found');
  }

  const distribution = partner.profitDistributions.id(distributionId);
  if (!distribution) {
    throw new Error('Distribution not found');
  }

  distribution.status = 'paid';
  distribution.paymentReference = paymentData.paymentReference;
  distribution.distributedAt = paymentData.paymentDate || new Date();

  partner.withdrawals += distribution.amount;
  await partner.save();

  return distribution;
};

