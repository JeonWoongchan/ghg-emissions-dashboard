'use client';

// 검색 가능한 공통 멀티 셀렉트 드롭다운

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

export type MultiSelectItem = { id: string; label: string };

type Props = {
    items: MultiSelectItem[];
    label: string;
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    isSelectedAction: (id: string) => boolean;
    isDisabledAction?: (id: string) => boolean;
    onToggleAction: (id: string) => void;
    searchPlaceholder?: string;
    width?: string;
    side?: 'bottom' | 'top' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
};

// 검색·다중 선택 가능한 Popover 드롭다운 렌더링
export function MultiSelectPopover({
    items,
    label,
    open,
    onOpenChangeAction,
    isSelectedAction,
    isDisabledAction,
    onToggleAction,
    searchPlaceholder = '검색...',
    width = 'w-56',
    side = 'bottom',
    align = 'start',
}: Props) {
    return (
        <Popover open={open} onOpenChange={onOpenChangeAction}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={`${width} justify-between`}>
                    <span className="truncate">{label}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`${width} p-0`} side={side} align={align}>
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>검색 결과 없음</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => {
                                const selected = isSelectedAction(item.id);
                                const disabled = isDisabledAction?.(item.id) ?? false;
                                return (
                                    <CommandItem
                                        key={item.id}
                                        value={item.label}
                                        onSelect={() => onToggleAction(item.id)}
                                        disabled={disabled}
                                        className={disabled ? 'opacity-40' : ''}
                                    >
                                        <Check
                                            className={`mr-2 size-4 ${selected ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                        {item.label}
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
