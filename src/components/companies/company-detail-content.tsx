'use client';

// 회사 상세 데이터 패칭 및 차트 레이아웃 구성

import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { COUNTRY_FLAGS } from '@/constants/countries';
import { useCompany } from '@/hooks/companies/useCompanies';
import {
    filterByYear,
    getAvailableYears,
    getMonthlyByScope,
    getScopeBreakdown,
    getTotalBySource,
} from '@/lib/emissions';
import { formatEmissions } from '@/lib/format';
import { useMemo } from 'react';
import { CompanyMonthlyChart } from './company-monthly-chart';
import { CompanyScopeChart } from './company-scope-chart';
import { CompanySourceChart } from './company-source-chart';

// 회사 상세 로딩 중 스켈레톤
function CompanyDetailSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-16 w-64 rounded-xl" />
            <Skeleton className="h-[320px] rounded-xl" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-[260px] rounded-xl" />
                <Skeleton className="h-[260px] rounded-xl" />
            </div>
        </div>
    );
}

// 회사 상세 컨텐츠 렌더링
export function CompanyDetailContent({ id }: { id: string }) {
    const { data: company, isLoading, error, refetch } = useCompany(id);

    // 데이터에서 최신 연도 파생 — Step 2에서 선택 UI 추가 예정
    const selectedYear = useMemo(() => {
        if (!company) return new Date().getFullYear();
        return getAvailableYears(company.emissions)[0] ?? new Date().getFullYear();
    }, [company]);

    if (isLoading) return <CompanyDetailSkeleton />;
    if (error || !company) return <ErrorState onRetry={refetch} />;

    const filteredEmissions = filterByYear(company.emissions, selectedYear);
    const annualTotal = Math.round(filteredEmissions.reduce((sum, e) => sum + e.emissions, 0));
    const monthlyByScope = getMonthlyByScope(filteredEmissions);
    const scopes = getScopeBreakdown(filteredEmissions);
    const totalBySource = getTotalBySource(filteredEmissions);
    const flag = COUNTRY_FLAGS[company.country] ?? '';

    return (
        <div className="space-y-6">
            {/* 회사 헤더 */}
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight">{company.name}</h2>
                    <span className="text-muted-foreground">
                        {flag} {company.country}
                    </span>
                </div>
                <p className="text-muted-foreground">
                    {selectedYear}년 연간 총 배출량:{' '}
                    <span className="font-semibold text-foreground">
                        {formatEmissions(annualTotal)} tCO₂e
                    </span>
                </p>
            </div>

            {/* 월별 Scope 스택 에어리어 차트 */}
            <CompanyMonthlyChart data={monthlyByScope} year={selectedYear} />

            {/* Scope 비중 + 배출원별 차트 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CompanyScopeChart scopes={scopes} totalEmissions={annualTotal} />
                <CompanySourceChart sources={totalBySource} year={selectedYear} />
            </div>
        </div>
    );
}
