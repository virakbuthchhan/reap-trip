import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...destination,
      coordinates: { lat: destination.lat, lng: destination.lng },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
