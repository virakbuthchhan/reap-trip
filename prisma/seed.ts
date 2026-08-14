import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUsers = [
    {
      id: 'user_traveller_1',
      email: 'bopha.chan@reaptrip.com',
      passwordHash,
      name: 'Bopha Chan (បុប្ផា ចាន់)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'traveller',
      phone: '+855 12 345 678',
      telegram: '@bopha_hikes',
      province: 'Phnom Penh',
      joinedDate: 'Jan 2024',
      languages: ['Khmer', 'English'],
      bio: 'Avid weekend hiker, nature photographer, and camp cooking enthusiast exploring Cambodia wilderness.',
      verified: true,
      savedDestinationIds: ['khnong-phsar', 'kirirom-national-park', 'tatai-waterfall'],
      createdRecipeIds: ['recipe-beef-plea', 'recipe-somlar-machou-kroeung'],
      createdExperienceIds: ['report-1'],
      stats: { tripsCompleted: 14, rating: 4.9 }
    },
    {
      id: 'user_tour_leader_1',
      email: 'dara.veng@reaptrip.com',
      passwordHash,
      name: 'Dara Veng (ដារ៉ា វ៉េង)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'tour_leader',
      phone: '+855 98 765 432',
      telegram: '@dara_expeditions',
      province: 'Kampong Speu',
      joinedDate: 'Nov 2022',
      languages: ['Khmer', 'English', 'French'],
      bio: 'Certified wilderness expedition leader with 6+ years organizing group summits to Phnom Aural & Khnong Phsar.',
      verified: true,
      savedDestinationIds: ['phnom-aural', 'chi-phat'],
      createdRecipeIds: ['recipe-noodle-upgrade'],
      createdExperienceIds: [],
      stats: { expeditionsLed: 38, tripsCompleted: 52, rating: 5.0 }
    },
    {
      id: 'user_local_guide_1',
      email: 'sokha.chem@reaptrip.com',
      passwordHash,
      name: 'Sokha Chem (សុខា ជឹម)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      role: 'local_guide',
      phone: '+855 77 889 900',
      telegram: '@sokha_khnongphsar',
      province: 'Koh Kong / Kampong Speu',
      joinedDate: 'Mar 2021',
      languages: ['Khmer'],
      bio: 'Native community ranger and local trail guide for Khnong Phsar pine plateau. Born and raised in Tang Bamm village.',
      verified: true,
      savedDestinationIds: ['khnong-phsar'],
      createdRecipeIds: [],
      createdExperienceIds: [],
      stats: { toursGuided: 120, rating: 4.9, reviewCount: 42 }
    }
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }
  console.log('✅ Users seeded');

  // 2. Seed Destinations
  const destinations = [
    {
      id: 'khnong-phsar',
      nameEn: 'Khnong Phsar Pine Plateau',
      nameKm: 'ខ្នងផ្សារ (តំបន់ខ្ពង់រាបដើមស្រល់ ស្រុកឱរ៉ាល់)',
      provinceEn: 'Kampong Speu / Koh Kong',
      provinceKm: 'កំពង់ស្ពឺ / កោះកុង',
      category: 'mountain',
      lat: 11.8385,
      lng: 104.0532,
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
      lat: 11.3167,
      lng: 104.0833,
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
    },
    {
      id: 'tatai-waterfall',
      nameEn: 'Tatai River & Waterfall Eco Sanctuary',
      nameKm: 'ទឹកជ្រោះតាតៃ & ដែនជម្រកធម្មជាตិតាតៃ (កោះកុង)',
      provinceEn: 'Koh Kong',
      provinceKm: 'កោះកុង',
      category: 'waterfall',
      lat: 11.5642,
      lng: 103.1172,
      distanceFromPhnomPenhKm: 280,
      estimatedTravelTimeHours: 5,
      coverImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
      ],
      descriptionEn: 'Cascading river waterfall surrounded by Cardamom mountains rain forest.',
      descriptionKm: 'ទឹកជ្រោះហូរធ្លាក់យ៉ាងស្រស់ស្អាតកណ្តាលព្រៃភ្នំក្រវ៉ាញ។',
      routeDetails: {
        descriptionEn: 'Take National Highway 48 to Tatai Bridge. Take a local longtail boat (20 mins) to the waterfall site.',
        descriptionKm: 'ធ្វើដំណើរតាមផ្លូវជាតិលេខ៤៨ ដល់ស្ពានតាតៃ រួចជិះទូកសហគមន៍ ២០នាទីទៅកាន់ទឹកជ្រោះ។',
        roadCondition: 'paved',
        gpsPin: '11.5642,103.1172'
      },
      allowedTransport: ['motorbike', 'sedan_car', 'suv_4x4', 'boat'],
      campingRules: {
        allowed: true,
        permitRequired: false,
        feeDescriptionEn: '$2 boat pier fee + boat rental.',
        feeDescriptionKm: '២ ដុល្លារ/ម្នាក់ ថ្លៃសំបុត្រចូលសហគមន៍ + ថ្លៃជួលទូក។',
        rangerRegistrationNeeded: false,
        fireRulesEn: 'No fires directly on bamboo decking.',
        fireRulesKm: 'ហាមបង្កាត់ភ្លើងលើស្ពាន ឬរោងឬស្សីសហគមន៍។'
      },
      difficulty: 'moderate',
      bestSeason: {
        monthsEn: 'October to February',
        monthsKm: 'តុលា ដល់ កុម្ភៈ',
        notesEn: 'High water levels, clear green water.',
        notesKm: 'ទឹកជ្រោះមានទឹកច្រើន និងថ្លាឈ្វេង។'
      },
      nearbyServices: {
        fuelStationKm: 12,
        foodStalls: true,
        waterSourceAvailable: true,
        toiletAvailable: true,
        cellSignalStrength: 'strong'
      },
      featuredGuideIds: ['guide-tatai-1']
    }
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { id: dest.id },
      update: dest,
      create: dest
    });
  }
  console.log('✅ Destinations seeded');

  // 3. Seed Local Guides
  const guides = [
    {
      id: 'guide-khnong-1',
      nameEn: 'Sokha Chem',
      nameKm: 'សុខា ជឹម (ពូសុខា)',
      communityVillageEn: 'Tang Samraong Eco Community',
      communityVillageKm: 'សហគមន៍ភូមិនាងតាំងសំរោង',
      destinationIds: ['khnong-phsar'],
      phone: '+855 77 889 900',
      telegramHandle: '@sokha_khnongphsar',
      whatsappNumber: '+85577889900',
      languages: ['Khmer'],
      priceRangeEn: '$15 - $25 per day',
      priceRangeKm: '១៥ - ២៥ ដុល្លារ/ថ្ងៃ',
      servicesOffered: ['guiding', 'homestay', 'moto_transfer', 'gear_rent', 'local_cooking'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      reviewCount: 42,
      verified: true,
      bioEn: 'Ranger & local guide with 10+ years exploring Khnong Phsar plateau. Speaks native Khmer.',
      bioKm: 'អ្នកនាំផ្លូវសហគមន៍ដែលមានបទពិសោធន៍ជាង ១០ឆ្នាំ ស្គាល់គ្រប់ជ្រុងជ្រោយនៃតំបន់ខ្នងផ្សារ។'
    },
    {
      id: 'guide-khnong-2',
      nameEn: 'Vanna Khem',
      nameKm: 'វណ្ណា ខឹម',
      communityVillageEn: 'Tang Bamm Village',
      communityVillageKm: 'ភូមិតាំងបាំ',
      destinationIds: ['khnong-phsar'],
      phone: '+855 12 998 877',
      telegramHandle: '@vanna_trek',
      whatsappNumber: '+85512998877',
      languages: ['Khmer', 'English'],
      priceRangeEn: '$20 per day',
      priceRangeKm: '២០ ដុល្លារ/ថ្ងៃ',
      servicesOffered: ['guiding', 'gear_rent'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      reviewCount: 28,
      verified: true,
      bioEn: 'Young local guide specializing in overnight camping trips and sunrise photography spots.',
      bioKm: 'អ្នកនាំផ្លូវវ័យក្មេង ជំនាញខាងការបោះជំរុំ និងនាំទៅចំណុចថតរូបថ្ងៃរះស្អាតៗ។'
    }
  ];

  for (const guide of guides) {
    await prisma.localGuide.upsert({
      where: { id: guide.id },
      update: guide,
      create: guide
    });
  }
  console.log('✅ Local Guides seeded');

  // 4. Seed Trip Groups & Expenses
  const tripGroups = [
    {
      id: 'trip-oral-mountain',
      title: 'ទ្រីបទៅ Oral Mountain (Phnom Aural Expedition)',
      destination: 'Phnom Aural (កំពូលភ្នំឱរ៉ាល់)',
      startDate: '2026-02-14',
      shareCode: 'oral-trip-2026',
      members: [
        { id: 'm1', name: 'បុត្រ', avatar: '🌾' },
        { id: 'm2', name: 'ធាន់ណា', avatar: '⛺' },
        { id: 'm3', name: 'ស៊ីថុង', avatar: '🧗' },
        { id: 'm4', name: 'ឆើត', avatar: '⛺' }
      ]
    },
    {
      id: 'trip-khnong-phsar',
      title: 'ដំណើរទៅខ្នងផ្សារ (Khnong Phsar Pine Plateau)',
      destination: 'Khnong Phsar (ខ្នងផ្សារ)',
      startDate: '2026-01-20',
      shareCode: 'khnong-trip-2026',
      members: [
        { id: 'm1', name: 'បុត្រ', avatar: '🌾' },
        { id: 'm2', name: 'ធាន់ណា', avatar: '⛺' }
      ]
    }
  ];

  for (const group of tripGroups) {
    await prisma.tripGroup.upsert({
      where: { id: group.id },
      update: group,
      create: group
    });
  }
  console.log('✅ Trip Groups seeded');

  const expenses = [
    {
      id: 'exp-1',
      tripGroupId: 'trip-oral-mountain',
      title: 'Local Ranger & Guide Fee (Phnom Aural)',
      amount: 60.0,
      currency: 'USD',
      paidByMemberId: 'm1',
      splitAmongMemberIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'guide_fee',
      date: '2026-02-14'
    },
    {
      id: 'exp-2',
      tripGroupId: 'trip-oral-mountain',
      title: 'Koyon Trailer Rental & Fuel',
      amount: 40000.0,
      currency: 'KHR',
      paidByMemberId: 'm3',
      splitAmongMemberIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'fuel',
      date: '2026-02-14'
    },
    {
      id: 'exp-3',
      tripGroupId: 'trip-oral-mountain',
      title: 'Camp Grocery & Grilled Meat at Market',
      amount: 45.0,
      currency: 'USD',
      paidByMemberId: 'm2',
      splitAmongMemberIds: ['m1', 'm2', 'm3', 'm4'],
      category: 'food',
      date: '2026-02-15'
    }
  ];

  for (const exp of expenses) {
    await prisma.expenseItem.upsert({
      where: { id: exp.id },
      update: exp,
      create: exp
    });
  }
  console.log('✅ Expenses seeded');

  // 5. Seed Recipes
  const recipes = [
    {
      id: 'recipe-beef-plea',
      titleEn: 'Khnong Phsar Grilled Beef Skewers (Pleah Sach Ko)',
      titleKm: 'សាច់គោអាំងគ្រឿងបុក (ខ្នងផ្សារ)',
      category: 'dinner',
      prepTimeMinutes: 25,
      descriptionEn: 'Tender beef strips marinated in yellow kroeung paste, palm sugar, and fish sauce grilled over camp charcoal.',
      descriptionKm: 'សាច់គោបន្ទះស្តើងប្រឡាក់គ្រឿងបុក ស្ករត្នោត និងទឹកត្រី អាំងលើភ្នើងអុសបោះជំរុំ ឈ្ងុយឆ្ងាញ់ពិសា។',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      authorName: 'Chef Dara (Kampong Speu Camper)',
      equipmentNeededEn: ['Camp Charcoal Grill / Fire pit', 'Bamboo Skewers', 'Tongs', 'Camp Rice Pot'],
      instructionsEn: [
        'Slice beef into thin strips (approx 2cm wide).',
        'In a bowl, mix yellow kroeung paste, palm sugar, fish sauce, and coconut milk until smooth.',
        'Marinate beef strips in the kroeung mixture for at least 20 minutes.',
        'Thread beef onto bamboo skewers tightly.',
        'Grill skewers for 3-4 minutes per side until charred and fragrant.'
      ],
      instructionsKm: [
        'ហាន់សាច់គោជាបន្ទះស្តើងៗល្មម។',
        'លាយគ្រឿងបុក ស្ករត្នោត ទឹកត្រី និងខ្ទិះដូង ឬប្រេងឆាចូលគ្នាឱ្យសព្វ។',
        'ប្រឡាក់សាច់គោជាមួយគ្រឿងទុកយ៉ាងហោចណាស់ ២០នាទី។',
        'ដោតសាច់គោចូលចង្កាក់ឫស្សីឱ្យណែនល្អ។',
        'អាំងសាច់គោប្រហែល ៣-៤នាទីក្នុងមួយចំហៀង រហូតដល់ឆ្អិនក្លិនក្រអូប។'
      ],
      ingredients: [
        { nameEn: 'Beef (Flank / Sirloin)', nameKm: 'សាច់គោ', amountPerPerson: 250, unitEn: 'g', unitKm: 'ក្រាម', category: 'protein' },
        { nameEn: 'Yellow Kroeung Paste', nameKm: 'គ្រឿងបុក (គល់ស្លឹកគ្រៃ, រំដេង, រមៀត)', amountPerPerson: 35, unitEn: 'g', unitKm: 'ក្រាម', category: 'spices' },
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
        { nameEn: 'Water Morning Glory (Tra Kourn)', nameKm: 'បន្លែត្រកួន', amountPerPerson: 100, unitEn: 'g', unitKm: 'ក្រាម', category: 'vegetables' }
      ]
    }
  ];

  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { id: recipe.id },
      update: recipe,
      create: recipe
    });
  }
  console.log('✅ Recipes seeded');

  // 6. Seed Trip Reports
  const reports = [
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
      costPerPersonUSD: 38.0,
      difficultyRating: 4,
      roadConditionUpdate: 'Road 44 paved. Koyon trail slightly muddy but manageable.',
      tipsForNewbiesEn: 'Bring 2L drinking water for the hike up. Temperatures drop to 15°C at night.',
      tipsForNewbiesKm: 'យកទឹកស្អាត ២លីត្រសម្រាប់ឡើងភ្នំ។ សីតុណ្ហភាពចុះដល់ ១៥អង្សាពេលយប់។',
      photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
      helpfulCount: 24
    }
  ];

  for (const report of reports) {
    await prisma.tripReport.upsert({
      where: { id: report.id },
      update: report,
      create: report
    });
  }
  console.log('✅ Trip Reports seeded');

  // 7. Seed Packing Items
  const items = [
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
    },
    {
      id: 'p3',
      titleEn: 'Portable Gas Stove & Cooking Pot',
      titleKm: 'ចង្ក្រានហ្គាសចល័ត & ឆ្នាំងស្លបោះជំរុំ',
      category: 'food_water',
      essentialForCamping: true,
      packed: false,
      recommendedFor: ['motorbike', 'sedan_car', 'suv_4x4']
    }
  ];

  for (const item of items) {
    await prisma.packingItem.upsert({
      where: { id: item.id },
      update: item,
      create: item
    });
  }
  console.log('✅ Packing Items seeded');

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
