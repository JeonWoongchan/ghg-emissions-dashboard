// Recharts에 전달할 차트 색상 — globals.css chart 토큰 순서와 동일
export const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
] as const;

// Recharts 축 레이블 공통 스타일
export const CHART_AXIS_STYLE = {
    fontSize: 12,
    fill: 'var(--muted-foreground)',
} as const;

// Recharts 툴팁 공통 스타일
export const CHART_TOOLTIP_STYLE = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 12,
} as const;
