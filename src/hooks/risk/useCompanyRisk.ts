// 단일 회사 리스크 산정 훅 — useCompanies 캐시를 재활용해 추가 요청 없음

import { useCompanies } from '@/hooks/companies/useCompanies';
import { getRiskAssessments } from '@/lib/risk';
import type { RiskAssessment } from '@/lib/risk';
import { useMemo } from 'react';

export function useCompanyRisk(companyId: string, year: number): RiskAssessment | null {
    const { data: companies } = useCompanies();

    return useMemo(() => {
        if (!companies) return null;
        // 상대 배출량 점수 산정을 위해 전체 목록 기준으로 평가 후 해당 회사만 추출
        return getRiskAssessments(companies, year).find((a) => a.id === companyId) ?? null;
    }, [companies, companyId, year]);
}
