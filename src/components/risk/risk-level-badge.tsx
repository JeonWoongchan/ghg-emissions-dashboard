// 리스크 등급 뱃지 렌더링

import { Badge } from '@/components/ui/badge';
import { RISK_LEVEL_CLASS_NAMES, RISK_LEVEL_LABELS } from '@/constants/risk';
import type { RiskLevel } from '@/lib/risk';

// 리스크 등급별 의미 색상 표시
export function RiskLevelBadge({ level }: { level: RiskLevel }) {
    return (
        <Badge variant="outline" className={RISK_LEVEL_CLASS_NAMES[level]}>
            {RISK_LEVEL_LABELS[level]}
        </Badge>
    );
}
