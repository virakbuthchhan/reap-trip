import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('reap_trip_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        telegram: user.telegram,
        province: user.province,
        joinedDate: user.joinedDate,
        languages: user.languages,
        bio: user.bio,
        verified: user.verified,
        savedDestinationIds: user.savedDestinationIds,
        stats: user.stats,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
