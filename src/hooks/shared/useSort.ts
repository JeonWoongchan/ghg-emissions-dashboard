'use client';

import { useState } from 'react';

export type SortDir = 'asc' | 'desc';

export type SortState<K extends string> = {
    sortKey: K | null;
    sortDir: SortDir;
};

export type SortComparator<T> = (a: T, b: T, direction: SortDir) => number;
export type SortComparators<T, K extends string> = Record<K, SortComparator<T>>;

type UseSortOptions<K extends string> = {
    initialKey?: K | null;
    initialDirection?: SortDir;
};

export function compareByDirection(result: number, direction: SortDir): number {
    return direction === 'asc' ? result : -result;
}

export function compareNullableNumber(
    a: number | null,
    b: number | null,
    direction: SortDir
): number {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return compareByDirection(a - b, direction);
}

export function sortByState<T, K extends string>(
    items: readonly T[],
    state: SortState<K>,
    comparators: SortComparators<T, K>
): T[] {
    const { sortKey, sortDir } = state;
    if (!sortKey) return [...items];

    const compare = comparators[sortKey];
    return [...items].sort((a, b) => compare(a, b, sortDir));
}

export function useSort<K extends string>({
    initialKey = null,
    initialDirection = 'desc',
}: UseSortOptions<K> = {}) {
    const [sortKey, setSortKey] = useState<K | null>(initialKey);
    const [sortDir, setSortDir] = useState<SortDir>(initialDirection);

    function handleSort(key: K) {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir(initialDirection);
        }
    }

    function getSortProps(key: K) {
        return {
            sortKey: key,
            currentKey: sortKey,
            direction: sortDir,
            onSort: handleSort,
        };
    }

    return { sortKey, sortDir, handleSort, getSortProps };
}
