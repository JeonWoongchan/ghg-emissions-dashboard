import { neon } from '@neondatabase/serverless';

// Neon 서버리스 SQL 클라이언트 싱글턴
export const sql = neon(process.env.DATABASE_URL!);
