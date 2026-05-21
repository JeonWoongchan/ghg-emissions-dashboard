import { RiskContent } from '@/components/risk/risk-content';
import { Suspense } from 'react';

// nuqs의 useQueryState가 Suspense 경계를 요구함
export default function RiskPage() {
    return (
        <Suspense>
            <RiskContent />
        </Suspense>
    );
}
