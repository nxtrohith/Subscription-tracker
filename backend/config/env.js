/* eslint-env node */
/* global process */
import {config} from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {PORT, NODE_ENV, DB_URI,
                JWT_SECRET, JWT_EXPIRES_IN,
                ARCJET_SECRET_KEY, ARCJET_ENV
} = process.env;