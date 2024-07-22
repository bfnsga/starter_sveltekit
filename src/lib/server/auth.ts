import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '$db';
import { users, sessions } from '$db/schema';
import { dev } from '$app/environment';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (attributes) => {
		return {
			tenantId: attributes.tenantId
		};
	},
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseSessionAttributes {
	tenantId: string;
}
