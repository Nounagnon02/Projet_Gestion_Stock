<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    /**
     * Créer des données de démonstration.
     */
    public function run(): void
    {
        // Créer une entreprise principale
        $company = Company::firstOrCreate(
            ['email' => 'contact@smartstock.bj'],
            [
                'name' => 'SmartStock Pro',
                'phone' => '+229 21 00 00 00',
                'address' => 'Cotonou, Bénin',
                'settings' => json_encode([
                    'currency' => 'XOF',
                    'tax_rate' => 18.00,
                    'timezone' => 'Africa/Porto-Novo',
                ]),
                'is_active' => true,
            ]
        );

        $this->command->info("Entreprise créée: {$company->name}");

        // Créer un entrepôt principal
        $warehouse = Warehouse::firstOrCreate(
            ['code' => 'WH-MAIN'],
            [
                'name' => 'Entrepôt Principal',
                'company_id' => $company->id,
                'address' => '123 Rue du Commerce, Cotonou, Bénin',
                'phone' => '+229 21 00 00 01',
                'is_active' => true,
            ]
        );

        $this->command->info("Entrepôt créé: {$warehouse->name}");

        // Créer les catégories
        $categories = [
            ['name' => 'Boissons', 'slug' => 'boissons', 'description' => 'Boissons et rafraîchissements'],
            ['name' => 'Alimentation', 'slug' => 'alimentation', 'description' => 'Produits alimentaires'],
            ['name' => 'Hygiène', 'slug' => 'hygiene', 'description' => 'Produits d\'hygiène et soins'],
            ['name' => 'Électronique', 'slug' => 'electronique', 'description' => 'Appareils électroniques'],
            ['name' => 'Papeterie', 'slug' => 'papeterie', 'description' => 'Fournitures de bureau'],
        ];

        foreach ($categories as $catData) {
            Category::firstOrCreate(
                ['slug' => $catData['slug']],
                ['name' => $catData['name'], 'description' => $catData['description']]
            );
        }

        $this->command->info("Catégories créées: " . count($categories));

        // Créer des fournisseurs (avec supplier_code obligatoire)
        $suppliers = [
            [
                'supplier_code' => 'SUP-001',
                'name' => 'Fournisseur Boissons SARL',
                'email' => 'contact@boissons.bj',
                'phone' => '+229 21 11 11 11',
                'contact_person' => 'Jean Dossou',
                'address' => 'Zone Industrielle, Cotonou',
            ],
            [
                'supplier_code' => 'SUP-002',
                'name' => 'Grossiste Alimentation',
                'email' => 'info@grossiste-alim.bj',
                'phone' => '+229 21 22 22 22',
                'contact_person' => 'Marie Adou',
                'address' => 'Marché Dantokpa, Cotonou',
            ],
            [
                'supplier_code' => 'SUP-003',
                'name' => 'Hygiène Plus',
                'email' => 'ventes@hygieneplus.bj',
                'phone' => '+229 21 33 33 33',
                'contact_person' => 'Pierre Agossou',
                'address' => 'Akpakpa, Cotonou',
            ],
        ];

        foreach ($suppliers as $supData) {
            Supplier::firstOrCreate(
                ['supplier_code' => $supData['supplier_code']],
                $supData
            );
        }

        $this->command->info("Fournisseurs créés: " . count($suppliers));

        // Créer des clients (avec customer_code et type obligatoires)
        $customers = [
            [
                'customer_code' => 'CLI-001',
                'name' => 'Supermarché Central',
                'email' => 'achat@supermarche-central.bj',
                'phone' => '+229 90 11 11 11',
                'address' => 'Boulevard de France, Cotonou',
                'type' => 'company',
                'credit_limit' => 500000,
            ],
            [
                'customer_code' => 'CLI-002',
                'name' => 'Boutique du Coin',
                'email' => 'boutique.coin@gmail.com',
                'phone' => '+229 94 22 22 22',
                'address' => 'Quartier Cadjehoun',
                'type' => 'individual',
                'credit_limit' => 100000,
            ],
            [
                'customer_code' => 'CLI-003',
                'name' => 'Restaurant Chez Mama',
                'email' => 'chezmama@yahoo.fr',
                'phone' => '+229 96 33 33 33',
                'address' => 'Fidjrossé, Cotonou',
                'type' => 'company',
                'credit_limit' => 300000,
            ],
        ];

        foreach ($customers as $custData) {
            Customer::firstOrCreate(
                ['customer_code' => $custData['customer_code']],
                $custData
            );
        }

        $this->command->info("Clients créés: " . count($customers));

        // Créer des produits avec stock (champs alignés avec migration)
        $products = [
            // Boissons
            ['name' => 'Coca-Cola 50cl', 'sku' => 'COCA-50', 'price' => 300, 'cost_price' => 200, 'category' => 'Boissons', 'stock' => 100, 'min_stock' => 20],
            ['name' => 'Fanta Orange 50cl', 'sku' => 'FANTA-50', 'price' => 300, 'cost_price' => 200, 'category' => 'Boissons', 'stock' => 80, 'min_stock' => 15],
            ['name' => 'Eau Possotomè 1.5L', 'sku' => 'POSSO-150', 'price' => 350, 'cost_price' => 220, 'category' => 'Boissons', 'stock' => 200, 'min_stock' => 30],
            ['name' => 'Bière La Béninoise 65cl', 'sku' => 'BENIN-65', 'price' => 600, 'cost_price' => 400, 'category' => 'Boissons', 'stock' => 150, 'min_stock' => 20],
            
            // Alimentation
            ['name' => 'Riz Parfumé 5kg', 'sku' => 'RIZ-5KG', 'price' => 4500, 'cost_price' => 3500, 'category' => 'Alimentation', 'stock' => 50, 'min_stock' => 10],
            ['name' => 'Huile Palme 1L', 'sku' => 'HUILE-1L', 'price' => 1200, 'cost_price' => 900, 'category' => 'Alimentation', 'stock' => 60, 'min_stock' => 10],
            ['name' => 'Sucre 1kg', 'sku' => 'SUCRE-1KG', 'price' => 800, 'cost_price' => 600, 'category' => 'Alimentation', 'stock' => 5, 'min_stock' => 10], // Stock bas
            ['name' => 'Tomate Concentrée 400g', 'sku' => 'TOMATE-400', 'price' => 450, 'cost_price' => 300, 'category' => 'Alimentation', 'stock' => 0, 'min_stock' => 15], // Rupture
            
            // Hygiène
            ['name' => 'Savon Palmida', 'sku' => 'PALMIDA', 'price' => 250, 'cost_price' => 150, 'category' => 'Hygiène', 'stock' => 100, 'min_stock' => 20],
            ['name' => 'Dentifrice Colgate', 'sku' => 'COLGATE', 'price' => 800, 'cost_price' => 550, 'category' => 'Hygiène', 'stock' => 40, 'min_stock' => 10],
            ['name' => 'Détergent Omo 500g', 'sku' => 'OMO-500', 'price' => 1200, 'cost_price' => 850, 'category' => 'Hygiène', 'stock' => 30, 'min_stock' => 10],
            
            // Électronique
            ['name' => 'Pile AA (lot de 4)', 'sku' => 'PILE-AA4', 'price' => 1000, 'cost_price' => 600, 'category' => 'Électronique', 'stock' => 50, 'min_stock' => 10],
            ['name' => 'Ampoule LED 12W', 'sku' => 'LED-12W', 'price' => 1500, 'cost_price' => 900, 'category' => 'Électronique', 'stock' => 25, 'min_stock' => 5],
            
            // Papeterie
            ['name' => 'Cahier 200 pages', 'sku' => 'CAHIER-200', 'price' => 600, 'cost_price' => 400, 'category' => 'Papeterie', 'stock' => 80, 'min_stock' => 20],
            ['name' => 'Stylo Bic Bleu', 'sku' => 'BIC-BLEU', 'price' => 100, 'cost_price' => 50, 'category' => 'Papeterie', 'stock' => 200, 'min_stock' => 50],
        ];

        foreach ($products as $prodData) {
            $category = Category::where('name', $prodData['category'])->first();
            
            $product = Product::firstOrCreate(
                ['sku' => $prodData['sku']],
                [
                    'name' => $prodData['name'],
                    'price' => $prodData['price'],
                    'cost_price' => $prodData['cost_price'],
                    'category_id' => $category?->id,
                    'min_stock' => $prodData['min_stock'],
                    'description' => "Produit de démonstration: {$prodData['name']}",
                ]
            );

            // Créer le stock
            Stock::firstOrCreate(
                ['product_id' => $product->id, 'warehouse_id' => $warehouse->id],
                ['quantity' => $prodData['stock']]
            );
        }

        $this->command->info("Produits créés: " . count($products));
        $this->command->info("Données de démonstration générées avec succès!");
    }
}

