export const ROUTES = {
    dashboard: '/',
    companies: '/companies',
    companyDetail: (id: string) => `/companies/${id}`,
} as const;

// 경로별 페이지 타이틀 매핑
export const PAGE_TITLES: Record<string, string> = {
    [ROUTES.dashboard]: '대시보드',
    [ROUTES.companies]: '회사 목록',
};
