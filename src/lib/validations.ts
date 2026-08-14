import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name is required'),
  role: z.enum(['traveller', 'tour_leader', 'local_guide', 'homestay_provider']).default('traveller'),
  phone: z.string().optional(),
  telegram: z.string().optional(),
  province: z.string().optional(),
  bio: z.string().optional(),
});

export const ExpenseSchema = z.object({
  tripGroupId: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.enum(['USD', 'KHR']).default('USD'),
  paidByMemberId: z.string(),
  splitAmongMemberIds: z.array(z.string()).min(1, 'At least one member must be selected for split'),
  category: z.enum(['fuel', 'guide_fee', 'food', 'camp_fee', 'transport_rental', 'other']),
  date: z.string(),
});

export const RecipeSchema = z.object({
  titleEn: z.string().min(2, 'Title in English is required'),
  titleKm: z.string().min(2, 'Title in Khmer is required'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  prepTimeMinutes: z.number().int().positive(),
  descriptionEn: z.string(),
  descriptionKm: z.string(),
  image: z.string().url('Image must be a valid URL'),
  ingredients: z.array(
    z.object({
      nameEn: z.string(),
      nameKm: z.string(),
      amountPerPerson: z.number(),
      unitEn: z.string(),
      unitKm: z.string(),
      category: z.enum(['protein', 'vegetables', 'spices', 'dry_goods', 'cooking_supplies']),
    })
  ),
  instructionsEn: z.array(z.string()).optional(),
  instructionsKm: z.array(z.string()).optional(),
  authorName: z.string().optional(),
  equipmentNeededEn: z.array(z.string()).optional(),
});

export const TripReportSchema = z.object({
  destinationId: z.string(),
  authorName: z.string(),
  authorAvatar: z.string(),
  authorRole: z.string(),
  travelDate: z.string(),
  titleEn: z.string(),
  titleKm: z.string(),
  contentEn: z.string(),
  contentKm: z.string(),
  transportUsed: z.enum(['motorbike', 'sedan_car', 'suv_4x4', 'foot', 'boat']),
  costPerPersonUSD: z.number(),
  difficultyRating: z.number().min(1).max(5),
  roadConditionUpdate: z.string(),
  tipsForNewbiesEn: z.string(),
  tipsForNewbiesKm: z.string(),
  photos: z.array(z.string()),
});

export const CommentSchema = z.object({
  authorName: z.string().min(1),
  authorAvatar: z.string(),
  text: z.string().min(1, 'Comment text cannot be empty'),
});
