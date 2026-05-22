// 대시보드 집계 지표 계산 훅 — companies 참조 변경 시에만 재계산

import { SCOPE_MAP } from '@/constants/ghg-scope';
import {
    filterByYear,
    getAnnualTotals,
    getAvailableYears,
    getMergedMonthlyData,
    getMonthlyByCompany,
    getMonthlyTotals,
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
        const yearlyTotals = getAnnualTotals(allEmissions);
        // 리스크 평가
        const assessments = getRiskAssessments(companies, selectedYear);
        const riskSummary = getRiskSummary(assessments);

        // 선택 연도 Scope별 배출량 집계
        const scopeTotals: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
        filtered.forEach((c) =>
            c.emissions.forEach((e) => {
                const scope = SCOPE_MAP[e.source];
                if (scope) scopeTotals[scope] += e.emissions;
            })
        );

        // 작년 같은 기간 대비 변화율 — 현재 연도의 최신 월까지만 비교
        const currentPeriodTotal = monthlyTotals.reduce((sum, m) => sum + m.total, 0);
        const prevYearMonths = monthlyTotals.map((m) =>
            `${parseInt(m.month.slice(0, 4)) - 1}${m.month.slice(4)}`
        );
        const prevPeriodTotal = Math.round(
            companies
                .flatMap((c) => c.emissions)
                .filter((e) => prevYearMonths.includes(e.yearMonth))
                .reduce((sum, e) => sum + e.emissions, 0)
        );
        const yoyChange =
            prevPeriodTotal > 0
                ? ((currentPeriodTotal - prevPeriodTotal) / prevPeriodTotal) * 100
                : null;

        // 최신 월의 전년 동월 대비 변화율
        const latestMonth = monthlyTotals[monthlyTotals.length - 1] ?? null;
        const prevYearSameMonth = latestMonth
            ? `${parseInt(latestMonth.month.slice(0, 4)) - 1}${latestMonth.month.slice(4)}`
            : null;
        const prevYearSameMonthTotal = prevYearSameMonth
            ? Math.round(
                  companies
                      .flatMap((c) => c.emissions)
                      .filter((e) => e.yearMonth === prevYearSameMonth)
                      .reduce((sum, e) => sum + e.emissions, 0)
              )
            : null;
        const momYoyChange =
            latestMonth && prevYearSameMonthTotal && prevYearSameMonthTotal > 0
                ? ((latestMonth.total - prevYearSameMonthTotal) / prevYearSameMonthTotal) * 100
                : null;

        return {
            selectedYear,
            availableYears,
            yearlyTotals,
            monthlyTotals,
            totalByCompany,
            mergedMonthlyData: getMergedMonthlyData(monthlyByCompany, monthlyTotals),
            riskSummary,
            scopeTotals,
            yoyChange,
            momYoyChange,
        };
    }, [companies, year]);
}
