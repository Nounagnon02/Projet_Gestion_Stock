'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, AlertTriangle, Download } from 'lucide-react';

interface DashboardData {
    total_sales: number;
    sales_count: number;
    profit: number;
    low_stock_count: number;
    out_of_stock_count: number;
    total_stock_value: number;
    sales_trend: number;
}

interface SalesData {
    date: string;
    total: number;
    count: number;
}

interface CategoryData {
    category_name: string;
    revenue: number;
    percentage: number;
}

interface TopProduct {
    name: string;
    quantity_sold: number;
    revenue: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ReportsPage() {
    const [period, setPeriod] = useState('month');
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [salesByDay, setSalesByDay] = useState<SalesData[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [dashRes, salesRes, catRes, topRes] = await Promise.all([
                api.get('/reports/dashboard', { params: { period } }),
                api.get('/reports/sales', { params: { period } }),
                api.get('/reports/by-category', { params: { period } }),
                api.get('/reports/top-products', { params: { period, limit: 5 } })
            ]);

            setDashboardData(dashRes.data);
            setSalesByDay(salesRes.data.sales_by_day || []);
            setCategoryData(catRes.data.categories || []);
            setTopProducts(topRes.data.top_products || []);
        } catch (error) {
            console.error('Erreur lors du chargement des rapports', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">📊 Rapports & Statistiques</h1>
                    <p className="text-gray-500">Analyse de vos performances commerciales</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Aujourd'hui</SelectItem>
                            <SelectItem value="week">Cette semaine</SelectItem>
                            <SelectItem value="month">Ce mois</SelectItem>
                            <SelectItem value="year">Cette année</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" /> Exporter
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Chiffre d'Affaires</CardTitle>
                        <DollarSign className="h-5 w-5 text-blue-200" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(dashboardData?.total_sales || 0)}</div>
                        <div className="flex items-center text-sm text-blue-100 mt-1">
                            {(dashboardData?.sales_trend || 0) >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(dashboardData?.sales_trend || 0)}% vs période précédente
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData?.sales_count || 0}</div>
                        <p className="text-xs text-gray-500">Ventes réalisées</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-green-100">Bénéfice</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-200" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(dashboardData?.profit || 0)}</div>
                        <p className="text-xs text-green-100">Marge réalisée</p>
                    </CardContent>
                </Card>

                <Card className={`${(dashboardData?.out_of_stock_count || 0) > 0 ? 'border-red-200 bg-red-50' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Alertes Stock</CardTitle>
                        <AlertTriangle className={`h-5 w-5 ${(dashboardData?.out_of_stock_count || 0) > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{dashboardData?.low_stock_count || 0}</div>
                        <p className="text-xs text-gray-500">{dashboardData?.out_of_stock_count || 0} en rupture</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Sales Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>📈 Évolution des Ventes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {salesByDay.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesByDay}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                        />
                                        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(Number(value) || 0), 'Ventes']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Aucune donnée pour cette période
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Category Pie Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>🥧 Ventes par Catégorie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData as any[]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(props: any) => `${props.name || ''} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="revenue"
                                            nameKey="category_name"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Aucune donnée pour cette période
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products */}
            <Card>
                <CardHeader>
                    <CardTitle>🏆 Top 5 Produits les Plus Vendus</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        {topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                    <YAxis dataKey="name" type="category" width={150} />
                                    <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#3b82f6" name="Chiffre d'affaires" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                Aucune donnée pour cette période
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stock Value Info */}
            <Card>
                <CardHeader>
                    <CardTitle>📦 Valeur du Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-blue-600">
                                {formatCurrency(dashboardData?.total_stock_value || 0)}
                            </p>
                            <p className="text-gray-500">Valeur totale du stock en entrepôt</p>
                        </div>
                        <Package className="h-16 w-16 text-blue-200" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}




