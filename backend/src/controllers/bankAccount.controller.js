import BankAccount from '../models/BankAccount.model.js';
import LedgerEntry from '../models/LedgerEntry.model.js';
import { parseCSV } from '../utils/csvParser.utils.js';

// Get all bank accounts
export const getAllBankAccounts = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const accounts = await BankAccount.find(query).sort({ createdAt: -1 });

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    // Count matched/unmatched transactions
    let matchedCount = 0;
    let unmatchedCount = 0;

    for (const account of accounts) {
      matchedCount += account.transactions.filter((t) => t.matched).length;
      unmatchedCount += account.transactions.filter((t) => !t.matched).length;
    }

    res.json({
      success: true,
      data: {
        accounts,
        stats: {
          totalBalance,
          matchedTransactions: matchedCount,
          unmatchedTransactions: unmatchedCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get bank account by ID
export const getBankAccountById = async (req, res, next) => {
  try {
    const account = await BankAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    // Get ledger entries for this account
    const ledgerEntries = await LedgerEntry.find({
      bankAccount: account._id,
    })
      .populate('projectId', 'name')
      .populate('userId', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: {
        account,
        ledgerEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create bank account
export const createBankAccount = async (req, res, next) => {
  try {
    const {
      name,
      bank,
      accountNo,
      accountType,
      currency,
      openingBalance,
      openingDate,
      iban,
      swiftCode,
      branch,
      notes,
    } = req.body;

    // Check if account number already exists
    const existingAccount = await BankAccount.findOne({ accountNo });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Account number already exists',
      });
    }

    const account = await BankAccount.create({
      name,
      bank,
      accountNo,
      accountType: accountType || 'current',
      currency: currency || 'PKR',
      balance: openingBalance || 0,
      openingBalance: openingBalance || 0,
      openingDate: openingDate || new Date(),
      iban,
      swiftCode,
      branch,
      notes,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: { account },
      message: 'Bank account created successfully',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Account number already exists',
      });
    }
    next(error);
  }
};

// Update bank account
export const updateBankAccount = async (req, res, next) => {
  try {
    const account = await BankAccount.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    Object.assign(account, req.body);
    await account.save();

    res.json({
      success: true,
      data: { account },
      message: 'Bank account updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Upload bank statement CSV
export const uploadBankStatement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transactions } = req.body; // Array of transactions from CSV

    const account = await BankAccount.findById(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    // Parse and add transactions
    const parsedTransactions = transactions.map((t) => ({
      date: new Date(t.date),
      description: t.description,
      amount: parseFloat(t.amount),
      type: t.type === 'credit' || parseFloat(t.amount) >= 0 ? 'credit' : 'debit',
      balance: parseFloat(t.balance) || account.balance,
      reference: t.reference,
      matched: false,
      category: t.category,
      notes: t.notes,
    }));

    // Update account balance with latest transaction
    if (parsedTransactions.length > 0) {
      const latestTransaction = parsedTransactions[parsedTransactions.length - 1];
      account.balance = latestTransaction.balance;
    }

    account.transactions.push(...parsedTransactions);
    await account.save();

    res.json({
      success: true,
      data: {
        account,
        transactionsAdded: parsedTransactions.length,
      },
      message: 'Bank statement uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Match transaction to ledger entry
export const matchTransaction = async (req, res, next) => {
  try {
    const { accountId, transactionId } = req.params;
    const { ledgerEntryId } = req.body;

    const account = await BankAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    const transaction = account.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify ledger entry exists
    const ledgerEntry = await LedgerEntry.findById(ledgerEntryId);
    if (!ledgerEntry) {
      return res.status(404).json({
        success: false,
        message: 'Ledger entry not found',
      });
    }

    // Match transaction
    transaction.matched = true;
    transaction.matchedTo = ledgerEntryId;
    transaction.category = ledgerEntry.category;

    // Update ledger entry reconciliation
    ledgerEntry.reconciled = true;
    ledgerEntry.reconciledAt = new Date();
    ledgerEntry.bankAccount = account._id;
    await ledgerEntry.save();

    await account.save();

    res.json({
      success: true,
      data: {
        transaction,
        ledgerEntry,
      },
      message: 'Transaction matched successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get unmatched transactions
export const getUnmatchedTransactions = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await BankAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    const unmatchedTransactions = account.transactions.filter((t) => !t.matched);

    res.json({
      success: true,
      data: {
        account: {
          id: account._id,
          name: account.name,
          accountNo: account.accountNo,
        },
        unmatchedTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get account ledger
export const getBankAccountLedger = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const account = await BankAccount.findById(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    let transactions = account.transactions;

    if (startDate || endDate) {
      transactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        if (startDate && tDate < new Date(startDate)) return false;
        if (endDate && tDate > new Date(endDate)) return false;
        return true;
      });
    }

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        account: {
          id: account._id,
          name: account.name,
          accountNo: account.accountNo,
          bank: account.bank,
          balance: account.balance,
        },
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

