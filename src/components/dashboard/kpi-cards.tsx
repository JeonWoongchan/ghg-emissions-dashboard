// 대시보드 상단 KPI 요약 카드 4종 렌더링

import { MetricCard } from '@/components/shared/metric-card';
import { ROUTES } from '@/constants/navigation';
import type { CompanyTotal, MonthlyTotal } from '@/lib/emissions';
import type { RiskSummary } from '@/lib/risk';
import { formatEmissions, formatKrw, formatYearMonth, getTrendProps } from '@/lib/format';
import { Banknote, Building2 } from 'lucide-react';

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
            tooltip="선택 연도 기준 누적 배출량이 가장 많은 관리 대상 회사입니다. 클릭하면 해당 기업 상세 페이지로 이동합니다."
            value={company?.name ?? '-'}
            helper={company ? `${formatEmissions(company.total)} tCO₂e / 연간` : '-'}
            icon={Building2}
            valueClassName="truncate"
            href={company ? ROUTES.companyDetail(company.id) : undefined}
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
    totalByCompany: CompanyTotal[];
    riskSummary: RiskSummary;
};

// KPI 카드 4종 조합 렌더링
export function KpiCards({ year, monthlyTotals, momChange, totalByCompany, riskSummary }: Props) {
    const annualTotal = monthlyTotals.reduce((sum, m) => sum + m.total, 0);
    const latestMonth = monthlyTotals[monthlyTotals.length - 1];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnnualEmissionsCard total={annualTotal} year={year} />
            <MonthlyEmissionsCard latest={latestMonth} momChange={momChange} />
            <TopEmitterCard company={totalByCompany[0]} />
            <TaxExposureCard summary={riskSummary} />
        </div>
    );
}
