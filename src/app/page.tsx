import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { Suspense } from 'react';

export default function DashboardPage() {
    return (
        <Suspense>
            <DashboardContent />
        </Suspense>
    );
}
