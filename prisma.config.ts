import 'dotenv/config';import {defineConfig} from 'prisma/config';
export default defineConfig({schema:'prisma/schema.prisma',migrations:{path:'prisma/migrations'},datasource:{url:process.env.DATABASE_URL || 'postgresql://portfolio:local-only@localhost:5432/energy_db'}});
