import { sql } from '@/lib/db';
import { apiError } from '@/lib/server/api-response';
import type { ActivityRecord } from '@/types';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ACTIVITY_RECORDS_ERROR_MESSAGE = '활동 데이터를 불러오지 못했습니다.';
const INVALID_COMPANY_ID_MESSAGE = '회사 ID가 필요합니다.';

type ActivityRecordRow = {
    id: string;
    company_id: string;
    activity_date: Date | string;
    year_month: string;
    activity_type: string;
    description: string;
    quantity: string | number;
    unit: string;
    source: string;
    scope: number;
    emission_factor_kg: string | number;
    emissions_kg: string | number;
    emissions_tco2e: string | number;
    import_file_name: string | null;
    import_row_number: number | null;
    created_at: Date | string;
};

function normalizeDate(value: Date | string): string {
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return value.slice(0, 10);
}

function normalizeDateTime(value: Date | string): string {
    if (value instanceof Date) {
        return value.toISOString();
    }

    return value;
}

function normalizeNumber(value: string | number, fieldName: string): number {
    const normalized = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(normalized)) {
        throw new Error(`Invalid activity record number: ${fieldName}`);
    }

    return normalized;
}

function normalizeScope(value: number): ActivityRecord['scope'] {
    if (value === 1 || value === 2 || value === 3) {
        return value;
    }

    throw new Error(`Invalid activity record scope: ${value}`);
}

function rowToRecord(row: ActivityRecordRow): ActivityRecord {
    return {
        id: row.id,
        companyId: row.company_id,
        activityDate: normalizeDate(row.activity_date),
        yearMonth: row.year_month,
        activityType: row.activity_type,
        description: row.description,
        quantity: normalizeNumber(row.quantity, 'quantity'),
        unit: row.unit,
        source: row.source,
        scope: normalizeScope(row.scope),
        emissionFactorKg: normalizeNumber(row.emission_factor_kg, 'emission_factor_kg'),
        emissionsKg: normalizeNumber(row.emissions_kg, 'emissions_kg'),
        emissionsTco2e: normalizeNumber(row.emissions_tco2e, 'emissions_tco2e'),
        importFileName: row.import_file_name,
        importRowNumber: row.import_row_number,
        createdAt: normalizeDateTime(row.created_at),
    };
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ companyId: string }> }
) {
    try {
        const { companyId } = await params;
        const normalizedCompanyId = companyId.trim();

        if (!normalizedCompanyId) {
            return apiError(INVALID_COMPANY_ID_MESSAGE, 400);
        }

        const rows = await sql`
            SELECT
                id, company_id,
                activity_date, year_month,
                activity_type, description, quantity, unit,
                source, scope,
                emission_factor_kg, emissions_kg, emissions_tco2e,
                import_file_name, import_row_number,
                created_at
            FROM activity_records
            WHERE company_id = ${normalizedCompanyId}
            ORDER BY activity_date ASC, activity_type ASC, import_row_number ASC
        `;

        return NextResponse.json((rows as ActivityRecordRow[]).map(rowToRecord));
    } catch (error) {
        console.error(ACTIVITY_RECORDS_ERROR_MESSAGE, error);
        return apiError(ACTIVITY_RECORDS_ERROR_MESSAGE);
    }
}
