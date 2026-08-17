import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { USD_TO_KHR } from '@/constants/currency';

const TripGroupSchema = z.object({
  title: z.string().min(2, 'Trip title is required'),
  destination: z.string().optional(),
  startDate: z.string().optional(),
  members: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      avatar: z.string(),
    })
  ).min(1, 'At least 1 member is required'),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shareCode = searchParams.get('shareCode');

  try {
    if (shareCode) {
      const trip = await prisma.tripGroup.findUnique({
        where: { shareCode },
        include: { expenses: true },
      });
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json(trip);
    }

    const trips = await prisma.tripGroup.findMany({
      include: {
        expenses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedTrips = trips.map((trip) => {
      const totalUSD = trip.expenses.reduce((sum, e) => {
        return sum + (e.currency === 'KHR' ? e.amount / USD_TO_KHR : e.amount);
      }, 0);

      return {
        ...trip,
        expenseCount: trip.expenses.length,
        totalSpentUSD: Number(totalUSD.toFixed(2)),
        totalSpentKHR: Math.round(totalUSD * USD_TO_KHR),
      };
    });

    return NextResponse.json(formattedTrips);
  } catch (error) {
    console.error('Error fetching trip groups:', error);
    return NextResponse.json({ error: 'Failed to fetch trip groups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TripGroupSchema.parse(body);

    const shareCode = `trip-${Date.now().toString(36)}`;

    const newTrip = await prisma.tripGroup.create({
      data: {
        title: validated.title,
        destination: validated.destination || '',
        startDate: validated.startDate || new Date().toISOString().split('T')[0],
        shareCode,
        members: validated.members,
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    console.error('Error creating trip group:', error);
    return NextResponse.json({ error: 'Failed to create trip group' }, { status: 500 });
  }
}
