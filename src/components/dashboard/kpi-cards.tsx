// 대시보드 상단 KPI 요약 카드 4종 렌더링

import { MetricCard } from '@/components/shared/metric-card';
import { ROUTES } from '@/constants/navigation';
import type { MonthlyTotal } from '@/lib/emissions';
import type { RiskSummary } from '@/lib/risk';
import { formatEmissions, formatKrw, formatYearMonth, getTrendProps } from '@/lib/format';
import { Banknote } from 'lucide-react';

// 연간 총 배출량 + 전년 대비 변화율 카드
function AnnualEmissionsCard({
    total,
    year,
    yoyChange,
}: {
    total: number;
    year: number;
    yoyChange: number | null;
}) {
    const trend = getTrendProps(yoyChange);
    return (
        <MetricCard
            title="연간 총 배출량"
            tooltip="선택한 연도의 관리 대상 전체 온실가스 배출량 합산입니다. 변화율은 작년 같은 기간(1월~최신 월) 대비 증감률이며, 상단 연도 선택기로 연도를 변경할 수 있습니다."
            value={formatEmissions(total)}
            helper={
                yoyChange !== null
                    ? `${trend.label} 작년 같은 기간 대비`
                    : `${year}년 관리 대상 전체`
            }
            icon={yoyChange !== null ? trend.Icon : undefined}
            helperClassName={yoyChange !== null ? trend.className : 'text-muted-foreground'}
        />
    );
}

// 최근 월 배출량 및 전년 동월 대비 변화율 카드
function MonthlyEmissionsCard({
    latest,
    momYoyChange,
}: {
    latest: MonthlyTotal | undefined;
    momYoyChange: number | null;
}) {
    const trend = getTrendProps(momYoyChange);
    return (
        <MetricCard
            title="최근 월 배출량"
            tooltip="선택 연도의 마지막 월(최신 데이터) 배출량입니다. 변화율은 전년 같은 달 대비 증감률이며, 초록색은 감소(개선), 빨간색은 증가(악화)를 나타냅니다."
            value={
                latest ? (
                    <>
                        {formatEmissions(latest.total)}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">(tCO₂e)</span>
                    </>
                ) : '-'
            }
            helper={
                latest
                    ? momYoyChange !== null
                        ? `${trend.label} 전년 동월 대비 · ${formatYearMonth(latest.month)}`
                        : formatYearMonth(latest.month)
                    : '-'
            }
            icon={momYoyChange !== null ? trend.Icon : undefined}
            helperClassName={momYoyChange !== null ? trend.className : 'text-muted-foreground'}
        />
    );
}

// 감소 추세 회사 카드 — 개선 기업 수 초록색 강조
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
            helper={`${year}년 배출량 감소 기업`}
        />
    );
}

// 탄소세 예상 노출액 카드 — 리스크 페이지 진입점
function TaxExposureCard({ summary }: { summary: RiskSummary }) {
    return (
        <MetricCard
            title="탄소세 예상 노출액"
            tooltip="가정 세율(tCO₂e당 5만 원) 기반 시나리오 추정치입니다. 실제 과세액과 다를 수 있습니다. 클릭하면 회사별 리스크 상세 분석 페이지로 이동합니다."
            value={formatKrw(summary.totalTaxKrw)}
            helper={`고위험 ${summary.highRiskCount}개사 · 시나리오 기준`}
            icon={Banknote}
            helperClassName={summary.highRiskCount > 0 ? 'text-destructive' : 'text-muted-foreground'}
            href={ROUTES.risk}
        />
    );
}

type Props = {
    year: number;
    monthlyTotals: MonthlyTotal[];
    momChange: number | null;
    momYoyChange: number | null;
    improvingCount: number;
    totalCompanies: number;
    yoyChange: number | null;
    riskSummary: RiskSummary;
};

// KPI 카드 4종 조합 렌더링
export function KpiCards({ year, monthlyTotals, momYoyChange, improvingCount, totalCompanies, yoyChange, riskSummary }: Props) {
    const annualTotal = monthlyTotals.reduce((sum, m) => sum + m.total, 0);
    const latestMonth = monthlyTotals[monthlyTotals.length - 1];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnnualEmissionsCard total={annualTotal} year={year} yoyChange={yoyChange} />
            <MonthlyEmissionsCard latest={latestMonth} momYoyChange={momYoyChange} />
            <ImprovingCompaniesCard count={improvingCount} total={totalCompanies} year={year} />
            <TaxExposureCard summary={riskSummary} />
        </div>
    );
}
