// 대시보드 상단 KPI 요약 카드 4종 렌더링

import { MetricCard } from '@/components/shared/metric-card';
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
        <MetricCard
            title="연간 총 배출량"
            tooltip="선택한 연도의 관리 대상 전체 온실가스 배출량 합산입니다. 상단 연도 선택기로 연도를 변경할 수 있습니다."
            value={formatEmissions(total)}
            helper={`tCO₂e · ${year}년 관리 대상 전체`}
        />
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
        <MetricCard
            title="최근 월 배출량"
            tooltip="선택 연도의 마지막 월 배출량과 전월 대비 증감률입니다. 초록색은 감소(개선), 빨간색은 증가(악화)를 나타냅니다."
            value={latest ? formatEmissions(latest.total) : '-'}
            helper={
                <>
                    {trend.label} 전월 대비
                    {latest && (
                        <span className="ml-1 text-muted-foreground">
                            · {formatYearMonth(latest.month)}
                        </span>
                    )}
                </>
            }
            icon={trend.Icon}
            helperClassName={trend.className}
        />
    );
}

// 연간 기준 최다 배출 기업 카드
function TopEmitterCard({ company }: { company: CompanyTotal | undefined }) {
    return (
        <MetricCard
            title="최대 배출 관리 대상"
            tooltip="선택 연도 기준 누적 배출량이 가장 많은 관리 대상 회사입니다. 아래 기업별 차트에서 막대를 클릭하면 해당 기업 상세 페이지로 이동합니다."
            value={company?.name ?? '-'}
            helper={company ? `${formatEmissions(company.total)} tCO₂e / 연간` : '-'}
            icon={Building2}
            valueClassName="truncate"
        />
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
        <MetricCard
            title="감소 추세 회사"
            tooltip="선택 연도 1월 대비 12월 배출량이 감소한 관리 대상 회사 수입니다. 탄소 감축 노력의 성과를 한눈에 파악할 수 있습니다."
            value={
                <>
                    <span className="text-success">{count}</span>
                    <span className="text-muted-foreground"> / {total}</span>
                </>
            }
            helper={`${year}년 1월 대비 12월 배출량 감소`}
        />
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
