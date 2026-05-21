'use client';

// 연도 선택 드롭다운

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    years: number[];
    value: number;
    onChangeAction: (year: number) => void;
};

// 연도 선택 셀렉트 렌더링
export function YearSelector({ years, value, onChangeAction }: Props) {
    return (
        <Select value={String(value)} onValueChange={(v) => onChangeAction(parseInt(v, 10))}>
            <SelectTrigger className="w-28">
                <SelectValue />
            </SelectTrigger>
            <SelectContent side="bottom">
                {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                        {year}년
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
