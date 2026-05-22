import { sql } from '@/lib/db';
import type { Country } from '@/types';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// DB row → Country 타입 변환
function rowToCountry(row: Record<string, unknown>): Country {
    return {
        code: row.code as string,
        name: row.name as string,
    };
}

export async function GET() {
    try {
        const rows = await sql`
            SELECT code, name
            FROM countries
            ORDER BY name ASC
        `;
        return NextResponse.json(rows.map((row) => rowToCountry(row as Record<string, unknown>)));
    } catch {
        return NextResponse.json(
            { error: '국가 목록을 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
}
