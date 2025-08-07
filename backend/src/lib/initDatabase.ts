import { prisma } from './database';

export async function initializeDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test if we can connect to the database
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if tables exist by trying a simple query
    try {
      await prisma.user.findFirst();
      console.log('✅ Database tables already exist');
      return true;
    } catch (error: any) {
      if (error.code === 'P2021' || error.message.includes('does not exist')) {
        console.log('❌ Database tables not found!');
        console.log('🔧 This should not happen if migrations ran during build.');
        console.log('   If you see this error, run the following commands:');
        console.log('   1. Go to your Render dashboard and open a shell');
        console.log('   2. Run: npx prisma migrate deploy');
        console.log('   3. Run: npx prisma generate');
        console.log('   4. Restart your service');
        console.log('   Note: The build script should handle this automatically.');
        
        throw new Error('Database tables not found. Please run migration first.');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
