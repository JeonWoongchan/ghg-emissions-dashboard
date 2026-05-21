export const ROUTES = {
    dashboard: '/',
    companies: '/companies',
    risk: '/risk',
    companyDetail: (id: string) => `/companies/${id}`,
} as const;

// 경로별 페이지 타이틀 매핑
export const PAGE_TITLES: Record<string, string> = {
    [ROUTES.dashboard]: '대시보드',
    [ROUTES.companies]: '관리 대상 회사',
    [ROUTES.risk]: '리스크 관리',
};
