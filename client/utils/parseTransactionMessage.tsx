import {Expense} from '../api/expenseTracker/createNewExpense';
import {ExpensesType} from '../components/ExpenseTypeSelector';
import {Message} from '../specs/NativeReadSms';

export function parseSmsToExpense(sms: Array<Message>): Array<Expense> {
  const expenses = [];
  for (let i = 0; i < sms.length; i++) {
    const body = sms[i].body;

    const amountMatch = body.match(/Rs\.?(\d+(?:\.\d+)?)/);
    const nameMatch = body.match(/To (.+)/);

    if (!amountMatch || !nameMatch) {
      continue;
    }

    const amount = parseInt(amountMatch[1], 10);
    const name = nameMatch[1].split('\n')[0].trim();

    expenses.push({
      amount,
      created_at: Math.floor(
        new Date(parseInt(sms[i].date, 10)).getTime() / 1000,
      ),
      name,
      category_id: 1,
      type: ExpensesType.EXPENSE,
    });
  }

  return expenses;
}
