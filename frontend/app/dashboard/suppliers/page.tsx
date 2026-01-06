'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    contact_person: string;
    payment_terms: string;
    balance: number;
    products_count: number;
    created_at: string;
}

interface SupplierStats {
    total_products: number;
    total_purchases: number;
    purchase_count: number;
    pending_payments: number;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierStats, setSupplierStats] = useState<SupplierStats | null>(null);
    const [supplierProducts, setSupplierProducts] = useState<any[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        contact_person: '',
        payment_terms: '',
        notes: '',
    });

    useEffect(() => {
        fetchSuppliers();
    }, [search]);

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/suppliers', { params: { search } });
            setSuppliers(response.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des fournisseurs', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await api.put(`/suppliers/${editingSupplier.id}`, formData);
                toast.success('Fournisseur mis à jour');
            } else {
                await api.post('/suppliers', formData);
                toast.success('Fournisseur créé');
            }
            setIsDialogOpen(false);
            resetForm();
            fetchSuppliers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
            contact_person: supplier.contact_person || '',
            payment_terms: supplier.payment_terms || '',
            notes: '',
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) return;
        try {
            await api.delete(`/suppliers/${id}`);
            toast.success('Fournisseur supprimé');
            fetchSuppliers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleViewDetails = async (supplier: Supplier) => {
        try {
            const [detailsRes, productsRes] = await Promise.all([
                api.get(`/suppliers/${supplier.id}`),
                api.get(`/suppliers/${supplier.id}/products`)
            ]);
            setSelectedSupplier(detailsRes.data.supplier);
            setSupplierStats(detailsRes.data.stats);
            setSupplierProducts(productsRes.data.data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des détails');
        }
    };

    const resetForm = () => {
        setEditingSupplier(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            contact_person: '',
            payment_terms: '',
            notes: '',
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
                    <h1 className="text-2xl font-bold">🏭 Gestion des Fournisseurs</h1>
                    <p className="text-gray-500">Gérez vos partenaires d'approvisionnement</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Nouveau Fournisseur
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de l'entreprise *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_person">Personne de contact</Label>
                                <Input
                                    id="contact_person"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
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
                                <Label htmlFor="payment_terms">Conditions de paiement</Label>
                                <Input
                                    id="payment_terms"
                                    placeholder="Ex: Net 30 jours"
                                    value={formData.payment_terms}
                                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit">
                                    {editingSupplier ? 'Mettre à jour' : 'Créer'}
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
                            placeholder="Rechercher par nom, email ou contact..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Supplier Details Panel */}
            {selectedSupplier && supplierStats && (
                <Card className="border-green-200 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Détails de {selectedSupplier.name}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedSupplier(null); setSupplierProducts([]); }}>✕</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Produits Fournis</p>
                                <p className="text-xl font-bold">{supplierStats.total_products}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Achats</p>
                                <p className="text-xl font-bold">{formatCurrency(supplierStats.total_purchases)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nombre de Commandes</p>
                                <p className="text-xl font-bold">{supplierStats.purchase_count}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Paiements en Attente</p>
                                <p className="text-xl font-bold text-orange-600">{formatCurrency(supplierStats.pending_payments)}</p>
                            </div>
                        </div>

                        {supplierProducts.length > 0 && (
                            <div>
                                <p className="font-medium mb-2">Produits de ce fournisseur:</p>
                                <div className="flex flex-wrap gap-2">
                                    {supplierProducts.slice(0, 10).map((product: any) => (
                                        <span key={product.id} className="px-2 py-1 bg-white rounded border text-sm">
                                            {product.name}
                                        </span>
                                    ))}
                                    {supplierProducts.length > 10 && (
                                        <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                                            +{supplierProducts.length - 10} autres
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Suppliers Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Personne</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        Chargement...
                                    </TableCell>
                                </TableRow>
                            ) : suppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                                        Aucun fournisseur trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>
                                            <div className="font-medium">{supplier.name}</div>
                                            {supplier.address && <div className="text-sm text-gray-500">{supplier.address}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {supplier.email && <div>{supplier.email}</div>}
                                                {supplier.phone && <div className="text-gray-500">{supplier.phone}</div>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{supplier.contact_person || '-'}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                {supplier.products_count || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(supplier)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(supplier.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
