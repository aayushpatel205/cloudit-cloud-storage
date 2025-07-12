import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config();
console.log(process.env.NEXT_PUBLIC_DATABASE_URL);

if(!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}


export default defineConfig({
  out: './drizzle',
  schema: './db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});