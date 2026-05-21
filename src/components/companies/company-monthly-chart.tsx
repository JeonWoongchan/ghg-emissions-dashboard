'use client';

// 회사 월별 Scope 1/2/3 스택 에어리어 차트 렌더링

import { InfoTooltip } from '@/components/shared/info-tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SCOPE_COLORS, SCOPE_LABELS } from '@/constants/ghg-scope';
import { formatMonthShort, formatTooltipValue, formatYearMonth } from '@/lib/format';
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

type Props = {
    data: Record<string, number | string>[];
    year: number;
};

const axisTickStyle = { fontSize: 12, fill: 'var(--muted-foreground)' };

// 월별 Scope 구성 스택 에어리어 차트 렌더링
export function CompanyMonthlyChart({ data, year }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    월별 배출량 추이
                    <InfoTooltip content="Scope 1·2·3을 구분해 월별 배출량 변화를 누적 에어리어 차트로 표시합니다. 특정 영역에 마우스를 올리면 해당 월의 Scope별 상세 수치를 확인할 수 있습니다." />
                </CardTitle>
                <CardDescription>Scope 구성 변화 · {year}년 월별 (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                            dataKey="month"
                            tickFormatter={formatMonthShort}
                            tick={axisTickStyle}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={44} />
                        <Tooltip
                            labelFormatter={(label) =>
                                typeof label === 'string' ? formatYearMonth(label) : ''
                            }
                            formatter={formatTooltipValue}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                fontSize: 12,
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                            formatter={(v) => (
                                <span style={{ color: 'var(--foreground)' }}>{v}</span>
                            )}
                        />
                        {/* Scope 1 → 2 → 3 순서로 쌓아 합산이 위로 갈수록 넓어지도록 */}
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
            </CardContent>
        </Card>
    );
}
