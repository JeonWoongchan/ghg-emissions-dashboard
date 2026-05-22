'use client';

import { YearlyComparisonChart } from '@/components/shared/yearly-comparison-chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnnualTotal } from '@/lib/emissions';
import {
    formatEmissions,
    formatPcfEmissions,
    GHG_EMISSIONS_UNIT,
    PCF_EMISSIONS_UNIT,
} from '@/lib/format';
import { useState } from 'react';

type ChartMode = 'pcf' | 'emissions';

type ModeText = {
    title: string;
    description: string;
    helpText: string;
    valueLabel: string;
};

type Props = {
    emissionsData: AnnualTotal[];
    pcfData: AnnualTotal[];
    selectedYear: number;
    pcfText: ModeText;
    emissionsText: ModeText;
};

const MODE_FORMAT = {
    pcf: {
        unit: PCF_EMISSIONS_UNIT,
        formatValue: formatPcfEmissions,
    },
    emissions: {
        unit: GHG_EMISSIONS_UNIT,
        formatValue: formatEmissions,
    },
} satisfies Record<
    ChartMode,
    {
        unit: string;
        formatValue: (value: number) => string;
    }
>;

export function MetricYearlyComparisonChart({
    emissionsData,
    pcfData,
    selectedYear,
    pcfText,
    emissionsText,
}: Props) {
    const [mode, setMode] = useState<ChartMode>('pcf');
    const text = mode === 'pcf' ? pcfText : emissionsText;
    const format = MODE_FORMAT[mode];

    return (
        <Tabs value={mode} onValueChange={(value) => setMode(value as ChartMode)}>
            <YearlyComparisonChart
                data={mode === 'pcf' ? pcfData : emissionsData}
                selectedYear={selectedYear}
                title={text.title}
                description={text.description}
                helpText={text.helpText}
                valueLabel={text.valueLabel}
                unit={format.unit}
                formatValueAction={format.formatValue}
                action={
                    <TabsList>
                        <TabsTrigger value="pcf">PCF</TabsTrigger>
                        <TabsTrigger value="emissions">배출량</TabsTrigger>
                    </TabsList>
                }
            />
        </Tabs>
    );
}
