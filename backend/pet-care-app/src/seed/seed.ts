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

    const op = ds.getRepository(OwnerProfile).create({
      user: ou,
      fullName: `Seed Owner ${i + 1}`,
      phoneNumber: `555100${String(i).padStart(4, '0')}`,
    });
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

    const pp = ds.getRepository(ProviderProfile).create({
      user: pu,
      fullName: `Seed Provider ${i + 1}`,
      phoneNumber: `555200${String(i).padStart(4, '0')}`,
      hourlyPayment: 25 + i * 2.5,
      gender: i % 2 === 0 ? 'female' : 'male',
      serviceType: serviceRotation[i % 3],
      bio: `Professional pet care specialist #${i + 1}. Love animals!`,
    });
    await ds.getRepository(ProviderProfile).save(pp);
    providers.push(pp);
  }

  const pets: Pet[] = [];
  for (let i = 0; i < N; i++) {
    const p = ds.getRepository(Pet).create({
      owner: owners[i],
      name: `Seed Pet ${i + 1}`,
      breed: ['Lab mix', 'Tabby', 'Beagle', 'Poodle', 'Rescue'][i % 5],
      age: 1 + (i % 12),
      weight: 8 + i * 0.7,
      gender: i % 3 === 0 ? 'male' : 'female',
    });
    await ds.getRepository(Pet).save(p);
    pets.push(p);
  }

  for (let i = 0; i < N; i++) {
    const v = ds.getRepository(VaccinationRecord).create({
      pet: pets[i],
      vaccineName: ['Rabies', 'DHPP', 'Bordetella', 'Lepto', 'Flu'][i % 5],
      vaccinationDate: new Date(2025, (i % 12) + 1, 5 + i),
      nextDueDate: new Date(2026, (i % 12) + 1, 5 + i),
      addedByProvider: null,
      isApproved: true,
    });
    await ds.getRepository(VaccinationRecord).save(v);
  }

  // Weight history: monthly samples going backward from today so dashboard charts have a real curve.
  const WEIGHT_POINTS_DEFAULT = 10;
  const WEIGHT_POINTS_FIRST_PET = 18;

  for (let petIdx = 0; petIdx < N; petIdx++) {
    const points =
      petIdx === 0 ? WEIGHT_POINTS_FIRST_PET : WEIGHT_POINTS_DEFAULT;
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
    const h = ds.getRepository(HireRequest).create({
      owner: owners[i],
      provider: providers[i],
      status: HireStatus.APPROVED,
      message: `Seed hire request ${i + 1}`,
      petIds: [pets[i].id],
    });
    await ds.getRepository(HireRequest).save(h);
    hires.push(h);
  }

  for (let i = 0; i < N; i++) {
    const a = ds.getRepository(ProviderPetAssignment).create({
      provider: providers[i],
      owner: owners[i],
      pet: pets[i],
      hireRequest: hires[i],
      isActive: true,
    });
    await ds.getRepository(ProviderPetAssignment).save(a);
  }

  for (let i = 0; i < N; i++) {
    const start = new Date(2026, i % 12, 3 + (i % 20));
    const end = new Date(2026, i % 12, 5 + (i % 20));
    const b = ds.getRepository(Booking).create({
      owner: owners[i],
      provider: providers[i],
      pet: pets[i],
      serviceType: serviceRotation[i % 3],
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      timeSlot: `${9 + (i % 8)}:00`,
      status:
        i % 3 === 0
          ? BookingStatus.PENDING
          : i % 3 === 1
            ? BookingStatus.CONFIRMED
            : BookingStatus.COMPLETED,
    });
    await ds.getRepository(Booking).save(b);
  }

  for (let i = 0; i < N; i++) {
    const av = ds.getRepository(ProviderAvailability).create({
      provider: providers[i],
      dayOfWeek: i % 7,
      startTime: '09:00',
      endTime: `${15 + (i % 5)}:00`,
    });
    await ds.getRepository(ProviderAvailability).save(av);
  }

  for (let i = 0; i < N; i++) {
    const n = ds.getRepository(PetNote).create({
      pet: pets[i],
      content: `Seed note ${i + 1}: remember flea treatment this month.`,
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
  console.log(
    '\nLogin examples (password for all: SeedPass123!):\n  Owner:   seed-owner-0@petconnect.test\n  Provider: seed-provider-0@petconnect.test\n',
  );

  await app.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
