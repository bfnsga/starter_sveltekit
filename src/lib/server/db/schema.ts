import {
	pgTable,
	uuid,
	boolean,
	text,
	integer,
	index,
	uniqueIndex,
	customType
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Custom Column Type(s)
//////////////////////////////////////////
const timestamp = customType<{
	data: Date;
	driverData: string;
	config: { precision?: number };
}>({
	dataType(config) {
		const precision = typeof config?.precision !== 'undefined' ? ` (${config.precision})` : ' (3)';
		return `timestamp${precision} with time zone`;
	},
	fromDriver(value: string): Date {
		return new Date(value);
	}
});

// Tenants
//////////////////////////////////////////
export const tenants = pgTable(
	'tenants',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		createdAt: timestamp('created_at').default(sql`NOW()`),
		verified: boolean('verified').default(false),
		stripeCustomerId: text('stripe_customer_id')
	},
	(table) => {
		return {
			stripeCustomerIdIdx: uniqueIndex('idx_tenants_stripe_customer_id').on(table.stripeCustomerId)
		};
	}
);

export type Tenant = typeof tenants.$inferSelect;
export type TenantInsert = typeof tenants.$inferInsert;

// Tenants
//////////////////////////////////////////
export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		createdAt: timestamp('created_at').default(sql`NOW()`),
		email: text('email').notNull(),
		verified: boolean('verified').default(false),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' })
	},
	(table) => {
		return {
			tenantIdIdx: index('idx_users_tenant_id').on(table.tenantId),
			emailIdx: uniqueIndex('idx_users_email').on(table.email)
		};
	}
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tenants
//////////////////////////////////////////
export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at').notNull(),
	tenantId: uuid('tenant_id')
		.notNull()
		.references(() => tenants.id, { onDelete: 'cascade' })
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// Subscriptions
//////////////////////////////////////////
export const subscriptions = pgTable(
	'subscriptions',
	{
		id: text('id').primaryKey(),
		type: text('type', { enum: ['free', 'paid'] }).notNull(),
		createdAt: timestamp('created_at').default(sql`NOW()`),
		updatedAt: timestamp('updated_at'),
		currentPeriodStart: timestamp('current_period_start').notNull(),
		currentPeriodEnd: timestamp('current_period_end').notNull(),
		tenantId: uuid('tenant_id')
			.notNull()
			.references(() => tenants.id, { onDelete: 'cascade' })
	},
	(table) => {
		return {
			tenantIdIdx: index('idx_subscriptions_tenant_id').on(table.tenantId)
		};
	}
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Metrics
//////////////////////////////////////////
// export const metrics = pgTable(
// 	'metrics',
// 	{
// 		id: uuid('id').primaryKey().defaultRandom(),
// 		value: integer('value').default(0).notNull(),
// 		type: text('type', { enum: [''] }).notNull(),
// 		tenantId: uuid('tenant_id')
// 			.notNull()
// 			.references(() => tenants.id, { onDelete: 'cascade' })
// 	},
// 	(table) => {
// 		return {
// 			tenantIdTypeIdx: index('idx_usage_data_tenant_id_type').on(table.tenantId, table.type)
// 		};
// 	}
// );

// export type Metric = typeof metrics.$inferSelect;
// export type InsertMetric = typeof metrics.$inferInsert;

// API Keys
//////////////////////////////////////////
// export const apiKeys = pgTable(
// 	'api_keys',
// 	{
// 		id: uuid('id').primaryKey().defaultRandom(),
// 		key: text('key').notNull(),
// 		createdAt: timestamp('created_at').default(sql`NOW()`),
// 		tenantId: uuid('tenant_id')
// 			.notNull()
// 			.references(() => tenants.id, { onDelete: 'cascade' })
// 	},
// 	(table) => {
// 		return {
// 			tenantIdIdx: index('idx_api_keys_tenant_id').on(table.tenantId)
// 		};
// 	}
// );

// export type APIKey = typeof apiKeys.$inferSelect;
// export type InsertAPIKey = typeof apiKeys.$inferInsert;
