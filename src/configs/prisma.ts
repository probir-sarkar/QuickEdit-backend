import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import ws from "ws";

function prismaGenerate(databaseUrl: string) {
	neonConfig.webSocketConstructor = ws;
	const connectionString = databaseUrl;
	const pool = new Pool({ connectionString });
	const adapter = new PrismaNeon(pool);
	const prisma = new PrismaClient({ adapter });
	return prisma;
}

export default prismaGenerate;
