import { CompanyDetailContent } from '@/components/companies/company-detail-content';
import { Suspense } from 'react';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function CompanyDetailPage({ params }: Props) {
    const { id } = await params;

    return (
        <Suspense>
            <CompanyDetailContent id={id} />
        </Suspense>
    );
}
