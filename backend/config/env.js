/* eslint-env node */
/* global process */
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, NODE_ENV, DB_URI,
    CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY,
    ARCJET_SECRET_KEY, ARCJET_ENV,
    JWT_SECRET, JWT_EXPIRES_IN
} = process.env;