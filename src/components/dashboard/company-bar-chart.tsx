'use client';

// 연간 배출량 상위 5개 회사 비교 바 차트 렌더링

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CHART_COLORS } from '@/constants/chart';
import { ROUTES } from '@/constants/navigation';
import type { CompanyTotal } from '@/lib/emissions';
import { formatCompanyName, formatEmissions } from '@/lib/format';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// 대시보드에서 표시할 상위 회사 수
const TOP_N = 10;

type Props = {
    data: CompanyTotal[];
    year: number;
};

// 연간 배출량 상위 N개 회사 수평 바 차트 렌더링
export function CompanyBarChart({ data, year }: Props) {
    const topData = data.slice(0, TOP_N).map((entry, i) => ({
        ...entry,
        fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>연간 배출량 상위 {TOP_N}개 회사</CardTitle>
                <CardDescription>{year}년 누적 온실가스 배출량 기준 (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={topData}
                        layout="vertical"
                        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                    >
                        <XAxis
                            type="number"
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatCompanyName}
                        />
                        <Tooltip
                            formatter={(value) => [
                                typeof value === 'number'
                                    ? `${formatEmissions(value)} tCO₂e`
                                    : '-',
                                '연간 총 배출량',
                            ]}
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
            {/* 전체 회사 목록 페이지 링크 */}
            <CardFooter className="border-t pt-4">
                <Link
                    href={ROUTES.companies}
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    전체 회사 목록 보기
                    <ArrowRight className="size-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}
