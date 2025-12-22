import BankAccount from '../models/BankAccount.model.js';
import { parseCSV } from '../utils/csvParser.utils.js';

// Upload bank statement CSV
export const uploadBankStatementCSV = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const account = await BankAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    // Parse CSV file
    const csvResult = await parseCSV(file.buffer.toString());
    const csvData = csvResult.data || [];
    
    // Expected CSV format: Date, Description, Amount, Balance, Reference
    const transactions = csvData.map((row, index) => {
      const amount = parseFloat(row.Amount || row.amount || 0);
      const balance = parseFloat(row.Balance || row.balance || account.balance);

      return {
        date: new Date(row.Date || row.date),
        description: row.Description || row.description || '',
        amount: Math.abs(amount),
        type: amount >= 0 ? 'credit' : 'debit',
        balance: balance || account.balance,
        reference: row.Reference || row.reference || '',
        matched: false,
        category: row.Category || row.category || '',
        notes: row.Notes || row.notes || '',
      };
    });

    // Update account balance with latest transaction
    if (transactions.length > 0) {
      const latestTransaction = transactions[transactions.length - 1];
      account.balance = latestTransaction.balance;
    }

    account.transactions.push(...transactions);
    await account.save();

    res.json({
      success: true,
      data: {
        account,
        transactionsAdded: transactions.length,
        unmatchedTransactions: transactions.filter((t) => !t.matched).length,
      },
      message: 'Bank statement uploaded and parsed successfully',
    });
  } catch (error) {
    next(error);
  }
};

