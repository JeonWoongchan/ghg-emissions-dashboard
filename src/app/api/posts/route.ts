import { sql } from '@/lib/db';
import type { Post } from '@/types';
import { NextResponse } from 'next/server';

// DB row → Post 타입 변환 (snake_case → camelCase)
function rowToPost(row: Record<string, unknown>): Post {
    return {
        id: row.id as string,
        title: row.title as string,
        resourceUid: row.resource_uid as string,
        dateTime: row.date_time as string,
        content: row.content as string,
        author: row.author as string,
    };
}

export async function GET() {
    try {
        const rows = await sql`
            SELECT id, title, resource_uid, date_time, content, author
            FROM posts
            ORDER BY created_at DESC
        `;
        return NextResponse.json(rows.map(rowToPost));
    } catch {
        return NextResponse.json({ error: '게시글을 불러오지 못했습니다.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // 프론트엔드 예외 처리(낙관적 업데이트 롤백) 검증을 위한 15% 실패 시뮬레이션
        if (Math.random() < 0.15) {
            return NextResponse.json({ error: '저장에 실패했습니다. 다시 시도해 주세요.' }, { status: 500 });
        }
        const { title, resourceUid, dateTime, content, author } = (await request.json()) as Post;
        const [row] = await sql`
            INSERT INTO posts (title, resource_uid, date_time, content, author)
            VALUES (${title}, ${resourceUid}, ${dateTime}, ${content}, ${author})
            RETURNING id, title, resource_uid, date_time, content, author
        `;
        return NextResponse.json(rowToPost(row as Record<string, unknown>), { status: 201 });
    } catch {
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}
