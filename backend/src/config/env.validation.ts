import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  PORT: z.string().default('3000'),
  FRONTEND_ORIGIN: z.string().default('http://localhost:3001'),
});

export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Environment validation failed');
  }
  return parsed.data;
}
