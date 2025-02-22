"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Package, Users, MapPin, BarChart, Settings } from "lucide-react";
import Link from "next/link";

interface MenuItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

export default function MenuBar() {

    const menuItems: MenuItem[] = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Orders", href: "/orders", icon: Package },
        { name: "Drivers", href: "/drivers", icon: Users },
        { name: "Tracking", href: "/tracking", icon: MapPin },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <h1 className="text-xl font-bold p-4">Dynamits Admin</h1>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <Link href={item.href} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 hover:text-white transition">
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter className="p-4">
                        <p className="text-sm text-gray-400">© 2025 Dynamits</p>
                    </SidebarFooter>
                </Sidebar>
                <SidebarTrigger />
            </SidebarProvider>
        </>
    )
}
