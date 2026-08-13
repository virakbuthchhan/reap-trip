import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CommentSchema } from '@/lib/validations';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripReportId } = await params;

  try {
    const body = await req.json();
    const validatedData = CommentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        tripReportId,
        authorName: validatedData.authorName,
        authorAvatar: validatedData.authorAvatar,
        text: validatedData.text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
