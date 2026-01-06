<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Créer les rôles et permissions selon le cahier des charges.
     */
    public function run(): void
    {
        // Créer les permissions
        $permissions = [
            // Produits
            ['name' => 'products.view', 'display_name' => 'Voir les produits', 'description' => 'Voir les produits', 'module' => 'products'],
            ['name' => 'products.create', 'display_name' => 'Créer des produits', 'description' => 'Créer des produits', 'module' => 'products'],
            ['name' => 'products.edit', 'display_name' => 'Modifier les produits', 'description' => 'Modifier les produits', 'module' => 'products'],
            ['name' => 'products.delete', 'display_name' => 'Supprimer les produits', 'description' => 'Supprimer les produits', 'module' => 'products'],
            
            // Stock
            ['name' => 'stock.view', 'display_name' => 'Voir le stock', 'description' => 'Voir le stock', 'module' => 'stock'],
            ['name' => 'stock.adjust', 'display_name' => 'Ajuster le stock', 'description' => 'Ajuster le stock', 'module' => 'stock'],
            ['name' => 'stock.transfer', 'display_name' => 'Transférer le stock', 'description' => 'Transférer le stock', 'module' => 'stock'],
            
            // Ventes
            ['name' => 'sales.view', 'display_name' => 'Voir les ventes', 'description' => 'Voir les ventes', 'module' => 'sales'],
            ['name' => 'sales.create', 'display_name' => 'Créer des ventes', 'description' => 'Créer des ventes (POS)', 'module' => 'sales'],
            ['name' => 'sales.void', 'display_name' => 'Annuler des ventes', 'description' => 'Annuler des ventes', 'module' => 'sales'],
            ['name' => 'sales.refund', 'display_name' => 'Remboursements', 'description' => 'Effectuer des remboursements', 'module' => 'sales'],
            
            // Achats
            ['name' => 'purchases.view', 'display_name' => 'Voir les achats', 'description' => 'Voir les achats', 'module' => 'purchases'],
            ['name' => 'purchases.create', 'display_name' => 'Créer des achats', 'description' => 'Créer des achats', 'module' => 'purchases'],
            ['name' => 'purchases.approve', 'display_name' => 'Approuver les achats', 'description' => 'Approuver les achats', 'module' => 'purchases'],
            
            // Clients
            ['name' => 'customers.view', 'display_name' => 'Voir les clients', 'description' => 'Voir les clients', 'module' => 'customers'],
            ['name' => 'customers.manage', 'display_name' => 'Gérer les clients', 'description' => 'Gérer les clients', 'module' => 'customers'],
            
            // Fournisseurs
            ['name' => 'suppliers.view', 'display_name' => 'Voir les fournisseurs', 'description' => 'Voir les fournisseurs', 'module' => 'suppliers'],
            ['name' => 'suppliers.manage', 'display_name' => 'Gérer les fournisseurs', 'description' => 'Gérer les fournisseurs', 'module' => 'suppliers'],
            
            // Entrepôts
            ['name' => 'warehouses.view', 'display_name' => 'Voir les entrepôts', 'description' => 'Voir les entrepôts', 'module' => 'warehouses'],
            ['name' => 'warehouses.manage', 'display_name' => 'Gérer les entrepôts', 'description' => 'Gérer les entrepôts', 'module' => 'warehouses'],
            
            // Rapports
            ['name' => 'reports.view', 'display_name' => 'Voir les rapports', 'description' => 'Voir les rapports', 'module' => 'reports'],
            ['name' => 'reports.export', 'display_name' => 'Exporter les rapports', 'description' => 'Exporter les rapports', 'module' => 'reports'],
            
            // Utilisateurs
            ['name' => 'users.view', 'display_name' => 'Voir les utilisateurs', 'description' => 'Voir les utilisateurs', 'module' => 'users'],
            ['name' => 'users.manage', 'display_name' => 'Gérer les utilisateurs', 'description' => 'Gérer les utilisateurs', 'module' => 'users'],
            
            // Paramètres
            ['name' => 'settings.view', 'display_name' => 'Voir les paramètres', 'description' => 'Voir les paramètres', 'module' => 'settings'],
            ['name' => 'settings.manage', 'display_name' => 'Gérer les paramètres', 'description' => 'Gérer les paramètres système', 'module' => 'settings'],
        ];

        foreach ($permissions as $permData) {
            Permission::firstOrCreate(
                ['name' => $permData['name']],
                [
                    'display_name' => $permData['display_name'],
                    'description' => $permData['description'],
                    'module' => $permData['module'],
                ]
            );
        }

        // Créer les rôles selon le cahier des charges
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrateur',
                'description' => 'Tous les droits sur le système',
                'permissions' => Permission::all()->pluck('name')->toArray(),
            ],
            [
                'name' => 'manager',
                'display_name' => 'Manager',
                'description' => 'Gestion complète sauf paramètres système',
                'permissions' => [
                    'products.view', 'products.create', 'products.edit', 'products.delete',
                    'stock.view', 'stock.adjust', 'stock.transfer',
                    'sales.view', 'sales.create', 'sales.void', 'sales.refund',
                    'purchases.view', 'purchases.create', 'purchases.approve',
                    'customers.view', 'customers.manage',
                    'suppliers.view', 'suppliers.manage',
                    'warehouses.view', 'warehouses.manage',
                    'reports.view', 'reports.export',
                    'users.view',
                ],
            ],
            [
                'name' => 'cashier',
                'display_name' => 'Caissier',
                'description' => 'Ventes uniquement',
                'permissions' => [
                    'products.view',
                    'stock.view',
                    'sales.view', 'sales.create',
                    'customers.view',
                ],
            ],
            [
                'name' => 'storekeeper',
                'display_name' => 'Magasinier',
                'description' => 'Stock uniquement',
                'permissions' => [
                    'products.view', 'products.create', 'products.edit',
                    'stock.view', 'stock.adjust', 'stock.transfer',
                    'warehouses.view',
                    'suppliers.view',
                    'purchases.view',
                ],
            ],
            [
                'name' => 'accountant',
                'display_name' => 'Comptable',
                'description' => 'Rapports et finances',
                'permissions' => [
                    'products.view',
                    'sales.view',
                    'purchases.view',
                    'customers.view',
                    'suppliers.view',
                    'reports.view', 'reports.export',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $role = Role::firstOrCreate(
                ['name' => $roleData['name']],
                [
                    'display_name' => $roleData['display_name'],
                    'description' => $roleData['description'],
                ]
            );

            // Attacher les permissions au rôle via DB::table pour gérer l'UUID
            $permissionIds = Permission::whereIn('name', $roleData['permissions'])->pluck('id');
            
            foreach ($permissionIds as $permissionId) {
                // Vérifier si la relation n'existe pas déjà
                $exists = DB::table('role_permissions')
                    ->where('role_id', $role->id)
                    ->where('permission_id', $permissionId)
                    ->exists();
                
                if (!$exists) {
                    DB::table('role_permissions')->insert([
                        'id' => Str::uuid()->toString(),
                        'role_id' => $role->id,
                        'permission_id' => $permissionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $this->command->info('Rôles et permissions créés avec succès!');
    }
}

