// 회사 카드 — 연간 배출량 및 GHG Scope 비중 시각화

import { RiskLevelBadge } from '@/components/risk/risk-level-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SCOPE_COLORS } from '@/constants/ghg-scope';
import { ROUTES } from '@/constants/navigation';
import { getScopeBreakdown } from '@/lib/emissions';
import { formatEmissions } from '@/lib/format';
import type { RiskAssessment } from '@/lib/risk';
import type { CompanyWithTotal } from '@/types';
import Link from 'next/link';

// 회사 배출 현황 카드 렌더링
export function CompanyCard({
    company,
    year,
    riskAssessment,
}: {
    company: CompanyWithTotal;
    year: number;
    riskAssessment?: RiskAssessment;
}) {
    const scopes = getScopeBreakdown(company.emissions);

    return (
        <Link href={ROUTES.companyDetail(company.id)} className="block">
            <Card className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        {/* 회사명 + 국가 코드 */}
                        <div className="min-w-0">
                            <h3 className="font-semibold leading-tight truncate">{company.name}</h3>
                            <p className="text-xs text-muted-foreground">{company.country}</p>
                        </div>
                        {/* 리스크 뱃지 우측 상단 고정 */}
                        {riskAssessment && (
                            <div className="shrink-0">
                                <RiskLevelBadge level={riskAssessment.level} />
                            </div>
                        )}
                    </div>
                    {riskAssessment && (
                        <p className="text-xs text-muted-foreground">
                            리스크 점수{' '}
                            <span className="font-medium text-foreground">{riskAssessment.score}점</span>
                        </p>
                    )}
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                    {/* 연간 총 배출량 */}
                    <div>
                        <p className="text-2xl font-bold">{formatEmissions(company.total)}</p>
                        <p className="text-xs text-muted-foreground">tCO₂e · {year}년 연간</p>
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
                        {/* Scope 레이블 — 색상 점으로 바와 연동, 고정 크기로 가독성 확보 */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {scopes.map(({ scope, pct }) =>
                                pct > 0 ? (
                                    <span
                                        key={scope}
                                        className="flex items-center gap-1 text-xs text-muted-foreground"
                                    >
                                        <span
                                            className="size-2 shrink-0 rounded-sm"
                                            style={{ backgroundColor: SCOPE_COLORS[scope] }}
                                        />
                                        S{scope} {Math.round(pct)}%
                                    </span>
                                ) : null
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
