'use client';

// 월간 배출량 추이 차트 — 전체 합산 뷰 / 회사별 비교 뷰 탭 전환

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CHART_COLORS } from '@/constants/chart';
import { TOTAL_EMISSIONS_KEY } from '@/lib/emissions';
import {formatMonthShort, formatTooltipValue, formatYearMonth} from '@/lib/format';
import type { Company } from '@/types';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// 합산 탭에서 동시에 비교 가능한 최대 회사 수
const MAX_COMPARE = 5;
// nuqs URL 배열 상태 파서 — 두 탭 공통
const companyIdsParser = parseAsArrayOf(parseAsString).withDefault([]);

type Props = {
    data: Record<string, number | string>[];
    companies: Company[];
};

const tooltipStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 12,
};

const axisTickStyle = { fontSize: 12, fill: 'var(--muted-foreground)' };

// 공통 차트 축/그리드 설정
function ChartAxes() {
    return (
        <>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
                dataKey="month"
                tickFormatter={formatMonthShort}
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
            />
            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={44} />
            <Tooltip
                labelFormatter={(label) => (typeof label === 'string' ? formatYearMonth(label) : '')}
                formatter={formatTooltipValue}
                contentStyle={tooltipStyle}
            />
            <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                formatter={(v) => <span style={{ color: 'var(--foreground)' }}>{v}</span>}
            />
        </>
    );
}

type CompanyMultiSelectProps = {
    companies: Company[];
    label: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isSelected: (id: string) => boolean;
    isDisabled?: (id: string) => boolean;
    onToggle: (id: string) => void;
};

// 회사 검색·선택 가능한 공통 멀티 셀렉트 드롭다운
function CompanyMultiSelect({
    companies,
    label,
    open,
    onOpenChange,
    isSelected,
    isDisabled,
    onToggle,
}: CompanyMultiSelectProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                    <ChevronsUpDown className="size-3.5" />
                    {label}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
                <Command>
                    <CommandInput placeholder="회사 검색..." />
                    <CommandList>
                        <CommandEmpty>검색 결과 없음</CommandEmpty>
                        <CommandGroup>
                            {companies.map((company) => {
                                const selected = isSelected(company.id);
                                const disabled = isDisabled?.(company.id) ?? false;
                                return (
                                    <CommandItem
                                        key={company.id}
                                        value={company.name}
                                        onSelect={() => onToggle(company.id)}
                                        disabled={disabled}
                                        className={disabled ? 'opacity-40' : ''}
                                    >
                                        <Check
                                            className={`mr-2 size-4 ${selected ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                        {company.name}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

type CompanyBadgeListProps = {
    companies: Company[];
    onRemove: (id: string) => void;
    colorOffset?: number;
};

// 선택된 회사 목록을 색상 구분 뱃지로 렌더링
function CompanyBadgeList({ companies, onRemove, colorOffset = 0 }: CompanyBadgeListProps) {
    return (
        <>
            {companies.map((company, i) => (
                <Badge
                    key={company.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                    style={{
                        borderLeft: `3px solid ${CHART_COLORS[(i + colorOffset) % CHART_COLORS.length]}`,
                    }}
                >
                    {company.name}
                    <button
                        onClick={() => onRemove(company.id)}
                        className="ml-0.5 rounded hover:text-foreground"
                    >
                        <X className="size-3" />
                    </button>
                </Badge>
            ))}
        </>
    );
}

// 합산 탭 — 전체 라인 + 선택된 회사 비교 오버레이
function AggregateTab({ data, companies }: { data: Props['data']; companies: Company[] }) {
    const [selectedIds, setSelectedIds] = useQueryState('compareCompanies', companyIdsParser);
    const [open, setOpen] = useState(false);

    const selectedCompanies = companies.filter((c) => selectedIds.includes(c.id));
    const isMaxReached = selectedIds.length >= MAX_COMPARE;

    const toggleCompany = (id: string) => {
        if (selectedIds.includes(id)) {
            void setSelectedIds(selectedIds.filter((s) => s !== id));
        } else if (!isMaxReached) {
            void setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <CompanyMultiSelect
                    companies={companies}
                    label={isMaxReached ? `최대 ${MAX_COMPARE}개 선택됨` : '회사 비교 추가'}
                    open={open}
                    onOpenChange={setOpen}
                    isSelected={(id) => selectedIds.includes(id)}
                    isDisabled={(id) => !selectedIds.includes(id) && isMaxReached}
                    onToggle={toggleCompany}
                />
                <CompanyBadgeList
                    companies={selectedCompanies}
                    onRemove={toggleCompany}
                    colorOffset={1}
                />
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                    <ChartAxes />
                    {/* 항상 표시: 전체 합산 */}
                    <Line
                        type="monotone"
                        dataKey={TOTAL_EMISSIONS_KEY}
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                    {/* 선택된 회사 오버레이 — 점선으로 합산과 구분 */}
                    {selectedCompanies.map((company, i) => (
                        <Line
                            key={company.id}
                            type="monotone"
                            dataKey={company.name}
                            stroke={CHART_COLORS[(i + 1) % CHART_COLORS.length]}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// 비교 탭 — 필터 선택된 회사만 표시 (기본: 전체)
function ComparisonTab({ data, companies }: { data: Props['data']; companies: Company[] }) {
    const [filteredIds, setFilteredIds] = useQueryState('comparisonCompanies', companyIdsParser);
    const [open, setOpen] = useState(false);

    // filteredIds가 빈 배열 = 전체 모드 (모든 회사 표시 + 드롭다운 전체 체크)
    const isAllMode = filteredIds.length === 0;
    const visibleCompanies = isAllMode
        ? companies
        : companies.filter((c) => filteredIds.includes(c.id));

    const toggleCompany = (id: string) => {
        if (isAllMode) {
            // 전체 모드에서 하나 해제 → 나머지 전부를 명시적으로 선택
            void setFilteredIds(companies.filter((c) => c.id !== id).map((c) => c.id));
        } else if (filteredIds.includes(id)) {
            void setFilteredIds(filteredIds.filter((s) => s !== id));
        } else {
            const next = [...filteredIds, id];
            // 모든 회사가 선택되면 URL을 깔끔하게 전체 모드로 전환
            void setFilteredIds(next.length === companies.length ? [] : next);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <CompanyMultiSelect
                    companies={companies}
                    label={isAllMode ? '전체 표시 중' : `${filteredIds.length}개 선택됨`}
                    open={open}
                    onOpenChange={setOpen}
                    // 드롭다운 체크 여부 — 전체 모드이면 모든 항목이 체크 상태
                    isSelected={(id) => isAllMode || filteredIds.includes(id)}
                    onToggle={toggleCompany}
                />
                {!isAllMode && (
                    <CompanyBadgeList companies={visibleCompanies} onRemove={toggleCompany} />
                )}
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                    <ChartAxes />
                    {visibleCompanies.map((company, i) => (
                        <Line
                            key={company.id}
                            type="monotone"
                            dataKey={company.name}
                            stroke={CHART_COLORS[i % CHART_COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// 탭 전환 가능한 월간 배출량 추이 차트 렌더링
export function EmissionTrendChart({ data, companies }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>월간 배출량 추이</CardTitle>
                <CardDescription>2024년 월간 온실가스 배출량 (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="aggregate">
                    <TabsList className="mb-4">
                        <TabsTrigger value="aggregate">전체 합산</TabsTrigger>
                        <TabsTrigger value="comparison">회사별 비교</TabsTrigger>
                    </TabsList>
                    <TabsContent value="aggregate">
                        <AggregateTab data={data} companies={companies} />
                    </TabsContent>
                    <TabsContent value="comparison">
                        <ComparisonTab data={data} companies={companies} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
