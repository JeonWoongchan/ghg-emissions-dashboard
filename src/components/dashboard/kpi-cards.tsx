// 대시보드 상단 KPI 요약 카드 4종 렌더링

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/shared/info-tooltip';
import { formatEmissions, formatYearMonth } from '@/lib/format';
import type { CompanyTotal, MonthlyTotal } from '@/lib/emissions';
import { Activity, Building2, TrendingDown, TrendingUp } from 'lucide-react';

// 전월 대비 변화율 부호 및 색상 클래스 반환
function getTrendProps(change: number | null) {
    if (change === null) return { label: '-', className: 'text-muted-foreground', Icon: Activity };
    const isDecrease = change < 0;
    return {
        label: `${isDecrease ? '' : '+'}${change.toFixed(1)}%`,
        className: isDecrease ? 'text-success' : 'text-destructive',
        Icon: isDecrease ? TrendingDown : TrendingUp,
    };
}

// 연간 총 배출량 카드
function AnnualEmissionsCard({ total, year }: { total: number; year: number }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    연간 총 배출량
                    <InfoTooltip content="선택한 연도의 전체 기업 온실가스 배출량 합산입니다. 상단 연도 선택기로 연도를 변경할 수 있습니다." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{formatEmissions(total)}</p>
                <p className="mt-1 text-xs text-muted-foreground">tCO₂e · {year}년 전체</p>
            </CardContent>
        </Card>
    );
}

// 최근 월 배출량 및 전월 대비 변화율 카드
function MonthlyEmissionsCard({
    latest,
    momChange,
}: {
    latest: MonthlyTotal | undefined;
    momChange: number | null;
}) {
    const trend = getTrendProps(momChange);
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    최근 월 배출량
                    <InfoTooltip content="선택 연도의 마지막 월 배출량과 전월 대비 증감률입니다. 초록색은 감소(개선), 빨간색은 증가(악화)를 나타냅니다." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">
                    {latest ? formatEmissions(latest.total) : '-'}
                </p>
                <p className={`mt-1 flex items-center gap-1 text-xs ${trend.className}`}>
                    <trend.Icon className="size-3" />
                    {trend.label} 전월 대비
                    {latest && (
                        <span className="ml-1 text-muted-foreground">
                            · {formatYearMonth(latest.month)}
                        </span>
                    )}
                </p>
            </CardContent>
        </Card>
    );
}

// 연간 기준 최다 배출 기업 카드
function TopEmitterCard({ company }: { company: CompanyTotal | undefined }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    최다 배출 기업
                    <InfoTooltip content="선택 연도 기준 누적 배출량이 가장 많은 기업입니다. 아래 기업별 차트에서 막대를 클릭하면 해당 기업 상세 페이지로 이동합니다." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="truncate text-2xl font-bold">{company?.name ?? '-'}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="size-3" />
                    {company ? `${formatEmissions(company.total)} tCO₂e / 연간` : '-'}
                </p>
            </CardContent>
        </Card>
    );
}

// 1월 대비 12월 배출량 감소 기업 수 카드
function ImprovingCompaniesCard({
    count,
    total,
    year,
}: {
    count: number;
    total: number;
    year: number;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    감소 추세 기업
                    <InfoTooltip content="선택 연도 1월 대비 12월 배출량이 감소한 기업 수입니다. 탄소 감축 노력의 성과를 한눈에 파악할 수 있습니다." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">
                    <span className="text-success">{count}</span>
                    <span className="text-muted-foreground"> / {total}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{year}년 1월 대비 12월 배출량 감소</p>
            </CardContent>
        </Card>
    );
}

type Props = {
    year: number;
    monthlyTotals: MonthlyTotal[];
    momChange: number | null;
    totalByCompany: CompanyTotal[];
    improvingCount: number;
    totalCompanies: number;
};

// KPI 카드 4종 조합 렌더링
export function KpiCards({ year, monthlyTotals, momChange, totalByCompany, improvingCount, totalCompanies }: Props) {
    const annualTotal = monthlyTotals.reduce((sum, m) => sum + m.total, 0);
    const latestMonth = monthlyTotals[monthlyTotals.length - 1];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnnualEmissionsCard total={annualTotal} year={year} />
            <MonthlyEmissionsCard latest={latestMonth} momChange={momChange} />
            <TopEmitterCard company={totalByCompany[0]} />
            <ImprovingCompaniesCard count={improvingCount} total={totalCompanies} year={year} />
        </div>
    );
}
