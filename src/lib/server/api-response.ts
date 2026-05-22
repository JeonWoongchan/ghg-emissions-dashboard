import { NextResponse } from 'next/server';

export function apiError(message: string, status = 500) {
    return NextResponse.json({ error: message }, { status });
}

// 과제 스펙 준수: 쓰기 요청에 200~800ms 네트워크 지연 시뮬레이션
export const simulateDelay = () =>
    new Promise<void>((res) => setTimeout(res, 200 + Math.random() * 600));

// 과제 스펙 준수: 쓰기 요청 15% 확률 실패 시뮬레이션 (createOrUpdatePost 명세 기준)
export const shouldFail = () => Math.random() < 0.15;
