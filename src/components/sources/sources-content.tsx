'use client';

// 배출원 분석 페이지 — 데이터 패칭 및 전체 레이아웃

import { ErrorState } from '@/components/shared/error-state';
import { YearSelector } from '@/components/shared/year-selector';
import { Skeleton } from '@/components/ui/skeleton';
import { SCOPE_COLORS, SCOPE_DESCRIPTIONS, SCOPE_LABELS, SCOPES, getScopeSourceColorMap } from '@/constants/ghg-scope';
import { useCompanies } from '@/hooks/companies/useCompanies';
import { useSourceMetrics } from '@/hooks/sources/useSourceMetrics';
import { filterByYear, getAvailableYears, getScopeBreakdown, getSelectedYear, getTotalBySource } from '@/lib/emissions';
import { formatEmissions } from '@/lib/format';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { ScopeScatterCharts, type CompanyScatterPoint } from './scope-scatter-charts';
import { SourceDrilldown } from './source-drilldown';
import { SourceRankingChart } from './source-ranking-chart';

// 배출원 분석 로딩 스켈레톤
function SourcesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-75 rounded-xl" />
            <Skeleton className="h-60 rounded-xl" />
        </div>
    );
}

// 배출원 분석 전체 컨텐츠 렌더링
export function SourcesContent() {
    const { data: companies, isLoading, error, refetch } = useCompanies();
    const [yearParam, setYearParam] = useQueryState('year', parseAsInteger);
    const [sourceParam, setSourceParam] = useQueryState('source', parseAsString);

    const availableYears = useMemo(
        () => (companies ? getAvailableYears(companies.flatMap((c) => c.emissions)) : []),
        [companies]
    );
    const selectedYear = getSelectedYear(yearParam, availableYears);

    const {
        allSources,
        activeSourceId,
        activeSource,
        scopeTotals,
        companyBreakdown,
        monthlyTrend,
    } = useSourceMetrics(companies ?? [], selectedYear, sourceParam);

    // 배출원별 색상 맵 단일 산정
    const sourceColorMap = useMemo(() => getScopeSourceColorMap(allSources), [allSources]);
    const activeSourceColor = activeSource
        ? sourceColorMap[activeSource.source] ?? SCOPE_COLORS[activeSource.scope]
        : null;

    // 회사별 산포도 데이터 — Scope 구성 포지셔닝 · 규모×집중도 차트 입력값
    const scatterData = useMemo<CompanyScatterPoint[]>(() => {
        if (!companies) return [];
        return companies.flatMap((c) => {
            const filtered = filterByYear(c.emissions, selectedYear);
            const total = filtered.reduce((sum, e) => sum + e.emissions, 0);
            if (total === 0) return [];

            const scopes = getScopeBreakdown(filtered);
            const sources = getTotalBySource(filtered);
            const topSourcePct = sources[0] ? (sources[0].total / total) * 100 : 0;
            const dominantScope = [...scopes].sort((a, b) => b.pct - a.pct)[0]?.scope ?? 1;
            const pctOf = (s: 1 | 2 | 3) => scopes.find((x) => x.scope === s)?.pct ?? 0;

            return [{
                id: c.id,
                name: c.name,
                total,
                s1Pct: pctOf(1),
                s2Pct: pctOf(2),
                s3Pct: pctOf(3),
                dominantScope,
                topSourcePct,
            }];
        });
    }, [companies, selectedYear]);

    if (isLoading) return <SourcesSkeleton />;
    if (error || !companies?.length) return <ErrorState onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">배출원 분석</h2>
                    <p className="text-muted-foreground">
                        {selectedYear}년 관리 대상 전체 · 배출원별 현황 및 Scope 분포 분석
                    </p>
                </div>
                <YearSelector
                    years={availableYears}
                    value={selectedYear}
                    onChangeAction={(y) => void setYearParam(y)}
                />
            </div>

            {/* Scope별 요약 카드 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {SCOPES.map((scope) => (
                    <div
                        key={scope}
                        className="rounded-xl border bg-card p-4 space-y-1"
                        style={{ borderLeftWidth: 3, borderLeftColor: SCOPE_COLORS[scope] }}
                    >
                        <p className="text-xs font-medium" style={{ color: SCOPE_COLORS[scope] }}>
                            {SCOPE_LABELS[scope]}
                        </p>
                        <p className="text-2xl font-bold">{formatEmissions(scopeTotals[scope])}</p>
                        <p className="text-xs text-muted-foreground">
                            tCO₂e · {SCOPE_DESCRIPTIONS[scope]}
                        </p>
                    </div>
                ))}
            </div>

            {/* 배출원 랭킹 차트 */}
            <SourceRankingChart
                allSources={allSources}
                activeSourceId={activeSourceId}
                sourceColorMap={sourceColorMap}
                onSourceSelectAction={(s) => void setSourceParam(s)}
                year={selectedYear}
            />

            {/* 선택 배출원 드릴다운 */}
            {activeSource && (
                <SourceDrilldown
                    sourceId={activeSource.source}
                    scope={activeSource.scope}
                    color={activeSourceColor ?? SCOPE_COLORS[activeSource.scope]}
                    companyBreakdown={companyBreakdown}
                    monthlyTrend={monthlyTrend}
                    year={selectedYear}
                />
            )}

            {/* Scope 구성 산포도 */}
            <ScopeScatterCharts data={scatterData} year={selectedYear} />
        </div>
    );
}
