import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { User, UserRole } from '../modules/user/entities/user.entity';
import { OwnerProfile } from '../modules/owner/entities/owner.entity';
import { ProviderProfile } from '../modules/provider/entities/provider.entity';
import { ServiceType } from '../common/service-type.enum';
import { Pet } from '../modules/pets/entities/pet.entity';
import { VaccinationRecord } from '../modules/health/vaccination-record/entities/vaccination-record.entity';
import { WeightRecord } from '../modules/health/weight-record/entities/weight-record.entity';
import { Message } from '../modules/message/entities/message.entity';
import {
  HireRequest,
  HireStatus,
} from '../modules/hire-requests/entities/hire-request.entity';
import { ProviderPetAssignment } from '../modules/provider-pet-assignment/entities/provider-pet-assignment.entity';
import {
  Booking,
  BookingStatus,
} from '../modules/bookings/entities/booking.entity';
import { ProviderAvailability } from '../modules/provider-availability/entities/provider-availability.entity';
import { PetNote } from '../modules/pet-notes/entities/pet-note.entity';

const N = 10;
/** Pets created for each seed owner (10 owners × 4 = 40 pets). */
const PETS_PER_OWNER = 4;
/** Matched demo accounts — every field filled, linked only to each other. */
const SHOWCASE_OWNER_IDX = 0;
const SHOWCASE_PROVIDER_IDX = 0;

const SHOWCASE_PETS: {
  name: string;
  breed: string;
  age: number;
  weight: number;
  gender: string;
  photoUrl: string;
}[] = [
  {
    name: 'Luna',
    breed: 'Golden Retriever',
    age: 4,
    weight: 28.5,
    gender: 'female',
    photoUrl:
      'https://images.unsplash.com/photo-1552053831-7154a1a1dabd?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Max',
    breed: 'Domestic Shorthair',
    age: 2,
    weight: 5.2,
    gender: 'male',
    photoUrl:
      'https://images.unsplash.com/photo-1514881248726-9d4b1a3a6da1?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bella',
    breed: 'Beagle',
    age: 6,
    weight: 11.8,
    gender: 'female',
    photoUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Charlie',
    breed: 'Labrador mix',
    age: 3,
    weight: 32.1,
    gender: 'male',
    photoUrl:
      'https://images.unsplash.com/photo-1530281700549-e82e7eb18611?auto=format&fit=crop&w=400&q=80',
  },
];

const SHOWCASE_AVAILABILITY: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}[] = [
  { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
  { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 3, startTime: '10:00', endTime: '16:00' },
  { dayOfWeek: 4, startTime: '09:00', endTime: '12:00' },
  { dayOfWeek: 5, startTime: '15:00', endTime: '19:00' },
  { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' },
];

const PET_NAMES = [
  'Luna',
  'Max',
  'Bella',
  'Charlie',
  'Cooper',
  'Daisy',
  'Rocky',
  'Milo',
  'Zoe',
  'Buddy',
  'Nala',
  'Oscar',
  'Ruby',
  'Tucker',
  'Willow',
];
const BREEDS = [
  'Lab mix',
  'Tabby',
  'Beagle',
  'Poodle',
  'Rescue',
  'Golden Retriever',
  'Siamese',
  'Bulldog',
  'Husky',
  'Corgi',
  'Maine Coon',
  'Shih Tzu',
];
const VACCINES = ['Rabies', 'DHPP', 'Bordetella', 'Lepto', 'Flu', 'Lyme'];

async function seedShowcasePair(
  ds: DataSource,
  owner: OwnerProfile,
  provider: ProviderProfile,
  ownerUser: User,
  providerUser: User,
  pairPets: Pet[],
) {
  const dueSoon = new Date();
  dueSoon.setDate(dueSoon.getDate() + 21);

  await ds
    .getRepository(ProviderAvailability)
    .createQueryBuilder()
    .delete()
    .where('providerId = :id', { id: provider.id })
    .execute();

  for (const slot of SHOWCASE_AVAILABILITY) {
    await ds.getRepository(ProviderAvailability).save(
      ds.getRepository(ProviderAvailability).create({ provider, ...slot }),
    );
  }

  const approvedHire = ds.getRepository(HireRequest).create({
    owner,
    provider,
    status: HireStatus.APPROVED,
    message:
      'We would like Dr. Chen for in-home vaccines for Luna, Max, Bella, and Charlie.',
    petIds: pairPets.map((p) => p.id),
  });
  await ds.getRepository(HireRequest).save(approvedHire);

  const pendingHire = ds.getRepository(HireRequest).create({
    owner,
    provider,
    status: HireStatus.PENDING,
    message:
      'Could you also do a weekend wellness check for Charlie only? Happy to adjust the time slot.',
    petIds: [pairPets[3].id],
  });
  await ds.getRepository(HireRequest).save(pendingHire);

  for (const pet of pairPets) {
    await ds.getRepository(ProviderPetAssignment).save(
      ds.getRepository(ProviderPetAssignment).create({
        provider,
        owner,
        pet,
        hireRequest: approvedHire,
        isActive: true,
      }),
    );
  }

  const bookingPlan: {
    status: BookingStatus;
    timeSlot: string;
    startDay: number;
    endDay: number;
  }[] = [
    { status: BookingStatus.CONFIRMED, timeSlot: '09:30', startDay: 12, endDay: 12 },
    { status: BookingStatus.PENDING, timeSlot: '11:00', startDay: 18, endDay: 18 },
    { status: BookingStatus.COMPLETED, timeSlot: '14:00', startDay: 5, endDay: 5 },
    { status: BookingStatus.CONFIRMED, timeSlot: '16:30', startDay: 24, endDay: 25 },
  ];

  for (let j = 0; j < pairPets.length; j++) {
    const plan = bookingPlan[j];
    const start = new Date(2026, 5, plan.startDay);
    const end = new Date(2026, 5, plan.endDay);
    await ds.getRepository(Booking).save(
      ds.getRepository(Booking).create({
        owner,
        provider,
        pet: pairPets[j],
        serviceType: ServiceType.VACCINATION,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        timeSlot: plan.timeSlot,
        status: plan.status,
      }),
    );
  }

  const conversation: {
    from: 'owner' | 'provider';
    text: string;
    isRead: boolean;
  }[] = [
    {
      from: 'owner',
      text: 'Hi Maya — Luna’s due for her annual rabies. Do you have a slot next Tuesday morning?',
      isRead: false,
    },
    {
      from: 'provider',
      text: 'Yes! Tuesday 9:30–11:00 works. I will bring the travel kit and treats for nervous pets.',
      isRead: true,
    },
    {
      from: 'owner',
      text: 'Perfect. Max is shy around strangers — thanks for the fear-free approach on your profile.',
      isRead: true,
    },
    {
      from: 'provider',
      text: 'Reminder: Bella’s Bordetella booster is still pending your approval in the pet hub.',
      isRead: false,
    },
  ];

  for (const msg of conversation) {
    await ds.getRepository(Message).save(
      ds.getRepository(Message).create({
        senderUserId: msg.from === 'owner' ? ownerUser.id : providerUser.id,
        receiverUserId: msg.from === 'owner' ? providerUser.id : ownerUser.id,
        messageText: msg.text,
        isRead: msg.isRead,
      }),
    );
  }

  const vacPlan: { petIdx: number; name: string; due?: Date; providerAdded?: boolean; approved?: boolean }[] = [
    { petIdx: 0, name: 'Rabies (1 yr)', due: dueSoon },
    { petIdx: 0, name: 'DHPP booster', due: new Date(2026, 8, 1) },
    { petIdx: 1, name: 'FVRCP (feline)', due: new Date(2026, 7, 15) },
    { petIdx: 2, name: 'Bordetella', due: new Date(2026, 6, 20) },
    {
      petIdx: 2,
      name: 'Bordetella (provider draft)',
      providerAdded: true,
      approved: false,
    },
    {
      petIdx: 3,
      name: 'Rabies (annual)',
      providerAdded: true,
      approved: true,
    },
  ];

  for (const v of vacPlan) {
    const given = new Date(2025, 10, 10 + v.petIdx);
    await ds.getRepository(VaccinationRecord).save(
      ds.getRepository(VaccinationRecord).create({
        pet: pairPets[v.petIdx],
        vaccineName: v.name,
        vaccinationDate: given,
        nextDueDate: v.due ?? new Date(2027, 2, 1),
        addedByProvider: v.providerAdded ? provider : null,
        isApproved: v.approved ?? true,
      }),
    );
  }

  const weightPoints = [18, 10, 10, 12];
  for (let petIdx = 0; petIdx < pairPets.length; petIdx++) {
    const points = weightPoints[petIdx];
    const baseKg = pairPets[petIdx].weight;
    for (let m = 0; m < points; m++) {
      const monthsAgo = points - 1 - m;
      const recordDate = new Date();
      recordDate.setUTCDate(1);
      recordDate.setUTCMonth(recordDate.getUTCMonth() - monthsAgo);
      recordDate.setUTCDate(Math.min(10 + petIdx, 28));
      const progress = points > 1 ? m / (points - 1) : 0;
      const weight =
        Math.round((baseKg + progress * 2.2 + Math.sin(m * 0.5) * 0.3) * 10) / 10;
      await ds.getRepository(WeightRecord).save(
        ds.getRepository(WeightRecord).create({
          pet: pairPets[petIdx],
          weight,
          recordDate,
          addedByProvider: null,
          isApproved: true,
        }),
      );
    }
  }

  await ds.getRepository(WeightRecord).save(
    ds.getRepository(WeightRecord).create({
      pet: pairPets[0],
      weight: 28.9,
      recordDate: new Date(),
      addedByProvider: provider,
      isApproved: false,
    }),
  );

  const noteTexts = [
    'Luna: grain-free diet; mild hip stiffness in cold weather.',
    'Luna: heartworm prevention due in August.',
    'Max: indoor only; hide when doorbell rings.',
    'Bella: loves cheese treats — limit to training only.',
    'Charlie: high energy — 45 min walk before visits.',
    'Charlie: microchip registered with city shelter.',
  ];
  for (let i = 0; i < noteTexts.length; i++) {
    await ds.getRepository(PetNote).save(
      ds.getRepository(PetNote).create({
        pet: pairPets[Math.floor(i / 2) % pairPets.length],
        content: noteTexts[i],
      }),
    );
  }
}

async function clear(ds: DataSource) {
  await ds.getRepository(PetNote).delete({});
  await ds.getRepository(Booking).delete({});
  await ds.getRepository(ProviderPetAssignment).delete({});
  await ds.getRepository(HireRequest).delete({});
  await ds.getRepository(VaccinationRecord).delete({});
  await ds.getRepository(WeightRecord).delete({});
  await ds.getRepository(Message).delete({});
  await ds.getRepository(Pet).delete({});
  await ds.getRepository(ProviderAvailability).delete({});
  await ds.getRepository(OwnerProfile).delete({});
  await ds.getRepository(ProviderProfile).delete({});
  await ds.getRepository(User).delete({});
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const ds = app.get(DataSource);

  const arg = process.argv[2];
  if (arg === '--clear-only') {
    await clear(ds);
    console.log('Database cleared.');
    await app.close();
    process.exit(0);
  }

  console.log('Clearing existing PetConnect tables…');
  await clear(ds);

  const hash = await bcrypt.hash('SeedPass123!', 12);
  const owners: OwnerProfile[] = [];
  const providers: ProviderProfile[] = [];
  const ownerUsers: User[] = [];
  const providerUsers: User[] = [];

  const serviceRotation = [
    ServiceType.DOG_WALKING,
    ServiceType.VACCINATION,
    ServiceType.GENERAL_SERVICE,
  ];

  for (let i = 0; i < N; i++) {
    const ou = ds.getRepository(User).create({
      email: `seed-owner-${i}@petconnect.test`,
      password: hash,
      role: UserRole.OWNER,
      isFirstLogin: false,
      isDeleted: false,
    });
    await ds.getRepository(User).save(ou);
    ownerUsers.push(ou);

    const isShowcaseOwner = i === SHOWCASE_OWNER_IDX;
    const op = ds.getRepository(OwnerProfile).create(
      isShowcaseOwner
        ? {
            user: ou,
            fullName: 'Alex Rivera',
            phoneNumber: '+1 (510) 555-0142',
          }
        : {
            user: ou,
            fullName: `Seed Owner ${i + 1}`,
            phoneNumber: `555100${String(i).padStart(4, '0')}`,
          },
    );
    await ds.getRepository(OwnerProfile).save(op);
    owners.push(op);
  }

  for (let i = 0; i < N; i++) {
    const pu = ds.getRepository(User).create({
      email: `seed-provider-${i}@petconnect.test`,
      password: hash,
      role: UserRole.PROVIDER,
      isFirstLogin: false,
      isDeleted: false,
    });
    await ds.getRepository(User).save(pu);
    providerUsers.push(pu);

    const isShowcase = i === SHOWCASE_PROVIDER_IDX;
    const pp = ds.getRepository(ProviderProfile).create(
      isShowcase
        ? {
            user: pu,
            fullName: 'Dr. Maya Chen',
            phoneNumber: '+1 (415) 555-0198',
            hourlyPayment: 42.5,
            gender: 'female',
            serviceType: ServiceType.VACCINATION,
            bio:
              'Licensed veterinary technician offering in-home vaccinations, wellness checks, and gentle handling for anxious pets. 8+ years with cats and dogs in the Bay Area. Certified in fear-free handling.',
          }
        : {
            user: pu,
            fullName: `Seed Provider ${i + 1}`,
            phoneNumber: `555200${String(i).padStart(4, '0')}`,
            hourlyPayment: 25 + i * 2.5,
            gender: i % 2 === 0 ? 'female' : 'male',
            serviceType: serviceRotation[i % 3],
            bio: `Professional pet care specialist #${i + 1}. Love animals!`,
          },
    );
    await ds.getRepository(ProviderProfile).save(pp);
    providers.push(pp);
  }

  const pets: Pet[] = [];
  const petsByOwner: Pet[][] = Array.from({ length: N }, () => []);

  for (let ownerIdx = 0; ownerIdx < N; ownerIdx++) {
    for (let j = 0; j < PETS_PER_OWNER; j++) {
      const globalIdx = ownerIdx * PETS_PER_OWNER + j;
      const showcasePet =
        ownerIdx === SHOWCASE_OWNER_IDX ? SHOWCASE_PETS[j] : null;
      const p = ds.getRepository(Pet).create({
        owner: owners[ownerIdx],
        name: showcasePet?.name ?? PET_NAMES[globalIdx % PET_NAMES.length],
        breed: showcasePet?.breed ?? BREEDS[globalIdx % BREEDS.length],
        age: showcasePet?.age ?? 1 + (globalIdx % 14),
        weight:
          showcasePet?.weight ??
          Math.round((6 + globalIdx * 0.55 + j * 1.2) * 10) / 10,
        gender: showcasePet?.gender ?? (globalIdx % 3 === 0 ? 'male' : 'female'),
        ...(showcasePet?.photoUrl ? { photoUrl: showcasePet.photoUrl } : {}),
      });
      await ds.getRepository(Pet).save(p);
      pets.push(p);
      petsByOwner[ownerIdx].push(p);
    }
  }

  for (let petIdx = 0; petIdx < pets.length; petIdx++) {
    if (petIdx < PETS_PER_OWNER) continue;
    const primary = ds.getRepository(VaccinationRecord).create({
      pet: pets[petIdx],
      vaccineName: VACCINES[petIdx % VACCINES.length],
      vaccinationDate: new Date(2025, (petIdx % 12) + 1, 5 + (petIdx % 20)),
      nextDueDate: new Date(2026, (petIdx % 12) + 1, 5 + (petIdx % 20)),
      addedByProvider: null,
      isApproved: true,
    });
    await ds.getRepository(VaccinationRecord).save(primary);

    if (petIdx % 2 === 0) {
      const booster = ds.getRepository(VaccinationRecord).create({
        pet: pets[petIdx],
        vaccineName: VACCINES[(petIdx + 2) % VACCINES.length],
        vaccinationDate: new Date(2024, (petIdx % 12) + 1, 12 + (petIdx % 10)),
        nextDueDate: new Date(2025, (petIdx % 12) + 1, 12 + (petIdx % 10)),
        addedByProvider: providers[petIdx % N],
        isApproved: petIdx % 4 !== 0,
      });
      await ds.getRepository(VaccinationRecord).save(booster);
    }
  }

  // Weight history: monthly samples going backward from today so dashboard charts have a real curve.
  const WEIGHT_POINTS_DEFAULT = 10;
  const WEIGHT_POINTS_FIRST_PET = 18;

  for (let petIdx = 0; petIdx < pets.length; petIdx++) {
    if (petIdx < PETS_PER_OWNER) continue;
    const points =
      petIdx === PETS_PER_OWNER ? WEIGHT_POINTS_FIRST_PET : WEIGHT_POINTS_DEFAULT;
    const baseKg = pets[petIdx].weight;

    for (let m = 0; m < points; m++) {
      const monthsAgo = points - 1 - m;
      const recordDate = new Date();
      recordDate.setUTCDate(1);
      recordDate.setUTCMonth(recordDate.getUTCMonth() - monthsAgo);
      recordDate.setUTCDate(Math.min(8 + (petIdx % 11), 28));

      const progress = points > 1 ? m / (points - 1) : 0;
      const growthKg = progress * (2.6 + petIdx * 0.07);
      const wobble = Math.sin(m * 0.55 + petIdx * 0.4) * 0.32;
      const weight = Math.round((baseKg + growthKg + wobble) * 10) / 10;

      const w = ds.getRepository(WeightRecord).create({
        pet: pets[petIdx],
        weight,
        recordDate,
        addedByProvider: null,
        isApproved: true,
      });
      await ds.getRepository(WeightRecord).save(w);
    }
  }

  for (let i = 0; i < N; i++) {
    if (i === SHOWCASE_OWNER_IDX) continue;
    const sender = i % 2 === 0 ? ownerUsers[i] : providerUsers[i];
    const receiver = i % 2 === 0 ? providerUsers[i] : ownerUsers[i];
    const m = ds.getRepository(Message).create({
      senderUserId: sender.id,
      receiverUserId: receiver.id,
      messageText: `Seed message #${i + 1}: Hi, checking in about pet care.`,
      isRead: i % 3 === 0,
    });
    await ds.getRepository(Message).save(m);
  }

  const hires: HireRequest[] = [];
  for (let i = 0; i < N; i++) {
    if (i === SHOWCASE_OWNER_IDX) continue;
    const h = ds.getRepository(HireRequest).create({
      owner: owners[i],
      provider: providers[i],
      status: HireStatus.APPROVED,
      message: `Seed hire request ${i + 1} (${petsByOwner[i].length} pets)`,
      petIds: petsByOwner[i].map((p) => p.id),
    });
    await ds.getRepository(HireRequest).save(h);
    hires.push(h);
  }

  for (let i = 0; i < N; i++) {
    if (i === SHOWCASE_OWNER_IDX) continue;
    for (const pet of petsByOwner[i]) {
      const a = ds.getRepository(ProviderPetAssignment).create({
        provider: providers[i],
        owner: owners[i],
        pet,
        hireRequest: hires[i],
        isActive: true,
      });
      await ds.getRepository(ProviderPetAssignment).save(a);
    }
  }

  let bookingIdx = 0;
  for (let i = 0; i < N; i++) {
    if (i === SHOWCASE_OWNER_IDX) continue;
    for (let j = 0; j < petsByOwner[i].length; j++) {
      const pet = petsByOwner[i][j];
      const start = new Date(2026, bookingIdx % 12, 3 + (bookingIdx % 20));
      const end = new Date(2026, bookingIdx % 12, 5 + (bookingIdx % 20));
      const b = ds.getRepository(Booking).create({
        owner: owners[i],
        provider: providers[i],
        pet,
        serviceType: serviceRotation[bookingIdx % 3],
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        timeSlot: `${9 + (bookingIdx % 8)}:00`,
        status:
          bookingIdx % 3 === 0
            ? BookingStatus.PENDING
            : bookingIdx % 3 === 1
              ? BookingStatus.CONFIRMED
              : BookingStatus.COMPLETED,
      });
      await ds.getRepository(Booking).save(b);
      bookingIdx++;
    }
  }

  for (let i = 0; i < N; i++) {
    if (i === SHOWCASE_PROVIDER_IDX) continue;
    const av = ds.getRepository(ProviderAvailability).create({
      provider: providers[i],
      dayOfWeek: i % 7,
      startTime: '09:00',
      endTime: `${15 + (i % 5)}:00`,
    });
    await ds.getRepository(ProviderAvailability).save(av);
  }

  await seedShowcasePair(
    ds,
    owners[SHOWCASE_OWNER_IDX],
    providers[SHOWCASE_PROVIDER_IDX],
    ownerUsers[SHOWCASE_OWNER_IDX],
    providerUsers[SHOWCASE_PROVIDER_IDX],
    petsByOwner[SHOWCASE_OWNER_IDX],
  );

  for (let petIdx = 0; petIdx < pets.length; petIdx++) {
    if (petIdx < PETS_PER_OWNER) continue;
    const n = ds.getRepository(PetNote).create({
      pet: pets[petIdx],
      content: `Seed note for ${pets[petIdx].name}: remember flea treatment and monthly weigh-in.`,
    });
    await ds.getRepository(PetNote).save(n);
  }

  const counts = {
    user: await ds.getRepository(User).count(),
    owner_profile: await ds.getRepository(OwnerProfile).count(),
    provider_profile: await ds.getRepository(ProviderProfile).count(),
    pet: await ds.getRepository(Pet).count(),
    vaccination_record: await ds.getRepository(VaccinationRecord).count(),
    weight_record: await ds.getRepository(WeightRecord).count(),
    message: await ds.getRepository(Message).count(),
    hire_request: await ds.getRepository(HireRequest).count(),
    provider_pet_assignment: await ds.getRepository(ProviderPetAssignment).count(),
    booking: await ds.getRepository(Booking).count(),
    provider_availability: await ds.getRepository(ProviderAvailability).count(),
    pet_note: await ds.getRepository(PetNote).count(),
  };

  console.log('Seed complete. Row counts:', counts);
  const showcaseOwner = owners[SHOWCASE_OWNER_IDX];
  const showcaseProvider = providers[SHOWCASE_PROVIDER_IDX];
  console.log(
    `\n${PETS_PER_OWNER} pets per owner (${pets.length} total). Password for all: SeedPass123!\n` +
      `\n  === Showcase pair (use together — all fields filled) ===\n` +
      `  Owner:    seed-owner-0@petconnect.test\n` +
      `    Name:   ${showcaseOwner.fullName} · ${showcaseOwner.phoneNumber}\n` +
      `    Pets:   ${petsByOwner[0].map((p) => `${p.name} (${p.breed}, ${p.gender}, ${p.weight}kg)`).join('; ')}\n` +
      `  Provider: seed-provider-0@petconnect.test\n` +
      `    Name:   ${showcaseProvider.fullName} · ${showcaseProvider.phoneNumber}\n` +
      `    Rate:   $${showcaseProvider.hourlyPayment}/hr · ${showcaseProvider.serviceType} · ${showcaseProvider.gender}\n` +
      `    Bio + ${SHOWCASE_AVAILABILITY.length} availability slots · 4 pets · 4 bookings · messages\n`,
  );

  await app.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
