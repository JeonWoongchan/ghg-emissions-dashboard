import type { Company, Country, Post } from '@/types';
import { companies as seedCompanies, countries as seedCountries } from './data';

// 모듈 스코프 in-memory 상태 — 서버 재시작 전까지 유지
const _countries: Country[] = [...seedCountries];
const _companies: Company[] = [...seedCompanies];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
// 200~800ms 사이의 랜덤 지연
const jitter = () => 200 + Math.random() * 600;

export async function fetchCountries(): Promise<Country[]> {
    await delay(jitter());
    return _countries;
}

export async function fetchCompanies(): Promise<Company[]> {
    await delay(jitter());
    return _companies;
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
