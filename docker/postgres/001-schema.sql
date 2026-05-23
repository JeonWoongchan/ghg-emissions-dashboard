CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS countries (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country_code TEXT NOT NULL REFERENCES countries(code)
);

CREATE TABLE IF NOT EXISTS ghg_emissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT NOT NULL REFERENCES companies(id),
    year_month TEXT NOT NULL,
    source TEXT NOT NULL,
    emissions NUMERIC NOT NULL,
    UNIQUE (company_id, year_month, source)
);

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    resource_uid TEXT NOT NULL,
    date_time TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    scope SMALLINT NOT NULL CHECK (scope IN (1, 2, 3)),
    unit TEXT NOT NULL,
    factor_kg NUMERIC NOT NULL CHECK (factor_kg >= 0),
    version TEXT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (activity_type, description, unit, version)
);

CREATE TABLE IF NOT EXISTS activity_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    emission_factor_id UUID REFERENCES emission_factors(id),
    activity_date DATE NOT NULL,
    year_month TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC NOT NULL CHECK (quantity >= 0),
    unit TEXT NOT NULL,
    source TEXT NOT NULL,
    scope SMALLINT NOT NULL CHECK (scope IN (1, 2, 3)),
    emission_factor_kg NUMERIC NOT NULL CHECK (emission_factor_kg >= 0),
    emissions_kg NUMERIC NOT NULL CHECK (emissions_kg >= 0),
    emissions_tco2e NUMERIC NOT NULL CHECK (emissions_tco2e >= 0),
    import_file_name TEXT,
    import_row_number INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (company_id, import_file_name, import_row_number)
);

CREATE INDEX IF NOT EXISTS activity_records_company_id_idx
    ON activity_records(company_id);

CREATE INDEX IF NOT EXISTS activity_records_company_year_month_idx
    ON activity_records(company_id, year_month);

CREATE INDEX IF NOT EXISTS activity_records_company_source_idx
    ON activity_records(company_id, source);

CREATE INDEX IF NOT EXISTS emission_factors_lookup_idx
    ON emission_factors(activity_type, description, unit, valid_from, valid_to);

CREATE UNIQUE INDEX IF NOT EXISTS emission_factors_current_unique_idx
    ON emission_factors(activity_type, description, unit)
    WHERE valid_to IS NULL;
