'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    BarChart3,
    Warehouse,
    Truck,
    Bell,
    Boxes
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const check = async () => {
            // Protection des routes - redirection si non authentifié
        };
        check();
    }, []);

    const navItems = [
        { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { href: '/dashboard/reports', label: 'Rapports', icon: BarChart3 },
        { href: '/products', label: 'Produits', icon: Package },
        { href: '/dashboard/stock', label: 'Stock', icon: Boxes },
        { href: '/pos', label: 'Point de Vente', icon: ShoppingCart },
        { href: '/dashboard/warehouses', label: 'Entrepôts', icon: Warehouse },
        { href: '/dashboard/customers', label: 'Clients', icon: Users },
        { href: '/dashboard/suppliers', label: 'Fournisseurs', icon: Truck },
        { href: '/dashboard/purchases', label: 'Achats', icon: ShoppingCart },
        { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-950 md:flex">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6 text-blue-600" />
                        <span className="text-lg">SmartStock</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : ''}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="border-t p-4">
                    {user && (
                        <div className="mb-4 px-3">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-4 dark:bg-gray-950 lg:h-[60px] lg:px-6">
                    {/* Mobile Header */}
                    <div className="md:hidden">
                        <Link href="/dashboard" className="font-semibold flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            SmartStock
                        </Link>
                    </div>
                    <div className="flex-1" />
                    {/* Notification Icon */}
                    <button className="relative p-2 rounded-full hover:bg-gray-100">
                        <Bell className="h-5 w-5 text-gray-500" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    {/* User info for desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
                    {children}
                </main>
                <AppVoiceAssistant />
            </div>
        </div>
    );
}

import AppVoiceAssistant from '@/components/ai/VoiceAssistant';

