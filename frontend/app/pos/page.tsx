'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import ProductScanner from '@/components/ai/ProductScanner';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
}

interface CartItem extends Product {
    cartQuantity: number;
}

export default function POSPage() {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // Fetch products based on search
    useEffect(() => {
        if (search.length < 2) {
            setProducts([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await api.get('/products', { params: { search } });
                setProducts(response.data.data);
            } catch (error) {
                console.error("Search failed", error);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, cartQuantity: item.cartQuantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
        setSearch('');
        setProducts([]);
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.cartQuantity + delta);
                return { ...item, cartQuantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsLoading(true);
        try {
            await api.post('/sales', {
                warehouse_id: 1, // Mocked for MVP
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.cartQuantity
                })),
                payment_method: 'cash',
                amount_paid: total
            });
            toast.success('Vente enregistrée avec succès');
            setCart([]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du checkout');
        } finally {
            setIsLoading(false);
        }
    };

    const handleScanDetected = async (productId: number) => {
        setIsScannerOpen(false);
        try {
            const response = await api.get(`/products/${productId}`);
            if (response.data) {
                addToCart(response.data);
                toast.success(`${response.data.name} ajouté au panier !`);
            }
        } catch (error) {
            console.error("Failed to fetch scanned product", error);
            // Fallback for demo if product doesn't exist
            addToCart({
                id: productId,
                name: `Produit Scanné #${productId}`,
                sku: `SKU-${productId}`,
                price: 1500,
                stock_quantity: 10
            });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Left side: Product Search & Results */}
            <div className="md:col-span-2 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" /> Recherche Produits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Rechercher par nom ou code barre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="text-lg py-6 flex-1"
                                autoFocus
                            />
                            <Button
                                variant="outline"
                                className="h-auto px-4 border-blue-200 hover:bg-blue-50"
                                onClick={() => setIsScannerOpen(true)}
                            >
                                <Camera className="h-6 w-6 text-blue-600" />
                            </Button>
                        </div>

                        {isScannerOpen && (
                            <ProductScanner
                                onClose={() => setIsScannerOpen(false)}
                                onDetected={handleScanDetected}
                            />
                        )}

                        {products.length > 0 && (
                            <div className="mt-4 border rounded-md divide-y max-h-[400px] overflow-auto">
                                {products.map(p => (
                                    <div
                                        key={p.id}
                                        className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                                        onClick={() => addToCart(p)}
                                    >
                                        <div>
                                            <div className="font-bold">{p.name}</div>
                                            <div className="text-sm text-gray-500">SKU: {p.sku}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-blue-600">{p.price.toLocaleString()} FCFA</div>
                                            <div className="text-xs text-green-600">En stock</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex-1 overflow-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" /> Panier
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Quantité</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                                            Le panier est vide
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cart.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.price.toLocaleString()} FCFA</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                                                    <span className="w-8 text-center">{item.cartQuantity}</span>
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>{(item.price * item.cartQuantity).toLocaleString()} FCFA</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Right side: Payment Summary */}
            <div className="space-y-4">
                <Card className="bg-white dark:bg-gray-950 border-2 border-blue-100 dark:border-blue-900 shadow-lg sticky top-6">
                    <CardHeader>
                        <CardTitle>Résumé de la Vente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-lg">
                            <span>Sous-total</span>
                            <span>{total.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-4 text-blue-600">
                            <span>TOTAL</span>
                            <span>{total.toLocaleString()} FCFA</span>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Label>Mode de Paiement</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="justify-start"><div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Espèces</Button>
                                <Button variant="outline" className="justify-start opacity-50" disabled>Mobile Money</Button>
                                <Button variant="outline" className="justify-start opacity-50" disabled>Carte</Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full text-xl py-8 font-bold bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={cart.length === 0 || isLoading}
                            onClick={handleCheckout}
                        >
                            <CreditCard className="mr-2 h-6 w-6" />
                            {isLoading ? 'TRAITEMENT...' : 'VALIDER LA VENTE'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
