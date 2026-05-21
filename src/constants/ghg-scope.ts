export const SCOPE_MAP: Record<string, 1 | 2 | 3> = {
  // Scope 1 — 직접 배출 (내부 연소)
  gasoline: 1,
  diesel: 1,
  lpg: 1,
  naturalGas: 1,
  // Scope 2 — 간접 배출 (구매 전기·열)
  electricity: 2,
  heat: 2,
  steam: 2,
  // Scope 3 — 가치사슬 배출 (공급망·운송)
  shipping: 3,
  businessTravel: 3,
  waste: 3,
};

export const SCOPE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Scope 1',
  2: 'Scope 2',
  3: 'Scope 3',
};

export const SCOPE_DESCRIPTIONS: Record<1 | 2 | 3, string> = {
  1: '직접 배출',
  2: '간접 배출 (전기·열)',
  3: '가치사슬 배출',
};

// Scope별 차트 색상 — globals.css chart 토큰에서 의미 기반 배정
export const SCOPE_COLORS: Record<1 | 2 | 3, string> = {
  1: 'var(--chart-3)',  // amber — 직접 연소
  2: 'var(--chart-2)',  // blue  — 전기·열
  3: 'var(--chart-5)',  // purple — 공급망·운송
};
