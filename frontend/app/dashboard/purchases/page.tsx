'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, ShoppingCart, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Purchase {
    id: string;
    purchase_number: string;
    supplier: { name: string };
    warehouse: { name: string };
    total_amount: number;
    status: 'pending' | 'ordered' | 'received' | 'cancelled';
    expected_date: string;
    created_at: string;
}

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        supplier_id: '',
        warehouse_id: '',
        status: 'pending',
        items: [{ product_id: '', quantity: 1, unit_cost: 0 }]
    });

    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
        fetchWarehouses();
        fetchProducts();
    }, [search]);

    const fetchPurchases = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/purchases', { params: { search } });
            setPurchases(response.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des achats', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        const res = await api.get('/suppliers');
        setSuppliers(res.data.data || []);
    };

    const fetchWarehouses = async () => {
        const res = await api.get('/warehouses');
        setWarehouses(res.data.data || []);
    };

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data.data || []);
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { product_id: '', quantity: 1, unit_cost: 0 }]
        });
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/purchases', formData);
            toast.success('Achat créé avec succès');
            setIsDialogOpen(false);
            fetchPurchases();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.patch(`/purchases/${id}/status`, { status });
            toast.success('Statut mis à jour');
            fetchPurchases();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            pending: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'En attente' },
            ordered: { color: 'bg-blue-100 text-blue-800', icon: ShoppingCart, label: 'Commandé' },
            received: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Reçu' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Annulé' },
        };
        const { color, icon: Icon, label } = config[status] || config.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${color}`}>
                <Icon className="h-3 w-3" />
                {label}
            </span>
        );
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">🛒 Gestion des Achats</h1>
                    <p className="text-gray-500">Approvisionnement et commandes fournisseurs</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Nouvel Achat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Créer une commande d'achat</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Fournisseur</Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, supplier_id: v })}>
                                        <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Entrepôt de réception</Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, warehouse_id: v })}>
                                        <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Produits</Label>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-2 items-end">
                                        <div className="col-span-2">
                                            <Select onValueChange={(v) => handleUpdateItem(index, 'product_id', v)}>
                                                <SelectTrigger><SelectValue placeholder="Produit" /></SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Input
                                            type="number"
                                            placeholder="Qté"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Coût"
                                            value={item.unit_cost}
                                            onChange={(e) => handleUpdateItem(index, 'unit_cost', parseFloat(e.target.value))}
                                        />
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="mt-2">
                                    <Plus className="h-3 w-3 mr-1" /> Ajouter une ligne
                                </Button>
                            </div>

                            <DialogFooter>
                                <Button type="submit">Enregistrer la commande</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher par numéro de commande ou fournisseur..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead>Entrepôt</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell></TableRow>
                            ) : purchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">{purchase.purchase_number}</TableCell>
                                    <TableCell>{purchase.supplier?.name}</TableCell>
                                    <TableCell>{purchase.warehouse?.name}</TableCell>
                                    <TableCell className="font-bold">{formatCurrency(purchase.total_amount)}</TableCell>
                                    <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {purchase.status !== 'received' && purchase.status !== 'cancelled' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-200"
                                                    onClick={() => handleStatusUpdate(purchase.id, 'received')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Reçu
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
