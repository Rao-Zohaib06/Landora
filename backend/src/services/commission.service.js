import CommissionRule from '../models/CommissionRule.model.js';
import Commission from '../models/Commission.model.js';
import Plot from '../models/Plot.model.js';

/**
 * Calculate commission for a plot sale
 * @param {Object} saleData - { plotId, agentId, salePrice }
 * @returns {Object} - { amount, ruleId }
 */
export const calculateCommission = async (saleData) => {
  const { plotId, agentId, salePrice } = saleData;

  // Get plot details
  const plot = await Plot.findById(plotId).populate('projectId');
  if (!plot) {
    throw new Error('Plot not found');
  }

  // Get applicable commission rules (project-specific or general)
  const rules = await CommissionRule.find({
    $or: [
      { projectId: plot.projectId._id, active: true },
      { projectId: null, active: true },
    ],
  })
    .sort({ priority: -1 }) // Higher priority first
    .exec();

  let commissionAmount = 0;
  let appliedRule = null;

  // Find matching rule based on plot size
  for (const rule of rules) {
    const { plotSizeRange } = rule;
    const plotSize = plot.sizeMarla;

    // Check if plot size matches rule range
    if (
      plotSize >= (plotSizeRange.min || 0) &&
      plotSize <= (plotSizeRange.max || Infinity)
    ) {
      appliedRule = rule;

      // Calculate commission based on type
      if (rule.type === 'percent') {
        commissionAmount = (salePrice * rule.value) / 100;
      } else if (rule.type === 'fixed') {
        commissionAmount = rule.value;
      }

      break; // Use first matching rule
    }
  }

  // If no rule found, return zero commission
  if (!appliedRule) {
    return {
      amount: 0,
      ruleId: null,
      message: 'No commission rule found for this plot',
    };
  }

  return {
    amount: Math.round(commissionAmount * 100) / 100, // Round to 2 decimal places
    ruleId: appliedRule._id,
    rule: appliedRule,
  };
};

/**
 * Create commission record
 * @param {Object} commissionData - { agentId, plotId, saleId, amount, ruleId }
 * @returns {Object} Commission document
 */
export const createCommission = async (commissionData) => {
  const { agentId, plotId, saleId, amount, ruleId, projectId } = commissionData;

  const commission = await Commission.create({
    agentId,
    plotId,
    projectId,
    saleId,
    amount,
    calculatedAmount: amount,
    ruleId,
    status: 'pending',
  });

  return commission;
};

/**
 * Approve commission
 * @param {String} commissionId
 * @param {String} approvedBy
 * @returns {Object} Updated commission
 */
export const approveCommission = async (commissionId, approvedBy) => {
  const commission = await Commission.findByIdAndUpdate(
    commissionId,
    {
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
    },
    { new: true }
  );

  if (!commission) {
    throw new Error('Commission not found');
  }

  return commission;
};

/**
 * Mark commission as paid
 * @param {String} commissionId
 * @param {Object} paymentData - { paymentDate, paymentReference }
 * @returns {Object} Updated commission
 */
export const payCommission = async (commissionId, paymentData) => {
  const { paymentDate, paymentReference } = paymentData;

  const commission = await Commission.findByIdAndUpdate(
    commissionId,
    {
      status: 'paid',
      paymentDate: paymentDate || new Date(),
      paymentReference,
    },
    { new: true }
  );

  if (!commission) {
    throw new Error('Commission not found');
  }

  return commission;
};

