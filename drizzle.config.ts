import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
	console.error('Please provide DATABASE_URL in .env file');
	process.exit(1);
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/schema.ts',
	out: './database/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL
	}
});
