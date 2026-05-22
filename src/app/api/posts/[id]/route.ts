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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 프론트엔드 예외 처리(낙관적 업데이트 롤백) 검증을 위한 15% 실패 시뮬레이션
        if (Math.random() < 0.15) {
            return NextResponse.json({ error: '수정에 실패했습니다. 다시 시도해 주세요.' }, { status: 500 });
        }
        const { id } = await params;
        const { title, resourceUid, dateTime, content, author } = (await request.json()) as Post;
        const [row] = await sql`
            UPDATE posts
            SET title = ${title}, resource_uid = ${resourceUid}, date_time = ${dateTime},
                content = ${content}, author = ${author}
            WHERE id = ${id}
            RETURNING id, title, resource_uid, date_time, content, author
        `;
        if (!row) return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        return NextResponse.json(rowToPost(row as Record<string, unknown>));
    } catch {
        return NextResponse.json({ error: '수정에 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 프론트엔드 예외 처리(낙관적 업데이트 롤백) 검증을 위한 15% 실패 시뮬레이션
        if (Math.random() < 0.15) {
            return NextResponse.json({ error: '삭제에 실패했습니다. 다시 시도해 주세요.' }, { status: 500 });
        }
        const { id } = await params;
        await sql`DELETE FROM posts WHERE id = ${id}`;
        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
    }
}
