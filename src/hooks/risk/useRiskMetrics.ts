// 리스크 페이지 지표 계산 훅

import { getAvailableYears, getSelectedYear } from '@/lib/emissions';
import { getRiskAssessments, getRiskSummary } from '@/lib/risk';
import type { Company } from '@/types';
import { useMemo } from 'react';

// 리스크 페이지 표시에 필요한 파생 지표 일괄 계산
export function useRiskMetrics(companies: Company[], year?: number | null) {
    return useMemo(() => {
        // 관리 대상 배출 데이터의 사용 가능 연도 계산
        const availableYears = getAvailableYears(companies.flatMap((company) => company.emissions));
        const selectedYear = getSelectedYear(year, availableYears);

        // 선택 연도 기준 회사별 리스크와 KPI 요약 산정
        const assessments = getRiskAssessments(companies, selectedYear);
        const summary = getRiskSummary(assessments);

        return {
            selectedYear,
            availableYears,
            assessments,
            summary,
        };
    }, [companies, year]);
}
