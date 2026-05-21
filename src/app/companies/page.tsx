import { CompaniesContent } from '@/components/companies/companies-content';
import { Suspense } from 'react';

export default function CompaniesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">회사 목록</h2>
                <p className="text-muted-foreground">등록된 회사별 배출 현황</p>
            </div>
            <Suspense>
                <CompaniesContent />
            </Suspense>
        </div>
    );
}
