import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ExpenseSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripGroupId = searchParams.get('tripGroupId');

  try {
    const where = tripGroupId ? { tripGroupId } : {};
    const expenses = await prisma.expenseItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = ExpenseSchema.parse(body);

    const expense = await prisma.expenseItem.create({
      data: validatedData,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID required for update' }, { status: 400 });
    }

    const validatedData = ExpenseSchema.parse(data);

    const updated = await prisma.expenseItem.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
  }

  try {
    await prisma.expenseItem.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
