export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: '24h'
  },
  server: {
    port: process.env.PORT || 3000,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  },
  bcrypt: {
    saltRounds: 12
  }
};

// Validate required environment variables
export const validateConfig = () => {
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  Warning: JWT_SECRET not set. Using default value. Set JWT_SECRET environment variable in production.');
  }
};
