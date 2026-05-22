import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { parseActivityExcel } from '@/lib/excel-import';
import { apiError } from '@/lib/server/api-response';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const companyId = formData.get('companyId');
        const newCompanyName = formData.get('newCompanyName');
        const newCompanyCountry = formData.get('newCompanyCountry');

        if (!(file instanceof File)) {
            return apiError('파일이 없습니다.', 400);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = parseActivityExcel(buffer);

        if (!result.ok) return apiError(result.error, 400);

        const existingCompanyId = typeof companyId === 'string' ? companyId.trim() : '';
        const trimmedCompanyName = typeof newCompanyName === 'string' ? newCompanyName.trim() : '';
        const trimmedCompanyCountry =
            typeof newCompanyCountry === 'string' ? newCompanyCountry.trim() : '';

        let targetCompanyId: string;
        let shouldCreateCompany = false;

        if (existingCompanyId) {
            targetCompanyId = existingCompanyId;
        } else if (trimmedCompanyName && trimmedCompanyCountry) {
            targetCompanyId = randomUUID();
            shouldCreateCompany = true;
        } else {
            return apiError('회사를 선택하거나 새 회사 정보를 입력해 주세요.', 400);
        }

        const fileName = file.name.trim();
        if (!fileName) return apiError('파일명이 비어 있습니다.', 400);

        await sql.transaction(
            (tx) => [
                ...(shouldCreateCompany
                    ? [
                          tx`
                              INSERT INTO companies (id, name, country_code)
                              VALUES (${targetCompanyId}, ${trimmedCompanyName}, ${trimmedCompanyCountry})
                          `,
                      ]
                    : []),
                tx`
                    DELETE FROM activity_records
                    WHERE company_id = ${targetCompanyId}
                      AND import_file_name = ${fileName}
                `,
                ...result.rows.map(
                    (row) => tx`
                        INSERT INTO activity_records (
                            company_id,
                            activity_date, year_month,
                            activity_type, description, quantity, unit,
                            source, scope,
                            emission_factor_kg, emissions_kg, emissions_tco2e,
                            import_file_name, import_row_number
                        ) VALUES (
                            ${targetCompanyId},
                            ${row.originalDate}, ${row.yearMonth},
                            ${row.activityType}, ${row.description}, ${row.quantity}, ${row.unit},
                            ${row.source}, ${row.scope},
                            ${row.emissionFactorKg}, ${row.emissionsKg}, ${row.emissions},
                            ${fileName}, ${row.rowNumber}
                        )
                    `
                ),
            ],
            { isolationLevel: 'Serializable' }
        );

        return NextResponse.json(
            { inserted: result.rows.length, companyId: targetCompanyId },
            { status: 201 }
        );
    } catch (error) {
        console.error('[/api/import]', error);
        return apiError('임포트에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
}
