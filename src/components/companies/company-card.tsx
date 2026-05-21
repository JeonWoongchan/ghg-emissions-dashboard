// 회사 카드 — 연간 배출량 및 GHG Scope 비중 시각화

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SCOPE_COLORS, SCOPE_DESCRIPTIONS } from '@/constants/ghg-scope';
import { ROUTES } from '@/constants/navigation';
import { getScopeBreakdown } from '@/lib/emissions';
import { formatEmissions } from '@/lib/format';
import type { CompanyWithTotal } from '@/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// 회사 배출 현황 카드 렌더링
export function CompanyCard({ company }: { company: CompanyWithTotal }) {
    const scopes = getScopeBreakdown(company.emissions);

    return (
        <Card className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{company.name}</h3>
                    <span className="shrink-0 text-sm text-muted-foreground">
                        {company.country}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
                {/* 연간 총 배출량 */}
                <div>
                    <p className="text-2xl font-bold">{formatEmissions(company.total)}</p>
                    <p className="text-xs text-muted-foreground">tCO₂e · 2024년 연간</p>
                </div>

                {/* GHG Scope 비중 스택 바 */}
                <div className="space-y-1.5">
                    <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                        {scopes.map(({ scope, pct }) => (
                            <div
                                key={scope}
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: SCOPE_COLORS[scope],
                                }}
                            />
                        ))}
                    </div>
                    {/* 각 레이블 너비를 해당 Scope 세그먼트 너비와 일치시켜 위치 정렬 */}
                    <div className="flex text-[10px] text-muted-foreground">
                        {scopes.map(({ scope, pct }) =>
                            pct > 0 ? (
                                <div
                                    key={scope}
                                    style={{ width: `${pct}%` }}
                                    className="text-center"
                                    title={SCOPE_DESCRIPTIONS[scope]}
                                >
                                    S{scope} {Math.round(pct)}%
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-t pt-3">
                <Link
                    href={ROUTES.companyDetail(company.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    상세 보기
                    <ArrowRight className="size-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}
