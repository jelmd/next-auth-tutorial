import { Prisma, PrismaClient } from "@prisma/client"

declare global {
	var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient({
	log: [
		'query',	// comment this out to avoid query logging
		'info',
		'warn'
	],
	transactionOptions: {
		isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
	}
});

// globalThis is not affected by hot-reload, which occures in development mode
// if a file changes.
if (process.env.NODE_ENV != 'production')
	globalThis.prisma = db;