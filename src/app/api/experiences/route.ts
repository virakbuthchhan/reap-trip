import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TripReportSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destinationId = searchParams.get('destinationId');

  try {
    const where = destinationId ? { destinationId } : {};
    const reports = await prisma.tripReport.findMany({
      where,
      include: { comments: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trip reports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = TripReportSchema.parse(body);

    const report = await prisma.tripReport.create({
      data: validatedData,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create trip report' }, { status: 500 });
  }
}
