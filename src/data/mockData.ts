import { Destination, LocalGuide, Recipe, TripReport, PackingItem } from '../types';

export const initialDestinations: Destination[] = [
  {
    id: 'khnong-phsar',
    nameEn: 'Khnong Phsar Pine Plateau',
    nameKm: 'ខ្នងផ្សារ (តំបន់ខ្ពង់រាបដើមស្រល់ ស្រុកឱរ៉ាល់)',
    provinceEn: 'Kampong Speu / Koh Kong',
    provinceKm: 'កំពង់ស្ពឺ / កោះកុង',
    category: 'mountain',
    coordinates: { lat: 11.8385, lng: 104.0532 },
    distanceFromPhnomPenhKm: 140,
    estimatedTravelTimeHours: 4,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
    ],
    descriptionEn: 'Famous mountain plateau surrounded by pine forests and sea of clouds. Accessible via Tang Samraong village.',
    descriptionKm: 'តំបន់ខ្ពង់រាបលើកំពូលភ្នំដ៏ល្បីល្បាញ ដែលព័ទ្ធជុំវិញដោយព្រៃស្រល់ និងសមុទ្រពពក។',
    routeDetails: {
      descriptionEn: 'Take NR4 to Kampong Speu, turn to Road 44 towards Tang Samraong village. Hire Koyon trailer to mountain base.',
      descriptionKm: 'ធ្វើដំណើរតាមផ្លូវជាតិលេខ៤ ដល់កំពង់ស្ពឺ រួចបត់ចូលផ្លូវ៤៤ ឆ្ពោះទៅភូមិនាងតាំងសំរោង។ ជួលគោយន្តសហគមន៍ឌុបទៅជើងភ្នំ។',
      roadCondition: 'dirt_rough',
      gpsPin: '11.8385,104.0532'
    },
    allowedTransport: ['motorbike', 'suv_4x4', 'foot'],
    campingRules: {
      allowed: true,
      permitRequired: true,
      feeDescriptionEn: '$5 per person eco-fund fee + guide fee.',
      feeDescriptionKm: '៥ ដុល្លារ/ម្នាក់ សម្រាប់មូលនិធិសហគមន៍ + ថ្លៃអ្នកនាំផ្លូវ។',
      rangerRegistrationNeeded: true,
      fireRulesEn: 'Fire allowed in designated campfire rings only. Carry out all plastic waste.',
      fireRulesKm: 'បង្កាត់ភ្លើងបានតែក្នុងរណ្តៅដែលបានកំណត់។ ត្រូវប្រមូលសំរាមប្លាស្ទិកត្រឡប់មកវិញ។'
    },
    difficulty: 'challenging',
    bestSeason: {
      monthsEn: 'November to March',
      monthsKm: 'វិច្ឆិកា ដល់ មីនា',
      notesEn: 'Best sea of clouds in early morning.',
      notesKm: 'មើលថ្ងៃរះ និងសមុទ្រពពកស្អាតបំផុតនៅព្រលឹមស្រាងៗ។'
    },
    nearbyServices: {
      fuelStationKm: 18,
      foodStalls: true,
      waterSourceAvailable: true,
      toiletAvailable: false,
      cellSignalStrength: 'weak'
    },
    featuredGuideIds: ['guide-khnong-1', 'guide-khnong-2']
  },
  {
    id: 'kirirom-national-park',
    nameEn: 'Kirirom Pine National Park & Waterfalls',
    nameKm: 'ឧទ្យានជាតិគិរីរម្យ (ភ្នំកកោះ & ទឹកជ្រោះចំប៉ី)',
    provinceEn: 'Kampong Speu',
    provinceKm: 'កំពង់ស្ពឺ',
    category: 'campsite',
    coordinates: { lat: 11.3167, lng: 104.0833 },
    distanceFromPhnomPenhKm: 112,
    estimatedTravelTimeHours: 2.5,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    descriptionEn: 'Cool mountain climate with dense pine groves, Champey waterfall, and lake campsites.',
    descriptionKm: 'បរិយាកាសត្រជាក់ស្រស់ស្រាយលើកំពូលភ្នំ ព្រៃស្រល់ និងទឹកជ្រោះធម្មជាតិ។',
    routeDetails: {
      descriptionEn: 'Paved road all the way up the mountain from NR4 (Treng Trayaeng).',
      descriptionKm: 'ផ្លូវកៅស៊ូស្អាតរហូតដល់កំពូលភ្នំ បត់ពីផ្លូវជាតិលេខ៤ ត្រង់ត្រែងត្រយឹង។',
      roadCondition: 'paved',
      gpsPin: '11.3167,104.0833'
    },
    allowedTransport: ['motorbike', 'sedan_car', 'suv_4x4'],
    campingRules: {
      allowed: true,
      permitRequired: false,
      feeDescriptionEn: '$3-$5 per tent pitch fee to local eco-station.',
      feeDescriptionKm: '៣-៥ ដុល្លារ/តង់ សម្រាប់សេវាស្នាក់ការសហគមន៍។',
      rangerRegistrationNeeded: false,
      fireRulesEn: 'Fire permitted inside charcoal braziers.',
      fireRulesKm: 'អាចបង្កាត់ភ្លើងក្នុងចង្ក្រានធ្យូងបាន។'
    },
    difficulty: 'easy',
    bestSeason: {
      monthsEn: 'All Year Round',
      monthsKm: 'ពេញមួយឆ្នាំ',
      notesEn: 'Cooler temperatures at night.',
      notesKm: 'អាកាសធាតុត្រជាក់ស្រួលនៅពេលយប់។'
    },
    nearbyServices: {
      fuelStationKm: 5,
      foodStalls: true,
      waterSourceAvailable: true,
      toiletAvailable: true,
      cellSignalStrength: 'strong'
    },
    featuredGuideIds: ['guide-kirirom-1']
  }
];

export const initialGuides: LocalGuide[] = [
  {
    id: 'guide-khnong-1',
    nameEn: 'Uncle Sokha (Tang Samraong Village)',
    nameKm: 'ពូ សុខា (សហគមន៍តាំងសំរោង)',
    communityVillageEn: 'Tang Samraong Eco-Community',
    communityVillageKm: 'សហគមន៍តាំងសំរោង',
    destinationIds: ['khnong-phsar'],
    phone: '097 882 1234',
    telegramHandle: '@SokhaKhnongPhsar',
    languages: ['Khmer'],
    priceRangeEn: '$25 / day for group up to 5 people',
    priceRangeKm: '$២៥ / ថ្ងៃ សម្រាប់ក្រុមរហូតដល់ ៥នាក់',
    servicesOffered: ['guiding', 'moto_transfer', 'gear_rent', 'local_cooking'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    reviewCount: 42,
    verified: true,
    bioEn: 'Native Tang Samraong villager with 6+ years experience guiding trekkers up Khnong Phsar.',
    bioKm: 'អ្នកភូមិតាំងសំរោងផ្ទាល់ មានបទពិសោធន៍នាំភ្ញៀវឡើងខ្នងផ្សារជាង ៦ឆ្នាំ។'
  }
];

export const initialRecipes: Recipe[] = [
  {
    id: 'recipe-sach-ko-ang',
    titleEn: 'Cambodian Camp Lemongrass Beef Skewers (Sach Ko Ang Kroeung)',
    titleKm: 'សាច់គោអាំងគ្រឿងបោះជំរុំ (Sach Ko Ang Kroeung)',
    category: 'dinner',
    prepTimeMinutes: 25,
    descriptionEn: 'Iconic Cambodian camp staple! Pre-marinated beef skewers with fragrant lemongrass kroeung, coconut milk, and papaya pickles.',
    descriptionKm: 'ម្ហូបបោះជំរុំដ៏ពេញនិយម! សាច់គោប្រឡាក់គ្រឿងក្រអូប ដោតចង្កាក់អាំងលើភ្នើងភ្នំ ក្លិនក្រអូបឈ្ងុយឆ្ងាញ់។',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    authorName: 'Chef Dara (Kampong Speu Camper)',
    equipmentNeededEn: ['Camp Charcoal Grill / Fire pit', 'Bamboo Skewers', 'Tongs', 'Camp Rice Pot'],
    instructionsEn: [
      'Slice beef into thin strips (approx 2cm wide).',
      'In a bowl, mix yellow kroeung paste, palm sugar, fish sauce, and coconut milk until smooth.',
      'Marinate beef strips in the kroeung mixture for at least 20 minutes (can be pre-marinated before leaving Phnom Penh).',
      'Thread beef onto bamboo skewers tightly.',
      'Prepare hot camp embers/charcoal fire. Grill skewers for 3-4 minutes per side until charred and fragrant.',
      'Serve hot with steamed jasmine rice and fresh cucumber slices.'
    ],
    instructionsKm: [
      'ហាន់សាច់គោជាបន្ទះស្តើងៗល្មម។',
      'លាយគ្រឿងបុក ស្ករត្នោត ទឹកត្រី និងខ្ទិះដូង ឬប្រេងឆាចូលគ្នាឱ្យសព្វ។',
      'ប្រឡាក់សាច់គោជាមួយគ្រឿងទុកយ៉ាងហោចណាស់ ២០នាទី (អាចប្រឡាក់ផ្អាប់ទុកពីភ្នំពេញស្រាប់)។',
      'ដោតសាច់គោចូលចង្កាក់ឫស្សីឱ្យណែនល្អ។',
      'រៀបចំភ្នើងអុស ឬធ្យូងបោះជំរុំឱ្យកៅ។ អាំងសាច់គោប្រហែល ៣-៤នាទីក្នុងមួយចំហៀង រហូតដល់ឆ្អិនក្លិនក្រអូប។',
      'ទទួលទានក្តៅៗជាមួយបាយស និងសក់ត្រកួច/ត្រសក់ស្រស់។'
    ],
    ingredients: [
      { nameEn: 'Beef (Flank / Sirloin)', nameKm: 'សាច់គោ', amountPerPerson: 250, unitEn: 'g', unitKm: 'ក្រាម', category: 'protein' },
      { nameEn: 'Yellow Kroeung Paste', nameKm: 'គ្រឿងបុក (គល់ស្លឹកគ្រៃ, រំដេង, រមៀត)', amountPerPerson: 35, unitEn: 'g', unitKm: 'ក្រាម', category: 'spices' },
      { nameEn: 'Coconut Milk / Oil', nameKm: 'ខ្ទិះដូង / ប្រេងឆា', amountPerPerson: 25, unitEn: 'ml', unitKm: 'មីលីលីត្រ', category: 'spices' },
      { nameEn: 'Palm Sugar & Fish Sauce', nameKm: 'ស្ករត្នោត & ទឹកត្រី', amountPerPerson: 15, unitEn: 'g', unitKm: 'ក្រាម', category: 'spices' },
      { nameEn: 'Bamboo Skewers', nameKm: 'ចង្កាក់ឫស្សី', amountPerPerson: 4, unitEn: 'pieces', unitKm: 'ដើម', category: 'cooking_supplies' },
      { nameEn: 'Jasmine Rice', nameKm: 'អង្ករក្រអូប', amountPerPerson: 150, unitEn: 'g', unitKm: 'ក្រាម', category: 'dry_goods' }
    ]
  },
  {
    id: 'recipe-somlar-machou-kroeung',
    titleEn: 'Camp Sour Soup with Morning Glory & Pork (Somlar Machou Kroeung)',
    titleKm: 'សម្លម្ជូរគ្រឿងសាច់ជ្រូក & ត្រកួន',
    category: 'dinner',
    prepTimeMinutes: 30,
    descriptionEn: 'Hearty sour soup cooked in a camp pot. Hydrating, full of electrolytes, and perfect for warming up chilly mountain nights.',
    descriptionKm: 'សម្លម្ជូរគ្រឿងក្តៅៗដាំក្នុងឆ្នាំងបោះជំរុំ ជួយបង្កើនកម្លាំង និងកក់ក្តៅរាងកាយនាពេលយប់លើកំពូលភ្នំ។',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    authorName: 'Sophea Trekker',
    equipmentNeededEn: ['Camp Soup Pot', 'Gas Stove / Campfire', 'Ladle'],
    instructionsEn: [
      'Chop pork ribs into bite-sized pieces and wash morning glory greens thoroughly.',
      'Boil clean stream water in a camp pot.',
      'Dissolve prohok and yellow kroeung paste into the boiling water to create aromatic broth.',
      'Add pork ribs and simmer for 15 minutes until tender.',
      'Add tamarind paste, fish sauce, and sugar to adjust sourness.',
      'Toss in morning glory greens for 2 minutes right before serving.'
    ],
    instructionsKm: [
      'កាប់ឆ្អឹងជំនីរជ្រូកជាដុំៗ និងលាងបន្លែត្រកួនឱ្យស្អាត។',
      'ដាំទឹកស្អាតក្នុងឆ្នាំងបោះជំរុំឱ្យពុះ។',
      'រំលាយប្រហុក និងគ្រឿងបុកចូលក្នុងទឹកពុះ ដើម្បីបង្កើតទឹកសម្លក្លិនក្រអូប។',
      'ដាក់ឆ្អឹងជំនីរជ្រូកចូល រំងាស់ប្រហែល ១៥នាទីឱ្យផុយសាច់។',
      'ថែមម្ជូរអំពិលទុំ ទឹកត្រី និងស្ករ ភ្លក់រសជាតិម្ជូរប្រៃល្មម។',
      'បោះបន្លែត្រកួនចូលប្រហែល ២នាទីមុនដួសទទួលទាន។'
    ],
    ingredients: [
      { nameEn: 'Pork Ribs / Belly', nameKm: 'ឆ្អឹងជំនីរជ្រូក / សាច់ជ្រូក', amountPerPerson: 200, unitEn: 'g', unitKm: 'ក្រាម', category: 'protein' },
      { nameEn: 'Water Morning Glory (Tra Kourn)', nameKm: 'បន្លែត្រកួន', amountPerPerson: 100, unitEn: 'g', unitKm: 'ក្រាម', category: 'vegetables' },
      { nameEn: 'Yellow Kroeung Paste', nameKm: 'គ្រឿងបុក', amountPerPerson: 30, unitEn: 'g', unitKm: 'ក្រាម', category: 'spices' },
      { nameEn: 'Tamarind Paste / Powder', nameKm: 'ម្ជូរអំពិលទុំ', amountPerPerson: 15, unitEn: 'g', unitKm: 'ក្រាម', category: 'spices' },
      { nameEn: 'Prohok (Fermented Fish Paste)', nameKm: 'ប្រហុក', amountPerPerson: 10, unitEn: 'g', unitKm: 'ក្រាម', category: 'spices' },
      { nameEn: 'Drinking Water', nameKm: 'ទឹកស្អាតសម្រាប់ស្ល', amountPerPerson: 400, unitEn: 'ml', unitKm: 'មីលីលីត្រ', category: 'dry_goods' }
    ]
  },
  {
    id: 'recipe-noodle-upgrade',
    titleEn: 'Ultimate Mountain Instant Noodle Upgrade',
    titleKm: 'មីកញ្ចប់បោះជំរុំពិសេស (បន្ថែមស៊ុត, បន្លែ & សាច់)',
    category: 'breakfast',
    prepTimeMinutes: 10,
    descriptionEn: 'Fast, energy-dense breakfast before trekking! Mama/WaiWai noodles enhanced with fresh eggs, canned tuna/pork, and wild greens.',
    descriptionKm: 'អាហារពេលព្រឹកលឿនរហ័ស ផ្តល់ថាមពលខ្ពស់មុនពេលដើរព្រៃ ដោយបន្ថែមស៊ុត សាច់កំប៉ុង និងបន្លែ។',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    authorName: 'Vireak Hiker',
    equipmentNeededEn: ['Small Camp Pot / Cup', 'Portable Gas Burner'],
    instructionsEn: [
      'Boil 400ml water per noodle packet.',
      'Crack fresh eggs into boiling water and let poached for 1.5 minutes.',
      'Add noodle packets, seasoning sachets, and canned pork/tuna.',
      'Stir in Chinese cabbage for 30 seconds.',
      'Squeeze fresh lime and sliced chili on top for maximum mountain flavor!'
    ],
    instructionsKm: [
      'ដាំទឹកប្រហែល ៤០០មីលីលីត្រឱ្យពុះខ្លាំង។',
      'គោះស៊ុតចូលទឹកពុះ ទុកឱ្យឆ្អិនល្មមប្រហែល ១នាទីកន្លះ។',
      'ដាក់មីកញ្ចប់ គ្រឿងទេស និងសាច់កំប៉ុងចូល។',
      'ដាក់ស្ពៃបូកគោចូល ច្របល់ប្រហែល ៣០វិនាទី។',
      'ច្របាច់ក្រូចឆ្មារ និងម្ទេសហើរៗពីលើ ដើម្បីបង្កើនរសជាតិ!'
    ],
    ingredients: [
      { nameEn: 'Instant Noodle Packets', nameKm: 'មីកញ្ចប់', amountPerPerson: 1.5, unitEn: 'packets', unitKm: 'កញ្ចប់', category: 'dry_goods' },
      { nameEn: 'Fresh Eggs', nameKm: 'ស៊ុតមាន់ / ទា', amountPerPerson: 2, unitEn: 'eggs', unitKm: 'គ្រាប់', category: 'protein' },
      { nameEn: 'Canned Pork / Luncheon Meat', nameKm: 'សាច់កំប៉ុង', amountPerPerson: 80, unitEn: 'g', unitKm: 'ក្រាម', category: 'protein' },
      { nameEn: 'Chinese Cabbage / Greens', nameKm: 'ស្ពៃបូកគោ / បន្លែ', amountPerPerson: 80, unitEn: 'g', unitKm: 'ក្រាម', category: 'vegetables' },
      { nameEn: 'Chili & Lime', nameKm: 'ម្ទេស & ក្រូចឆ្មារ', amountPerPerson: 1, unitEn: 'piece', unitKm: 'ផ្លែ', category: 'spices' }
    ]
  }
];

export const initialTripReports: TripReport[] = [
  {
    id: 'report-1',
    destinationId: 'khnong-phsar',
    authorName: 'Vireak & Kampong Speu Crew',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorRole: 'Experienced Camper • 14 Trips',
    travelDate: '2026-01-15',
    titleEn: 'Khnong Phsar Weekend Trip: Muddy trail update & Guide Sokha review',
    titleKm: 'ដំណើរទៅខ្នងផ្សារចុងសប្តាហ៍៖ បច្ចុប្បន្នភាពផ្លូវ និងការពិនិត្យសេវាមគ្គុទ្ទេសក៍ពូសុខា',
    contentEn: 'We took a group of 6 from Phnom Penh leaving Saturday at 5 AM. Road 44 from NR4 to Tang Samraong is paved now!',
    contentKm: 'ពួកយើងបានធ្វើដំណើរជាក្រុម ៦នាក់ ចេញពីភ្នំពេញថ្ងៃសៅរ៍ ម៉ោង ៥ព្រឹក។ ផ្លូវ៤៤ ពីផ្លូវជាតិលេខ៤ ទៅតាំងសំរោង ឥឡូវធ្វើបានល្អ!',
    transportUsed: 'motorbike',
    costPerPersonUSD: 38,
    difficultyRating: 4,
    roadConditionUpdate: 'Road 44 paved. Koyon trail slightly muddy but manageable.',
    tipsForNewbiesEn: 'Bring 2L drinking water for the hike up. Temperatures drop to 15°C at night.',
    tipsForNewbiesKm: 'យកទឹកស្អាត ២លីត្រសម្រាប់ឡើងភ្នំ។ សីតុណ្ហភាពចុះដល់ ១៥អង្សាពេលយប់។',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    helpfulCount: 24,
    comments: []
  }
];

export const initialPackingItems: PackingItem[] = [
  {
    id: 'p1',
    titleEn: 'Waterproof Camping Tent & Groundsheet',
    titleKm: 'តង់បោះជំរុំការពារទឹកជ្រាប & ផ្ទាំងកៅស៊ូទ្រនាប់',
    category: 'shelter',
    essentialForCamping: true,
    packed: true,
    recommendedFor: ['motorbike', 'sedan_car', 'suv_4x4', 'foot']
  },
  {
    id: 'p2',
    titleEn: 'Sleeping Bag (15°C rated)',
    titleKm: 'ថង់ដេកបោះជំរុំ (ទប់ទល់ ១៥អង្សា)',
    category: 'shelter',
    essentialForCamping: true,
    packed: false,
    recommendedFor: ['motorbike', 'sedan_car', 'suv_4x4', 'foot']
  }
];

export const sampleDestinations = initialDestinations;
export const sampleTripReports = initialTripReports;
export const sampleRecipes = initialRecipes;
export const sampleGuides = initialGuides;
