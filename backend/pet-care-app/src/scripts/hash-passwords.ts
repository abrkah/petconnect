import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from '../modules/user/entities/user.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
  synchronize: false,
});

async function hashExistingPasswords() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const users = await userRepository.find();

  for (const user of users) {
    if (!user.password) continue;

    const isAlreadyHashed = user.password.startsWith('$2b$');
    if (isAlreadyHashed) continue;

    const hashedPassword = await bcrypt.hash(user.password, 12);

    await userRepository.update(user.id, {
      password: hashedPassword,
    });

    console.log(`✔ Hashed password for user: ${user.email}`);
  }

  await dataSource.destroy();
  console.log('✅ All passwords hashed successfully');
}

hashExistingPasswords().catch((err) => {
  console.error('❌ Error hashing passwords:', err);
});