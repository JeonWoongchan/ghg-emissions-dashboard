import type { Company, Country, Post } from '@/types';

export async function fetchCountries(): Promise<Country[]> {
    const res = await fetch('/api/countries');
    if (!res.ok) throw new Error('국가 목록을 불러오지 못했습니다.');
    return res.json() as Promise<Country[]>;
}

export async function fetchCompanies(): Promise<Company[]> {
    const res = await fetch('/api/companies');
    if (!res.ok) throw new Error('회사 목록을 불러오지 못했습니다.');
    return res.json() as Promise<Company[]>;
}

// posts는 Route Handler(/api/posts)를 통해 Postgres에서 관리
export async function fetchPosts(): Promise<Post[]> {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.');
    return res.json() as Promise<Post[]>;
}

export async function createOrUpdatePost(p: Omit<Post, 'id'> & { id?: string }): Promise<Post> {
    const url = p.id ? `/api/posts/${p.id}` : '/api/posts';
    const method = p.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error('저장에 실패했습니다. 다시 시도해 주세요.');
    return res.json() as Promise<Post>;
}

export async function deletePost(id: string): Promise<void> {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('삭제에 실패했습니다. 다시 시도해 주세요.');
}
