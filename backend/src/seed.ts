import { prisma, disconnectDatabase } from './lib/database';
import { AuthService } from './services/authService';
import { SlotService } from './services/slotService';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const admin = await AuthService.createAdminUser(
    'Admin User',
    'admin@example.com',
    'Passw0rd!'
  );
  console.log('✅ Admin user created:', admin.email);

  // Create test patient user
  console.log('👤 Creating test patient user...');
  const patient = await AuthService.register(
    'Test Patient',
    'patient@example.com',
    'Passw0rd!'
  );
  console.log('✅ Test patient created:', patient.email);

  // Generate slots for the next 7 days
  console.log('📅 Generating slots for the next 7 days...');
  const today = new Date();
  await SlotService.generateSlotsForWeek(today);
  console.log('✅ Slots generated successfully');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDatabase();
  }); 