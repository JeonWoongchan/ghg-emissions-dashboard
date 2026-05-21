// 리스크 등급 뱃지 렌더링

import { Badge } from '@/components/ui/badge';
import { RISK_LEVEL_LABELS } from '@/constants/risk';
import type { RiskLevel } from '@/lib/risk';

const RISK_LEVEL_CLASS_NAMES: Record<RiskLevel, string> = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-accent text-accent-foreground border-border',
    low: 'bg-secondary text-secondary-foreground border-border',
};

// 리스크 등급별 의미 색상 표시
export function RiskLevelBadge({ level }: { level: RiskLevel }) {
    return (
        <Badge variant="outline" className={RISK_LEVEL_CLASS_NAMES[level]}>
            {RISK_LEVEL_LABELS[level]}
        </Badge>
    );
}
