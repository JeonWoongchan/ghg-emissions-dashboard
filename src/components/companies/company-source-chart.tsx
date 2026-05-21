'use client';

// 배출원별 연간 총 배출량 바 차트 렌더링

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SCOPE_COLORS, SCOPE_LABELS, SOURCE_LABELS } from '@/constants/ghg-scope';
import { formatEmissions, formatCompanyName } from '@/lib/format';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type SourceItem = { source: string; total: number; scope: 1 | 2 | 3 };

type Props = {
    sources: SourceItem[];
};

// 배출원별 연간 총 배출량 수평 바 차트 렌더링
export function CompanySourceChart({ sources }: Props) {
    const data = sources.map((s) => ({
        ...s,
        label: SOURCE_LABELS[s.source] ?? s.source,
        fill: SCOPE_COLORS[s.scope],
    }));

    const chartHeight = Math.max(160, data.length * 36);

    return (
        <Card>
            <CardHeader>
                <CardTitle>배출원별 배출량</CardTitle>
                <CardDescription>
                    배출원 및 Scope 구분 · 2024년 연간 (tCO₂e)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Scope 색상 범례 */}
                <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {([1, 2, 3] as const).map((scope) => (
                        <span key={scope} className="flex items-center gap-1">
                            <span
                                className="inline-block size-2.5 rounded-sm"
                                style={{ backgroundColor: SCOPE_COLORS[scope] }}
                            />
                            {SCOPE_LABELS[scope]}
                        </span>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                    >
                        <XAxis
                            type="number"
                            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                        />
                        <YAxis
                            type="category"
                            dataKey="label"
                            width={70}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => formatCompanyName(v, 7)}
                        />
                        <Tooltip
                            formatter={(value) => [
                                typeof value === 'number'
                                    ? `${formatEmissions(value)} tCO₂e`
                                    : '-',
                                '배출량',
                            ]}
                            labelFormatter={(label) => {
                                const item = data.find((d) => d.label === label);
                                return item
                                    ? `${label} (${SCOPE_LABELS[item.scope]})`
                                    : label;
                            }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                fontSize: 12,
                            }}
                        />
                        <Bar dataKey="total" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
