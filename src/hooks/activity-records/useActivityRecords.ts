'use client';

import { STALE_TIME } from '@/constants/cache';
import { queryKeys } from '@/hooks/queryKeys';
import type { ActivityRecord } from '@/types';
import { useQuery } from '@tanstack/react-query';

const ACTIVITY_RECORDS_ERROR_MESSAGE = '활동 데이터를 불러오지 못했습니다.';

async function fetchActivityRecords(companyId: string): Promise<ActivityRecord[]> {
    const normalizedCompanyId = companyId.trim();

    if (!normalizedCompanyId) {
        return [];
    }

    const res = await fetch(`/api/activity-records/${encodeURIComponent(normalizedCompanyId)}`);
    if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? ACTIVITY_RECORDS_ERROR_MESSAGE);
    }

    return res.json() as Promise<ActivityRecord[]>;
}

export function useActivityRecords(companyId: string) {
    const normalizedCompanyId = companyId.trim();

    return useQuery({
        queryKey: queryKeys.activityRecords.byCompany(normalizedCompanyId),
        queryFn: () => fetchActivityRecords(normalizedCompanyId),
        enabled: normalizedCompanyId.length > 0,
        staleTime: STALE_TIME.LONG,
    });
}
