// 대시보드 집계 지표 계산 훅 — companies 참조 변경 시에만 재계산

import {
    filterByYear,
    getAnnualTotals,
    getAvailableYears,
    getMergedMonthlyData,
    getMonthlyByCompany,
    getMonthlyTotals,
    getMonthOverMonthChange,
    getSelectedYear,
    getTotalByCompany,
} from '@/lib/emissions';
import { getRiskAssessments, getRiskSummary } from '@/lib/risk';
import type { Company } from '@/types';
import { useMemo } from 'react';

// 대시보드 표시에 필요한 집계 지표 일괄 계산 및 메모이제이션
export function useDashboardMetrics(companies: Company[], year?: number | null) {
    return useMemo(() => {
        const allEmissions = companies.flatMap((c) => c.emissions);
        const availableYears = getAvailableYears(allEmissions);
        const selectedYear = getSelectedYear(year, availableYears);

        const filtered = companies.map((c) => ({
            ...c,
            emissions: filterByYear(c.emissions, selectedYear),
        }));

        const monthlyTotals = getMonthlyTotals(filtered);
        const monthlyByCompany = getMonthlyByCompany(filtered);
        const totalByCompany = getTotalByCompany(filtered);
        // 리스크 요약은 대시보드 KPI 카드 및 Risk 진입점 표시에 사용
        const riskSummary = getRiskSummary(getRiskAssessments(companies, selectedYear));
        return {
            selectedYear,
            availableYears,
            // 연도 필터 적용 전 전체 데이터로 연도별 비교 차트용 집계
            yearlyTotals: getAnnualTotals(allEmissions),
            monthlyTotals,
            momChange: getMonthOverMonthChange(monthlyTotals),
            totalByCompany,
            mergedMonthlyData: getMergedMonthlyData(monthlyByCompany, monthlyTotals),
            riskSummary,
        };
    }, [companies, year]);
}
