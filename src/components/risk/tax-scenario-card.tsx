// 탄소세 시나리오 가정 카드 렌더링

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CARBON_TAX_RATE_KRW_PER_TCO2E } from '@/constants/risk';
import { formatEmissions } from '@/lib/format';

export function TaxScenarioCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>탄소세 시나리오 가정</CardTitle>
                <CardDescription>
                    실제 세무·법률 자문이 아니라 제한된 과제 데이터 기반의 내부 판단용
                    시나리오입니다.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
                <div>
                    <p className="font-medium text-foreground">가정 세율</p>
                    <p>{formatEmissions(CARBON_TAX_RATE_KRW_PER_TCO2E)}원 / tCO₂e</p>
                </div>
                <div>
                    <p className="font-medium text-foreground">점수 산정</p>
                    <p>연간 배출량, 최근 3개월 증가율, Scope 구성을 종합합니다.</p>
                </div>
                <div>
                    <p className="font-medium text-foreground">활용 목적</p>
                    <p>규제 대응과 감축 조치가 필요한 관리 대상을 먼저 찾습니다.</p>
                </div>
            </CardContent>
        </Card>
    );
}
