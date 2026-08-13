import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const USD_TO_KHR = 4100;

export async function POST() {
  try {
    const expenses = await prisma.expenseItem.findMany();

    // Calculate net balances in USD for each member
    const balances: Record<string, number> = {};

    expenses.forEach((item) => {
      const amountUSD = item.currency === 'KHR' ? item.amount / USD_TO_KHR : item.amount;
      const splitMemberIds = (item.splitAmongMemberIds as string[]) || [];
      const splitCount = splitMemberIds.length || 1;
      const perPersonShare = amountUSD / splitCount;

      // Add credit to payer
      balances[item.paidByMemberId] = (balances[item.paidByMemberId] || 0) + amountUSD;

      // Subtract share from each split member
      splitMemberIds.forEach((memberId) => {
        balances[memberId] = (balances[memberId] || 0) - perPersonShare;
      });
    });

    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, balance]) => {
      if (balance < -0.01) {
        debtors.push({ id, amount: -balance });
      } else if (balance > 0.01) {
        creditors.push({ id, amount: balance });
      }
    });

    const settlements: {
      fromMemberId: string;
      toMemberId: string;
      amountUSD: number;
      amountKHR: number;
    }[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const transferUSD = Math.min(debtor.amount, creditor.amount);

      if (transferUSD > 0.01) {
        settlements.push({
          fromMemberId: debtor.id,
          toMemberId: creditor.id,
          amountUSD: Number(transferUSD.toFixed(2)),
          amountKHR: Math.round(transferUSD * USD_TO_KHR),
        });
      }

      debtor.amount -= transferUSD;
      creditor.amount -= transferUSD;

      if (debtor.amount <= 0.01) i++;
      if (creditor.amount <= 0.01) j++;
    }

    return NextResponse.json({
      settlements,
      totalExpensesUSD: expenses.reduce(
        (sum, e) => sum + (e.currency === 'KHR' ? e.amount / USD_TO_KHR : e.amount),
        0
      ),
    });
  } catch (error) {
    console.error('Error calculating expense settlements:', error);
    return NextResponse.json({ error: 'Failed to calculate settlements' }, { status: 500 });
  }
}
