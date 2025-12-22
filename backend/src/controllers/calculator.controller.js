// Construction Cost Calculator
export const calculateConstructionCost = async (req, res, next) => {
  try {
    const {
      area, // in square feet or marla
      areaUnit, // 'sqft' or 'marla'
      constructionType, // 'basic', 'standard', 'premium', 'luxury'
      city, // for location-based cost adjustments
      floors = 1,
      basement = false,
      roofType = 'flat', // 'flat', 'sloped', 'terrace'
    } = req.body;

    // Base construction cost per square foot (PKR)
    const baseCosts = {
      basic: 2000, // PKR per sqft
      standard: 2800,
      premium: 3800,
      luxury: 5500,
    };

    // City multipliers (cost varies by location)
    const cityMultipliers = {
      lahore: 1.0,
      karachi: 0.95,
      islamabad: 1.15,
      rawalpindi: 0.90,
      faisalabad: 0.85,
      multan: 0.80,
      default: 1.0,
    };

    // Convert area to square feet if needed
    let areaInSqft;
    if (areaUnit === 'marla') {
      areaInSqft = area * 272.25; // 1 marla = 272.25 sqft
    } else {
      areaInSqft = area;
    }

    // Get base cost
    const baseCostPerSqft = baseCosts[constructionType] || baseCosts.standard;
    
    // Apply city multiplier
    const cityKey = city?.toLowerCase() || 'default';
    const multiplier = cityMultipliers[cityKey] || cityMultipliers.default;
    const adjustedCostPerSqft = baseCostPerSqft * multiplier;

    // Calculate base construction cost
    let totalCost = areaInSqft * adjustedCostPerSqft * floors;

    // Add basement cost (if applicable)
    if (basement) {
      const basementCost = areaInSqft * adjustedCostPerSqft * 0.6; // Basement costs 60% of regular floor
      totalCost += basementCost;
    }

    // Roof type adjustments
    const roofMultipliers = {
      flat: 1.0,
      sloped: 1.15,
      terrace: 1.25,
    };
    const roofMultiplier = roofMultipliers[roofType] || 1.0;
    totalCost *= roofMultiplier;

    // Additional costs breakdown
    const breakdown = {
      structure: totalCost * 0.40, // 40% for structure
      finishing: totalCost * 0.30, // 30% for finishing
      electrical: totalCost * 0.10, // 10% for electrical
      plumbing: totalCost * 0.08, // 8% for plumbing
      miscellaneous: totalCost * 0.12, // 12% for miscellaneous
    };

    // Add contingency (5-10% of total cost)
    const contingency = totalCost * 0.08;
    const finalCost = totalCost + contingency;

    res.json({
      success: true,
      data: {
        calculation: {
          area: {
            value: area,
            unit: areaUnit,
            inSqft: areaInSqft,
          },
          constructionType,
          city: city || 'Not specified',
          floors,
          basement,
          roofType,
          costBreakdown: {
            baseCost: totalCost,
            contingency: contingency,
            totalCost: finalCost,
            perSqft: finalCost / areaInSqft,
            breakdown,
          },
          estimatedDuration: Math.ceil(areaInSqft / 1000) + (floors - 1) * 2, // months
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Home Loan Calculator
export const calculateHomeLoan = async (req, res, next) => {
  try {
    const {
      propertyValue, // Property price in PKR
      downPayment, // Down payment amount or percentage
      downPaymentType, // 'amount' or 'percentage'
      interestRate, // Annual interest rate percentage
      loanTenure, // Loan tenure in years
      loanType = 'fixed', // 'fixed' or 'floating'
    } = req.body;

    // Calculate down payment
    let downPaymentAmount;
    if (downPaymentType === 'percentage') {
      downPaymentAmount = (propertyValue * downPayment) / 100;
    } else {
      downPaymentAmount = downPayment;
    }

    // Calculate loan amount
    const loanAmount = propertyValue - downPaymentAmount;

    // Monthly interest rate
    const monthlyInterestRate = interestRate / 12 / 100;

    // Number of monthly payments
    const numberOfPayments = loanTenure * 12;

    // Calculate EMI using formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Total amount payable
    const totalAmountPayable = emi * numberOfPayments;

    // Total interest payable
    const totalInterest = totalAmountPayable - loanAmount;

    // Calculate payment schedule (first 12 months)
    const paymentSchedule = [];
    let remainingPrincipal = loanAmount;

    for (let month = 1; month <= Math.min(12, numberOfPayments); month++) {
      const interestPayment = remainingPrincipal * monthlyInterestRate;
      const principalPayment = emi - interestPayment;
      remainingPrincipal -= principalPayment;

      paymentSchedule.push({
        month,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: remainingPrincipal > 0 ? remainingPrincipal : 0,
      });
    }

    // Eligibility check (typically 40-50% of monthly income)
    const maxEMI = (emi / 0.40); // Assuming 40% of income goes to EMI
    const minMonthlyIncome = maxEMI;

    res.json({
      success: true,
      data: {
        calculation: {
          propertyValue,
          downPayment: {
            amount: downPaymentAmount,
            percentage: (downPaymentAmount / propertyValue) * 100,
          },
          loanAmount,
          interestRate: {
            annual: interestRate,
            monthly: monthlyInterestRate * 100,
          },
          tenure: {
            years: loanTenure,
            months: numberOfPayments,
          },
          emi: {
            monthly: emi,
            yearly: emi * 12,
          },
          totalPayable: {
            principal: loanAmount,
            interest: totalInterest,
            total: totalAmountPayable,
          },
          paymentSchedule,
          eligibility: {
            minMonthlyIncome,
            maxEMI,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Area Unit Converter
export const convertAreaUnit = async (req, res, next) => {
  try {
    const { value, fromUnit, toUnit } = req.body;

    // Conversion factors to square feet (base unit)
    const conversionFactors = {
      sqft: 1, // Square feet (base)
      sqm: 10.764, // Square meters
      sqyd: 9, // Square yards
      marla: 272.25, // 1 marla = 272.25 sqft (Pakistan standard)
      kanal: 5445, // 1 kanal = 5445 sqft (20 marlas)
      acre: 43560, // 1 acre = 43560 sqft
      hectare: 107639, // 1 hectare = 107639 sqft
    };

    // Validate units
    if (!conversionFactors[fromUnit] || !conversionFactors[toUnit]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unit. Supported units: sqft, sqm, sqyd, marla, kanal, acre, hectare',
      });
    }

    // Convert to base unit (sqft)
    const valueInSqft = value * conversionFactors[fromUnit];

    // Convert to target unit
    const convertedValue = valueInSqft / conversionFactors[toUnit];

    // Get all conversions for reference
    const allConversions = {
      sqft: valueInSqft,
      sqm: valueInSqft / conversionFactors.sqm,
      sqyd: valueInSqft / conversionFactors.sqyd,
      marla: valueInSqft / conversionFactors.marla,
      kanal: valueInSqft / conversionFactors.kanal,
      acre: valueInSqft / conversionFactors.acre,
      hectare: valueInSqft / conversionFactors.hectare,
    };

    res.json({
      success: true,
      data: {
        conversion: {
          from: {
            value,
            unit: fromUnit,
          },
          to: {
            value: convertedValue,
            unit: toUnit,
          },
          allConversions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get construction cost rates (for reference)
export const getConstructionRates = async (req, res, next) => {
  try {
    const rates = {
      constructionTypes: {
        basic: {
          costPerSqft: 2000,
          description: 'Basic construction with standard materials',
          features: ['Standard tiles', 'Basic fixtures', 'Standard paint'],
        },
        standard: {
          costPerSqft: 2800,
          description: 'Standard construction with good quality materials',
          features: ['Good quality tiles', 'Standard fixtures', 'Quality paint'],
        },
        premium: {
          costPerSqft: 3800,
          description: 'Premium construction with high-quality materials',
          features: ['Premium tiles', 'High-end fixtures', 'Premium paint'],
        },
        luxury: {
          costPerSqft: 5500,
          description: 'Luxury construction with top-tier materials',
          features: ['Luxury tiles', 'Luxury fixtures', 'Premium finishes'],
        },
      },
      cityMultipliers: {
        lahore: 1.0,
        karachi: 0.95,
        islamabad: 1.15,
        rawalpindi: 0.90,
        faisalabad: 0.85,
        multan: 0.80,
      },
      roofTypes: {
        flat: { multiplier: 1.0, description: 'Flat roof' },
        sloped: { multiplier: 1.15, description: 'Sloped roof' },
        terrace: { multiplier: 1.25, description: 'Terrace/rooftop' },
      },
    };

    res.json({
      success: true,
      data: { rates },
    });
  } catch (error) {
    next(error);
  }
};

