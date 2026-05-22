'use client';

import { MetricYearlyComparisonChart } from '@/components/shared/metric-yearly-comparison-chart';
import type { AnnualTotal } from '@/lib/emissions';
import { GHG_EMISSIONS_UNIT, PCF_EMISSIONS_UNIT } from '@/lib/format';

type Props = {
    emissionsData: AnnualTotal[];
    pcfData: AnnualTotal[];
    selectedYear: number;
};

export function DashboardYearlyComparisonChart({ emissionsData, pcfData, selectedYear }: Props) {
    return (
        <MetricYearlyComparisonChart
            emissionsData={emissionsData}
            pcfData={pcfData}
            selectedYear={selectedYear}
            pcfText={{
                title: '연도별 총 PCF 추이',
                description: `전체 회사 합산 · 연도별 원본 활동 데이터 기반 PCF (${PCF_EMISSIONS_UNIT})`,
                helpText:
                    '연도별 PCF 산정값 합산 추이입니다. 제품 생산량 보정 없이 업로드된 활동 데이터 기준 합산값으로 해석합니다.',
                valueLabel: '총 PCF',
            }}
            emissionsText={{
                title: '연도별 총 배출량 추이',
                description: `전체 회사 합산 · 연도별 누적 온실가스 배출량 (${GHG_EMISSIONS_UNIT})`,
                helpText:
                    '전체 기업 합산 기준 연도별 배출량 추이입니다. 강조 표시된 막대가 현재 선택한 연도입니다.',
                valueLabel: '총 배출량',
            }}
        />
    );
}
