import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { prisma, disconnectDatabase } from './lib/database';
import { config, validateConfig } from './lib/config';
import { initializeDatabase } from './lib/initDatabase';
import { AuthService } from './services/authService';
import { SlotService } from './services/slotService';

// Routes
import authRoutes from './routes/auth';
import slotsRoutes from './routes/slots';
import bookingsRoutes from './routes/bookings';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', authRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/book', bookingsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Validate configuration
    validateConfig();
    
    // Initialize database (connect + create tables if needed)
    await initializeDatabase();

    // Initialize database with admin user and slots
    console.log('🌱 Initializing database...');
    const admin = await AuthService.createAdminUser(
      'Admin User',
      'admin@example.com',
      'Passw0rd!'
    );
    console.log('✅ Admin user ready:', admin.email);

    // Generate slots for the next 7 days
    const today = new Date();
    await SlotService.generateSlotsForWeek(today);
    console.log('✅ Slots generated for the next 7 days');

    // Start server
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`);
      console.log(`📊 Health check: http://localhost:${config.server.port}/health`);
      console.log(`🔗 API Base URL: http://localhost:${config.server.port}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

startServer(); 