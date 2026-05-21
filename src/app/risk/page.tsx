import { RiskContent } from '@/components/risk/risk-content';
import { Suspense } from 'react';

export default function RiskPage() {
    return (
        <Suspense fallback={null}>
            <RiskContent />
        </Suspense>
    );
}
