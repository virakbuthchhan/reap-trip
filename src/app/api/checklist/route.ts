import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const items = await prisma.packingItem.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packing checklist' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, packed } = body;

    if (!id || typeof packed !== 'boolean') {
      return NextResponse.json({ error: 'Item ID and packed status required' }, { status: 400 });
    }

    const updatedItem = await prisma.packingItem.update({
      where: { id },
      data: { packed },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update packing item' }, { status: 500 });
  }
}
