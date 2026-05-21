type Props = {
    params: Promise<{ id: string }>;
};

export default async function CompanyDetailPage({ params }: Props) {
    const { id } = await params;

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">회사 상세</h2>
            <p className="text-muted-foreground">ID: {id}</p>
        </div>
    );
}
