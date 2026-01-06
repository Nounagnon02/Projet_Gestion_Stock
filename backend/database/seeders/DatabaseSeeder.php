<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Appeler les seeders dans l'ordre
        $this->call([
            RoleSeeder::class,
            DemoDataSeeder::class,
        ]);

        // Créer l'utilisateur admin par défaut
        $adminRole = Role::where('name', 'admin')->first();
        
        $admin = User::firstOrCreate(
            ['email' => 'admin@stockpro.com'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole?->id,
            ]
        );

        // Créer un caissier de test
        $cashierRole = Role::where('name', 'cashier')->first();
        
        User::firstOrCreate(
            ['email' => 'caisse@stockpro.com'],
            [
                'name' => 'Caissier Test',
                'password' => Hash::make('password123'),
                'role_id' => $cashierRole?->id,
            ]
        );

        // Créer un magasinier de test
        $storekeeperRole = Role::where('name', 'storekeeper')->first();
        
        User::firstOrCreate(
            ['email' => 'stock@stockpro.com'],
            [
                'name' => 'Magasinier Test',
                'password' => Hash::make('password123'),
                'role_id' => $storekeeperRole?->id,
            ]
        );

        $this->command->info('Utilisateurs de test créés:');
        $this->command->info('  - Admin: admin@stockpro.com / password123');
        $this->command->info('  - Caissier: caisse@stockpro.com / password123');
        $this->command->info('  - Magasinier: stock@stockpro.com / password123');
    }
}
