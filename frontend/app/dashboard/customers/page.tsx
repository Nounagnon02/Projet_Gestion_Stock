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
import { Plus, Search, Edit, Trash2, Eye, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    category: 'regular' | 'vip' | 'wholesale';
    balance: number;
    loyalty_points: number;
    created_at: string;
}

interface CustomerStats {
    total_purchases: number;
    purchase_count: number;
    average_basket: number;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        category: 'regular',
        credit_limit: 0,
    });

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/customers', { params: { search } });
            setCustomers(response.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des clients', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.id}`, formData);
                toast.success('Client mis à jour');
            } else {
                await api.post('/customers', formData);
                toast.success('Client créé');
            }
            setIsDialogOpen(false);
            resetForm();
            fetchCustomers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            category: customer.category || 'regular',
            credit_limit: 0,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer ce client ?')) return;
        try {
            await api.delete(`/customers/${id}`);
            toast.success('Client supprimé');
            fetchCustomers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleViewDetails = async (customer: Customer) => {
        try {
            const response = await api.get(`/customers/${customer.id}`);
            setSelectedCustomer(response.data.customer);
            setCustomerStats(response.data.stats);
        } catch (error) {
            toast.error('Erreur lors du chargement des détails');
        }
    };

    const resetForm = () => {
        setEditingCustomer(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            category: 'regular',
            credit_limit: 0,
        });
    };

    const getCategoryBadge = (category: string) => {
        const styles: Record<string, string> = {
            regular: 'bg-gray-100 text-gray-800',
            vip: 'bg-yellow-100 text-yellow-800',
            wholesale: 'bg-blue-100 text-blue-800',
        };
        const labels: Record<string, string> = {
            regular: 'Régulier',
            vip: 'VIP',
            wholesale: 'Grossiste',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category] || styles.regular}`}>
                {labels[category] || category}
            </span>
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">👥 Gestion des Clients</h1>
                    <p className="text-gray-500">Gérez votre base de clients</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Nouveau Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCustomer ? 'Modifier le client' : 'Nouveau client'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom *</Label>
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
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Catégorie</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="regular">Régulier</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                        <SelectItem value="wholesale">Grossiste</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit">
                                    {editingCustomer ? 'Mettre à jour' : 'Créer'}
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
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customer Details Panel */}
            {selectedCustomer && customerStats && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Détails de {selectedCustomer.name}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>✕</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Achats</p>
                                <p className="text-xl font-bold">{formatCurrency(customerStats.total_purchases)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nombre de Commandes</p>
                                <p className="text-xl font-bold">{customerStats.purchase_count}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Panier Moyen</p>
                                <p className="text-xl font-bold">{formatCurrency(customerStats.average_basket)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Points Fidélité</p>
                                <p className="text-xl font-bold">{selectedCustomer.loyalty_points || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Customers Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Solde</TableHead>
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
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                                        Aucun client trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {customer.email && <div>{customer.email}</div>}
                                                {customer.phone && <div className="text-gray-500">{customer.phone}</div>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getCategoryBadge(customer.category)}</TableCell>
                                        <TableCell className={customer.balance < 0 ? 'text-red-600' : ''}>
                                            {formatCurrency(customer.balance || 0)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(customer)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(customer.id)}>
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
