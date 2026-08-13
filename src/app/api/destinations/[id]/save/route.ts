import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.cookies.get('reap_trip_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentSaved = (user.savedDestinationIds as string[]) || [];
    const isSaved = currentSaved.includes(id);

    const updatedSaved = isSaved
      ? currentSaved.filter((savedId) => savedId !== id)
      : [...currentSaved, id];

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { savedDestinationIds: updatedSaved },
    });

    return NextResponse.json({
      message: isSaved ? 'Destination removed from saved list' : 'Destination saved successfully',
      savedDestinationIds: updatedUser.savedDestinationIds,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update saved destination' }, { status: 500 });
  }
}
