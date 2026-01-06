'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, AlertTriangle, CreditCard, TrendingUp, TrendingDown, ArrowRight, ShoppingCart, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
    total_sales: number;
    sales_count: number;
    profit: number;
    low_stock_count: number;
    out_of_stock_count: number;
    total_stock_value: number;
    sales_trend: number;
}

interface StockAlert {
    id: number;
    product_name: string;
    quantity: number;
    alert_threshold: number;
}

interface SaleData {
    date: string;
    total: number;
}

export default function DashboardPage() {
    const { user, checkAuth } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
    const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
    const [salesData, setSalesData] = useState<SaleData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [dashboardRes, alertsRes, salesRes, aiRes] = await Promise.all([
                api.get('/reports/dashboard', { params: { period: 'today' } }),
                api.get('/stock/alerts'),
                api.get('/reports/sales', { params: { period: 'week' } }),
                api.get('/ai/recommendations')
            ]);

            setStats(dashboardRes.data);
            setStockAlerts(alertsRes.data?.slice(0, 5) || []);
            setSalesData(salesRes.data?.sales_by_day || []);
            setAiRecommendations(aiRes.data?.recommendations || []);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
            // Fallback data for demo
            setStats({
                total_sales: 0,
                sales_count: 0,
                profit: 0,
                low_stock_count: 0,
                out_of_stock_count: 0,
                total_stock_value: 0,
                sales_trend: 0,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bonjour';
        if (hour < 18) return 'Bon après-midi';
        return 'Bonsoir';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getGreeting()}, {user?.name || 'Utilisateur'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Voici un aperçu de votre activité aujourd'hui
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <Link href="/pos">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <ShoppingCart className="h-4 w-4 mr-2" /> Nouvelle Vente
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Ventes du Jour</CardTitle>
                        <DollarSign className="h-5 w-5 text-blue-200" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : formatCurrency(stats?.total_sales || 0)}
                        </div>
                        <div className="flex items-center text-sm text-blue-100 mt-1">
                            {(stats?.sales_trend || 0) >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(stats?.sales_trend || 0)}% vs hier
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Transactions</CardTitle>
                        <CreditCard className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {isLoading ? '...' : stats?.sales_count || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Ventes réalisées</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-green-100">Bénéfice</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-200" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : formatCurrency(stats?.profit || 0)}
                        </div>
                        <p className="text-xs text-green-100 mt-1">Marge réalisée</p>
                    </CardContent>
                </Card>

                <Card className={`border-0 shadow-lg ${(stats?.out_of_stock_count || 0) > 0 ? 'bg-red-50 border-red-200' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Alertes Stock</CardTitle>
                        <AlertTriangle className={`h-5 w-5 ${(stats?.out_of_stock_count || 0) > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${(stats?.low_stock_count || 0) > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {isLoading ? '...' : stats?.low_stock_count || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats?.out_of_stock_count || 0} en rupture
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Alerts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Sales Chart */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">📈 Évolution des Ventes (7 jours)</CardTitle>
                        <Link href="/dashboard/reports">
                            <Button variant="ghost" size="sm">
                                Voir plus <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            {salesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { weekday: 'short' })}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(Number(value) || 0), 'Ventes']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                                        />
                                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                    <p className="text-gray-400">Aucune donnée de ventes disponible</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            Suggestions IA (Réappro)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {aiRecommendations.length > 0 ? (
                                aiRecommendations.map((rec, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-white border border-indigo-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-sm text-indigo-900">{rec.name}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${rec.risk_level === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                Risque {rec.risk_level === 'high' ? 'Élevé' : 'Moyen'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-indigo-700">
                                            <span>Prévu sous {rec.days_remaining}j</span>
                                            <span className="font-bold">Commander {rec.suggested_quantity}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-8 w-8 text-indigo-200 mx-auto mb-2" />
                                    <p className="text-indigo-400 text-xs">Données insuffisantes pour l'IA</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">🚀 Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/pos" className="block">
                            <div className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-center cursor-pointer">
                                <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="font-medium text-blue-700">Nouvelle Vente</p>
                            </div>
                        </Link>
                        <Link href="/products" className="block">
                            <div className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-center cursor-pointer">
                                <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <p className="font-medium text-green-700">Ajouter Produit</p>
                            </div>
                        </Link>
                        <Link href="/dashboard/reports" className="block">
                            <div className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-center cursor-pointer">
                                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <p className="font-medium text-purple-700">Voir Rapports</p>
                            </div>
                        </Link>
                        <Link href="/dashboard/stock" className="block">
                            <div className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors text-center cursor-pointer">
                                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                <p className="font-medium text-orange-700">Gérer Stock</p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

