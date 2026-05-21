'use client';

// 회사 GHG Scope 1/2/3 연간 배출량 비중 차트 렌더링

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SCOPE_COLORS, SCOPE_DESCRIPTIONS, SCOPE_LABELS } from '@/constants/ghg-scope';
import { formatEmissions } from '@/lib/format';
import type { ScopeBreakdownItem } from '@/lib/emissions';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
    scopes: ScopeBreakdownItem[];
    totalEmissions: number;
};

type ScopeChartData = {
    scope: string;
    total: number;
    pct: number;
    fill: string;
};

// Scope 1/2/3 연간 배출량 수평 바 차트 렌더링
export function CompanyScopeChart({ scopes, totalEmissions }: Props) {
    const data: ScopeChartData[] = scopes
        .filter(({ pct }) => pct > 0)
        .map(({ scope, pct }) => ({
            scope: SCOPE_LABELS[scope],
            total: Math.round((pct / 100) * totalEmissions),
            pct,
            fill: SCOPE_COLORS[scope],
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Scope 구분 배출량</CardTitle>
                <CardDescription>GHG Protocol 기준 직접·간접 배출 구분 (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="scope"
                            width={60}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={(value) => [
                                typeof value === 'number'
                                    ? `${formatEmissions(value)} tCO₂e`
                                    : '-',
                                '배출량',
                            ]}
                            labelFormatter={(label) => {
                                const scope = Object.entries(SCOPE_LABELS).find(([, v]) => v === label)?.[0];
                                return scope ? SCOPE_DESCRIPTIONS[Number(scope) as 1 | 2 | 3] : label;
                            }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                fontSize: 12,
                            }}
                        />
                        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                            <LabelList
                                dataKey="pct"
                                position="right"
                                formatter={(v: unknown) =>
                                    typeof v === 'number' ? `${v.toFixed(0)}%` : ''
                                }
                                style={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
