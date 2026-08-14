export type Language = 'en' | 'km';

export type TransportType = 'motorbike' | 'sedan_car' | 'suv_4x4' | 'foot' | 'boat';
export type DestinationCategory = 'mountain' | 'waterfall' | 'forest' | 'campsite' | 'lake';
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme';

export type UserRole = 'traveller' | 'tour_leader' | 'local_guide' | 'homestay_provider';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  telegram?: string;
  province?: string;
  joinedDate?: string;
  languages?: string[];
  bio?: string;
  verified?: boolean;
  savedDestinationIds: string[];
  createdRecipeIds?: string[];
  createdExperienceIds?: string[];
  stats?: {
    tripsCompleted?: number;
    expeditionsLed?: number;
    toursGuided?: number;
    rating?: number;
    reviewCount?: number;
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  nameEn: string;
  nameKm: string;
  provinceEn: string;
  provinceKm: string;
  category: DestinationCategory;
  coordinates: Coordinates;
  distanceFromPhnomPenhKm: number;
  estimatedTravelTimeHours: number;
  coverImage: string;
  gallery: string[];
  descriptionEn: string;
  descriptionKm: string;
  routeDetails: {
    descriptionEn: string;
    descriptionKm: string;
    roadCondition: 'paved' | 'dirt_good' | 'dirt_rough' | 'extreme_offroad';
    gpsPin: string;
  };
  allowedTransport: TransportType[];
  campingRules: {
    allowed: boolean;
    permitRequired: boolean;
    feeDescriptionEn: string;
    feeDescriptionKm: string;
    rangerRegistrationNeeded: boolean;
    fireRulesEn: string;
    fireRulesKm: string;
  };
  difficulty: DifficultyLevel;
  bestSeason: {
    monthsEn: string;
    monthsKm: string;
    notesEn: string;
    notesKm: string;
  };
  nearbyServices: {
    fuelStationKm: number;
    foodStalls: boolean;
    waterSourceAvailable: boolean;
    toiletAvailable: boolean;
    cellSignalStrength: 'strong' | 'weak' | 'none';
  };
  featuredGuideIds: string[];
}

export interface LocalGuide {
  id: string;
  nameEn: string;
  nameKm: string;
  communityVillageEn: string;
  communityVillageKm: string;
  destinationIds: string[];
  phone: string;
  telegramHandle?: string;
  whatsappNumber?: string;
  languages: string[];
  priceRangeEn: string;
  priceRangeKm: string;
  servicesOffered: ('guiding' | 'homestay' | 'moto_transfer' | 'boat_transfer' | 'gear_rent' | 'local_cooking')[];
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  bioEn: string;
  bioKm: string;
}

export interface TripMember {
  id: string;
  name: string;
  avatar: string;
}

export interface TripExpenseGroup {
  id: string;
  title: string;
  destination?: string;
  startDate?: string;
  createdById?: string;
  shareCode: string;
  members: TripMember[];
  createdAt?: string;
}

export interface ExpenseItem {
  id: string;
  tripGroupId?: string;
  title: string;
  amount: number;
  currency: 'KHR' | 'USD';
  paidByMemberId: string;
  splitAmongMemberIds: string[];
  category: 'fuel' | 'guide_fee' | 'food' | 'camp_fee' | 'transport_rental' | 'other';
  date: string;
}

export interface SettlementDebt {
  fromMemberId: string;
  toMemberId: string;
  amountUSD: number;
  amountKHR: number;
}

export interface RecipeIngredient {
  nameEn: string;
  nameKm: string;
  amountPerPerson: number;
  unitEn: string;
  unitKm: string;
  category: 'protein' | 'vegetables' | 'spices' | 'dry_goods' | 'cooking_supplies';
}

export interface Recipe {
  id: string;
  titleEn: string;
  titleKm: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTimeMinutes: number;
  descriptionEn: string;
  descriptionKm: string;
  image: string;
  ingredients: RecipeIngredient[];
  instructionsEn?: string[];
  instructionsKm?: string[];
  authorName?: string;
  equipmentNeededEn?: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
}

export interface TripReport {
  id: string;
  destinationId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  travelDate: string;
  titleEn: string;
  titleKm: string;
  contentEn: string;
  contentKm: string;
  transportUsed: TransportType;
  costPerPersonUSD: number;
  difficultyRating: 1 | 2 | 3 | 4 | 5;
  roadConditionUpdate: string;
  tipsForNewbiesEn: string;
  tipsForNewbiesKm: string;
  photos: string[];
  helpfulCount: number;
  comments: Comment[];
}

export interface PackingItem {
  id: string;
  category: 'shelter' | 'clothing' | 'food_water' | 'tech_nav' | 'safety_cash' | 'hygiene';
  titleEn: string;
  titleKm: string;
  recommendedFor: TransportType[];
  essentialForCamping: boolean;
  packed: boolean;
  notesEn?: string;
  notesKm?: string;
}
