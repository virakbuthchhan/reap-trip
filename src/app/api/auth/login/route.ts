import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signJWT } from '@/lib/auth';
import { LoginSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = await rateLimit(`login:${ip}`, 10, 60);

  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: 'Login successful',
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

    response.cookies.set('reap_trip_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
