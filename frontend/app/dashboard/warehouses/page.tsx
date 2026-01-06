'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Warehouse as WarehouseIcon, Package, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Warehouse {
    id: number;
    name: string;
    address: string;
    phone: string;
    is_active: boolean;
    created_at: string;
}

interface WarehouseStats {
    total_products: number;
    total_value: number;
    low_stock_count: number;
}

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [warehouseStats, setWarehouseStats] = useState<WarehouseStats | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        is_active: true,
    });

    useEffect(() => {
        fetchWarehouses();
    }, [search]);

    const fetchWarehouses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/warehouses', { params: { search } });
            setWarehouses(response.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des entrepôts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingWarehouse) {
                await api.put(`/warehouses/${editingWarehouse.id}`, formData);
                toast.success('Entrepôt mis à jour');
            } else {
                await api.post('/warehouses', formData);
                toast.success('Entrepôt créé');
            }
            setIsDialogOpen(false);
            resetForm();
            fetchWarehouses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setFormData({
            name: warehouse.name,
            address: warehouse.address || '',
            phone: warehouse.phone || '',
            is_active: warehouse.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer cet entrepôt ?')) return;
        try {
            await api.delete(`/warehouses/${id}`);
            toast.success('Entrepôt supprimé');
            fetchWarehouses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleViewDetails = async (warehouse: Warehouse) => {
        try {
            const response = await api.get(`/warehouses/${warehouse.id}`);
            setSelectedWarehouse(response.data.warehouse);
            setWarehouseStats(response.data.stats);
        } catch (error) {
            toast.error('Erreur lors du chargement des détails');
        }
    };

    const resetForm = () => {
        setEditingWarehouse(null);
        setFormData({
            name: '',
            address: '',
            phone: '',
            is_active: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">🏢 Gestion des Entrepôts</h1>
                    <p className="text-gray-500">Gérez vos lieux de stockage</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Nouvel Entrepôt
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingWarehouse ? 'Modifier l\'entrepôt' : 'Nouvel entrepôt'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de l'entrepôt *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="is_active">Entrepôt actif</Label>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit">
                                    {editingWarehouse ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher par nom ou adresse..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Warehouse Details Panel */}
            {selectedWarehouse && warehouseStats && (
                <Card className="border-purple-200 bg-purple-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <WarehouseIcon className="h-5 w-5" />
                            {selectedWarehouse.name}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedWarehouse(null)}>✕</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Produits en Stock</p>
                                <p className="text-xl font-bold">{warehouseStats.total_products}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Valeur Totale</p>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(warehouseStats.total_value)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Alertes Stock</p>
                                <p className="text-xl font-bold text-red-600">{warehouseStats.low_stock_count}</p>
                            </div>
                        </div>
                        {selectedWarehouse.address && (
                            <div className="mt-4 flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                {selectedWarehouse.address}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Warehouses Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full text-center py-10">Chargement...</div>
                ) : warehouses.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-400">
                        Aucun entrepôt trouvé
                    </div>
                ) : (
                    warehouses.map((warehouse) => (
                        <Card key={warehouse.id} className={`cursor-pointer transition-all hover:shadow-md ${!warehouse.is_active ? 'opacity-60' : ''}`}>
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="flex items-center gap-2">
                                    <WarehouseIcon className="h-5 w-5 text-blue-500" />
                                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${warehouse.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {warehouse.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {warehouse.address && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="h-4 w-4" />
                                        {warehouse.address}
                                    </div>
                                )}
                                {warehouse.phone && (
                                    <p className="text-sm text-gray-500">{warehouse.phone}</p>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(warehouse)}>
                                        Voir détails
                                    </Button>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(warehouse)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(warehouse.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
