'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User, Bell, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Company settings
    const [companySettings, setCompanySettings] = useState({
        company_name: 'SmartStock Pro',
        address: '',
        phone: '',
        email: '',
        tax_id: '',
        currency: 'FCFA',
    });

    // User profile
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        low_stock_email: true,
        low_stock_app: true,
        daily_report: false,
        sales_alerts: true,
    });

    useEffect(() => {
        if (user) {
            setProfile({
                ...profile,
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleSaveCompany = async () => {
        setIsLoading(true);
        try {
            // Simulation - À connecter à une vraie API
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Paramètres entreprise sauvegardés');
        } catch (error) {
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            // Validation basique
            if (profile.new_password && profile.new_password !== profile.new_password_confirmation) {
                toast.error('Les mots de passe ne correspondent pas');
                return;
            }

            // Simulation - À connecter à une vraie API
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profil mis à jour');
            setProfile({
                ...profile,
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Préférences de notifications sauvegardées');
        } catch (error) {
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">⚙️ Paramètres</h1>
                <p className="text-gray-500">Configurez votre application</p>
            </div>

            <Tabs defaultValue="company" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="company" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Entreprise
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Profil
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Sécurité
                    </TabsTrigger>
                </TabsList>

                {/* Company Settings */}
                <TabsContent value="company">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de l'entreprise</CardTitle>
                            <CardDescription>Ces informations apparaissent sur vos factures et tickets</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                                    <Input
                                        id="company_name"
                                        value={companySettings.company_name}
                                        onChange={(e) => setCompanySettings({ ...companySettings, company_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tax_id">Numéro fiscal (IFU)</Label>
                                    <Input
                                        id="tax_id"
                                        value={companySettings.tax_id}
                                        onChange={(e) => setCompanySettings({ ...companySettings, tax_id: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_address">Adresse</Label>
                                <Input
                                    id="company_address"
                                    value={companySettings.address}
                                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_phone">Téléphone</Label>
                                    <Input
                                        id="company_phone"
                                        value={companySettings.phone}
                                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_email">Email</Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={companySettings.email}
                                        onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveCompany} disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Profile Settings */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mon Profil</CardTitle>
                            <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="profile_name">Nom complet</Label>
                                    <Input
                                        id="profile_name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profile_email">Email</Label>
                                    <Input
                                        id="profile_email"
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-medium mb-4">Changer le mot de passe</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Mot de passe actuel</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={profile.current_password}
                                            onChange={(e) => setProfile({ ...profile, current_password: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new_password">Nouveau mot de passe</Label>
                                            <Input
                                                id="new_password"
                                                type="password"
                                                value={profile.new_password}
                                                onChange={(e) => setProfile({ ...profile, new_password: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm_password">Confirmer</Label>
                                            <Input
                                                id="confirm_password"
                                                type="password"
                                                value={profile.new_password_confirmation}
                                                onChange={(e) => setProfile({ ...profile, new_password_confirmation: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleSaveProfile} disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Sauvegarde...' : 'Mettre à jour le profil'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Préférences de notifications</CardTitle>
                            <CardDescription>Choisissez comment recevoir les alertes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Alertes de stock bas</p>
                                        <p className="text-sm text-gray-500">Recevoir une notification quand un produit atteint le seuil d'alerte</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.low_stock_app}
                                                onChange={(e) => setNotifications({ ...notifications, low_stock_app: e.target.checked })}
                                                className="h-4 w-4"
                                            />
                                            App
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.low_stock_email}
                                                onChange={(e) => setNotifications({ ...notifications, low_stock_email: e.target.checked })}
                                                className="h-4 w-4"
                                            />
                                            Email
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Alertes de ventes importantes</p>
                                        <p className="text-sm text-gray-500">Notification pour les ventes au-dessus d'un certain montant</p>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.sales_alerts}
                                            onChange={(e) => setNotifications({ ...notifications, sales_alerts: e.target.checked })}
                                            className="h-4 w-4"
                                        />
                                        Activer
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Rapport journalier</p>
                                        <p className="text-sm text-gray-500">Recevoir un résumé quotidien par email</p>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.daily_report}
                                            onChange={(e) => setNotifications({ ...notifications, daily_report: e.target.checked })}
                                            className="h-4 w-4"
                                        />
                                        Activer
                                    </label>
                                </div>
                            </div>

                            <Button onClick={handleSaveNotifications} disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sécurité</CardTitle>
                            <CardDescription>Gérez la sécurité de votre compte</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                                <h3 className="font-medium text-yellow-800">Double authentification (2FA)</h3>
                                <p className="text-sm text-yellow-700 mt-1">La double authentification sera disponible dans une prochaine mise à jour.</p>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Sessions actives</h3>
                                <p className="text-sm text-gray-500 mt-1">Vous êtes actuellement connecté sur cet appareil.</p>
                                <div className="mt-4 p-3 bg-gray-50 rounded flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Session actuelle</p>
                                        <p className="text-sm text-gray-500">Connecté maintenant</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Actif</span>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg border-red-200">
                                <h3 className="font-medium text-red-600">Zone dangereuse</h3>
                                <p className="text-sm text-gray-500 mt-1">Actions irréversibles</p>
                                <Button variant="destructive" className="mt-4" disabled>
                                    Supprimer mon compte
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
