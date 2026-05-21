'use client';
// 사이드바 내비게이션 메뉴 렌더링 및 활성 경로 표시

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/navigation';
import { Building2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { title: '대시보드', href: ROUTES.dashboard, icon: LayoutDashboard },
    { title: '회사 목록', href: ROUTES.companies, icon: Building2 },
];

// 현재 경로와 메뉴 href를 비교하여 활성 여부 반환
function isActiveRoute(pathname: string, href: string): boolean {
    if (href === ROUTES.dashboard) return pathname === ROUTES.dashboard;
    return pathname.startsWith(href);
}

// 내비게이션 메뉴 아이템 목록 렌더링
export function SidebarNav() {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {NAV_ITEMS.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActiveRoute(pathname, item.href)}
                                tooltip={item.title}
                                className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
