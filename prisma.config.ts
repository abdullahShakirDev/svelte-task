import { defineConfig } from '@prisma/config';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

export default defineConfig({
	adapter: () => {
		const client = createClient({
			url: process.env.DATABASE_URL!,
			authToken: process.env.TURSO_AUTH_TOKEN
		});

		return new PrismaLibSQL(client);
	}
});
