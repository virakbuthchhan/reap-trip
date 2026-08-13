import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { RecipeSchema } from '@/lib/validations';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = RecipeSchema.parse(body);

    const recipe = await prisma.recipe.create({
      data: validatedData,
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
