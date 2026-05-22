'use client';

import { CardHeading } from '@/components/shared/card-heading';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CHART_AXIS_STYLE, CHART_TOOLTIP_STYLE } from '@/constants/chart';
import { SCOPE_COLORS, SCOPE_LABELS } from '@/constants/ghg-scope';
import {
    formatEmissions,
    formatMonthShort,
    formatPcfEmissions,
    formatYearMonth,
    GHG_EMISSIONS_UNIT,
    PCF_EMISSIONS_UNIT,
} from '@/lib/format';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type ChartMode = 'pcf' | 'emissions';
type ChartRow = Record<string, number | string>;

type ModeText = {
    title: string;
    description: string;
    helpText: string;
    emptyMessage: string;
};

type Props = {
    emissionsData: ChartRow[];
    pcfData: ChartRow[];
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

export function ScopeMonthlyTrendChart({ emissionsData, pcfData, pcfText, emissionsText }: Props) {
    const [mode, setMode] = useState<ChartMode>('pcf');
    const data = mode === 'pcf' ? pcfData : emissionsData;
    const text = mode === 'pcf' ? pcfText : emissionsText;
    const format = MODE_FORMAT[mode];

    return (
        <Tabs value={mode} onValueChange={(value) => setMode(value as ChartMode)}>
            <Card>
                <CardHeading
                    title={text.title}
                    tooltip={text.helpText}
                    description={text.description}
                    action={
                        <TabsList>
                            <TabsTrigger value="pcf">PCF</TabsTrigger>
                            <TabsTrigger value="emissions">배출량</TabsTrigger>
                        </TabsList>
                    }
                />
                <CardContent>
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart
                                data={data}
                                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={formatMonthShort}
                                    tick={CHART_AXIS_STYLE}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={CHART_AXIS_STYLE}
                                    axisLine={false}
                                    tickLine={false}
                                    width={44}
                                />
                                <Tooltip
                                    labelFormatter={(label) =>
                                        typeof label === 'string' ? formatYearMonth(label) : ''
                                    }
                                    formatter={(value, name) => [
                                        typeof value === 'number'
                                            ? `${format.formatValue(value)} ${format.unit}`
                                            : '-',
                                        String(name),
                                    ]}
                                    contentStyle={CHART_TOOLTIP_STYLE}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                                    formatter={(value) => (
                                        <span style={{ color: 'var(--foreground)' }}>{value}</span>
                                    )}
                                />
                                {([1, 2, 3] as const).map((scope) => (
                                    <Area
                                        key={scope}
                                        type="monotone"
                                        dataKey={SCOPE_LABELS[scope]}
                                        stackId="scope"
                                        fill={SCOPE_COLORS[scope]}
                                        stroke={SCOPE_COLORS[scope]}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState message={text.emptyMessage} />
                    )}
                </CardContent>
            </Card>
        </Tabs>
    );
}
