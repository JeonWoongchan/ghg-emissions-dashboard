'use client';

import { ScopeMonthlyTrendChart } from '@/components/shared/scope-monthly-trend-chart';
import { GHG_EMISSIONS_UNIT, PCF_EMISSIONS_UNIT } from '@/lib/format';

type Props = {
    emissionsData: Record<string, number | string>[];
    pcfData: Record<string, number | string>[];
    year: number;
};

export function CompanyMonthlyChart({ emissionsData, pcfData, year }: Props) {
    return (
        <ScopeMonthlyTrendChart
            emissionsData={emissionsData}
            pcfData={pcfData}
            pcfText={{
                title: '월별 PCF 추이',
                description: `Scope 구성별 PCF 변화 · ${year}년 월별 (${PCF_EMISSIONS_UNIT})`,
                helpText:
                    '원본 활동 데이터에서 계산한 PCF를 Scope 1·2·3 기준으로 월별 누적 영역 차트에 표시합니다.',
                emptyMessage: `${year}년 PCF 활동 데이터가 없습니다.`,
            }}
            emissionsText={{
                title: '월별 배출량 추이',
                description: `Scope 구성별 배출량 변화 · ${year}년 월별 (${GHG_EMISSIONS_UNIT})`,
                helpText: 'Scope 1·2·3으로 구분한 월별 배출량 변화를 누적 영역 차트로 표시합니다.',
                emptyMessage: `${year}년 배출량 데이터가 없습니다.`,
            }}
        />
    );
}
