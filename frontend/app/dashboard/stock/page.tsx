'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, History, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function StockPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [movements, setMovements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [adjustment, setAdjustment] = useState({
        product_id: '',
        warehouse_id: '1',
        quantity: '',
        type: 'in',
        reason: ''
    });

    const fetchData = async () => {
        try {
            const [prodRes, moveRes] = await Promise.all([
                api.get('/products'),
                // api.get('/stock/movements') // I should probably add this route in backend
                Promise.resolve({ data: [] }) // Placeholder
            ]);
            setProducts(prodRes.data.data);
            // setMovements(moveRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/stock/adjust', {
                ...adjustment,
                quantity: parseInt(adjustment.quantity)
            });
            toast.success('Stock ajusté avec succès');
            setAdjustment({ ...adjustment, product_id: '', quantity: '', reason: '' });
            fetchData();
        } catch (error) {
            toast.error('Erreur lors de l\'ajustement');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Gestion des Stocks</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Adjustment Form */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" /> Ajustement Manuel
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdjust} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Produit</Label>
                                <Select onValueChange={(val) => setAdjustment({ ...adjustment, product_id: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un produit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.name} ({p.sku})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Type d'opération</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        variant={adjustment.type === 'in' ? 'default' : 'outline'}
                                        className="w-full"
                                        onClick={() => setAdjustment({ ...adjustment, type: 'in' })}
                                    >
                                        <ArrowUpRight className="mr-2 h-4 w-4" /> ENTRÉE
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={adjustment.type === 'out' ? 'destructive' : 'outline'}
                                        className="w-full"
                                        onClick={() => setAdjustment({ ...adjustment, type: 'out' })}
                                    >
                                        <ArrowDownLeft className="mr-2 h-4 w-4" /> SORTIE
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Quantité</Label>
                                <Input
                                    type="number"
                                    placeholder="Ex: 50"
                                    value={adjustment.quantity}
                                    onChange={(e) => setAdjustment({ ...adjustment, quantity: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Raison / Commentaire</Label>
                                <Input
                                    placeholder="Ex: Arrivée fournisseur"
                                    value={adjustment.reason}
                                    onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Validation...' : 'Valider l\'ajustement'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Movements History (Placeholder Card) */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" /> Historique des mouvements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Quantité</TableHead>
                                    <TableHead>Raison</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                                        Chargement de l'historique...
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
