import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signJWT } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const limiter = await rateLimit(`register:${ip}`, 10, 60);

  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validatedData.password);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(validatedData.email)}`;

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
        role: validatedData.role,
        avatar,
        phone: validatedData.phone || '',
        telegram: validatedData.telegram || '',
        province: validatedData.province || 'Phnom Penh',
        joinedDate: 'Just Now',
        languages: ['Khmer'],
        bio: validatedData.bio || 'Adventurer exploring Cambodian mountains and rivers.',
        verified: validatedData.role !== 'local_guide',
        savedDestinationIds: [],
        createdRecipeIds: [],
        createdExperienceIds: [],
        stats: { tripsCompleted: 0 },
      },
    });

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful',
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
      },
      { status: 201 }
    );

    response.cookies.set('reap_trip_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
