import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { TableHead } from '@/components/ui/table';
import type { SortDir } from '@/hooks/shared/useSort';
import { cn } from '@/lib/utils';

const ALIGN = {
    left: { head: '', flex: 'justify-start' },
    center: { head: 'text-center', flex: 'justify-center' },
    right: { head: 'text-right', flex: 'justify-end' },
} as const;

export type SortableHeadProps<K extends string> = {
    sortKey: K;
    currentKey: K | null;
    direction: SortDir;
    onSort: (key: K) => void;
    align?: keyof typeof ALIGN;
    className?: string;
    label?: string;
    extra?: ReactNode;
    children: ReactNode;
};

export function SortableHead<K extends string>({
    sortKey,
    currentKey,
    direction,
    onSort,
    align = 'left',
    className,
    label,
    extra,
    children,
}: SortableHeadProps<K>) {
    const isActive = currentKey === sortKey;
    const Icon = isActive ? (direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
    const { head, flex } = ALIGN[align];
    const ariaSort = isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none';
    const nextDirection = isActive && direction === 'asc' ? '내림차순' : '오름차순';
    const ariaLabel = label ? `${label} ${nextDirection} 정렬` : undefined;

    return (
        <TableHead scope="col" aria-sort={ariaSort} className={cn('py-3 pr-4', head, className)}>
            <span className={cn('inline-flex w-full items-center gap-1', flex)}>
                <button
                    type="button"
                    onClick={() => onSort(sortKey)}
                    aria-label={ariaLabel}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    {children}
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                </button>
                {extra}
            </span>
        </TableHead>
    );
}
