# 🗄️ Architecture de Base de Données - Système de Gestion de Stock

## 📋 Vue d'ensemble

Ce système de gestion de stock utilise une architecture de base de données moderne avec **30 tables** organisées en **8 modules fonctionnels**. L'architecture privilégie la sécurité (UUID), la traçabilité complète et la flexibilité multi-tenant.

## 🏗️ Modules et Tables

### 🔐 1. Authentification & Sécurité (5 tables)

#### `users` - Utilisateurs du système
- **Rôle** : Gestion centralisée des utilisateurs avec support multi-tenant
- **Clés** : UUID, role_id, company_id
- **Relations** : 
  - `belongsTo(Role)` - Un utilisateur a un rôle
  - `belongsTo(Company)` - Un utilisateur appartient à une entreprise
  - `hasMany(UserPreference)` - Préférences personnalisées

#### `roles` - Rôles système
- **Rôle** : Définition des rôles (Admin, Manager, Caissier, etc.)
- **Relations** :
  - `hasMany(User)` - Un rôle peut avoir plusieurs utilisateurs
  - `belongsToMany(Permission)` - Relations many-to-many avec permissions

#### `permissions` - Permissions granulaires
- **Rôle** : Contrôle d'accès fin par module/action
- **Structure** : name, module, display_name
- **Relations** : `belongsToMany(Role)` via table pivot

#### `role_permissions` - Table pivot
- **Rôle** : Liaison flexible rôles ↔ permissions
- **Avantage** : Permissions dynamiques sans modification de code

#### `user_preferences` - Préférences utilisateur
- **Rôle** : Stockage flexible des préférences (JSON)
- **Usage** : Thème, langue, dashboard layout, etc.

---

### 🏢 2. Configuration Entreprise (2 tables)

#### `companies` - Entreprises (Multi-tenant)
- **Rôle** : Support multi-tenant complet
- **Isolation** : Chaque entreprise a ses propres données
- **Settings** : Configuration JSON flexible par entreprise

#### `warehouses` - Entrepôts/Magasins
- **Rôle** : Gestion multi-sites par entreprise
- **Relations** :
  - `belongsTo(Company)` - Appartient à une entreprise
  - `belongsTo(User, 'manager_id')` - Gestionnaire d'entrepôt
  - `hasMany(Stock)` - Stocks par entrepôt

---

### 📦 3. Produits (7 tables)

#### `categories` - Catégories hiérarchiques
- **Structure** : Arbre avec parent_id (self-referencing)
- **Soft Delete** : Récupération possible des catégories supprimées
- **Relations** : `belongsTo(Category, 'parent_id')` + `hasMany(Category, 'parent_id')`

#### `brands` - Marques
- **Rôle** : Organisation par marque/fabricant
- **SEO** : Slug unique pour URLs friendly

#### `products` - Produits principaux
- **Cœur du système** : Entité centrale avec toutes les relations
- **Flexibilité** : Attributs JSON pour propriétés dynamiques
- **Relations clés** :
  - `belongsTo(Category, Brand)`
  - `hasMany(ProductVariant, ProductImage, Stock)`
  - `belongsToMany(Product)` pour bundles

#### `product_variants` - Variantes produits
- **Usage** : Taille, couleur, modèle
- **Gestion** : SKU et prix indépendants par variante

#### `product_images` - Images multiples
- **Flexibilité** : Plusieurs images par produit
- **Organisation** : sort_order, is_primary

#### `product_bundles` - Produits composites
- **Cas d'usage** : Packs, kits, assemblages
- **Structure** : Many-to-many avec quantité

#### `price_history` - Historique des prix
- **Traçabilité** : Suivi complet des changements de prix
- **Audit** : Qui, quand, pourquoi (reason)

---

### 📊 4. Gestion des Stocks (3 tables)

#### `stocks` - Stock par produit/entrepôt
- **Granularité** : Stock par combinaison produit × entrepôt
- **Gestion** : quantity, reserved_quantity, average_cost
- **Performance** : Index unique sur (product_id, warehouse_id)

#### `stock_movements` - Traçabilité complète
- **Audit trail** : Chaque mouvement de stock tracé
- **Types** : in, out, adjustment, transfer
- **Données** : previous_quantity, new_quantity, unit_cost

#### `stock_transfers` - Transferts inter-entrepôts
- **Workflow** : pending → in_transit → completed
- **Approbation** : created_by, approved_by, approved_at
- **Traçabilité** : transfer_number unique

---

### 💰 5. Ventes (3 tables)

#### `sales` - En-tête de vente
- **Structure** : Header/Detail pattern
- **Calculs** : subtotal, tax_amount, discount_amount, total_amount
- **Relations** :
  - `belongsTo(Customer, Warehouse, User)`
  - `hasMany(SaleItem)`
  - `morphMany(Payment)` - Paiements polymorphiques

#### `sale_items` - Lignes de vente
- **Détail** : Chaque produit vendu avec quantité et prix
- **Calcul** : unit_price × quantity = total_price

#### `payments` - Paiements (Polymorphique)
- **Flexibilité** : Utilisable pour ventes ET achats
- **Méthodes** : cash, card, bank_transfer, check, mobile_money
- **Statuts** : pending, completed, failed, refunded

---

### 🛒 6. Achats & Fournisseurs (4 tables)

#### `suppliers` - Fournisseurs
- **Gestion** : Contacts, conditions de paiement
- **Crédit** : credit_limit, payment_terms

#### `customers` - Clients
- **Types** : individual, company
- **Fidélité** : loyalty_points intégré
- **Crédit** : Gestion des limites de crédit

#### `purchases` + `purchase_items`
- **Structure** : Identique aux ventes (Header/Detail)
- **Spécificités** : expected_date, supplier_id
- **Workflow** : pending → received → cancelled

---

### 🎁 7. Marketing & Fidélité (2 tables)

#### `promotions` - Promotions temporaires
- **Types** : percentage, fixed_amount, buy_x_get_y
- **Contrôle** : usage_limit, used_count
- **Période** : start_date, end_date

#### `loyalty_programs` - Points de fidélité
- **Transactions** : earned, redeemed, expired
- **Calcul** : points_balance = points_earned - points_used

---

### 🤖 8. Système & IA (4 tables)

#### `notifications` - Alertes système
- **Types** : info, warning, error, success
- **Priorités** : low, medium, high, urgent
- **Statut** : is_read, read_at

#### `audit_logs` - Journal d'audit
- **Traçabilité** : Toutes les actions importantes
- **Données** : old_values, new_values (JSON)
- **Contexte** : ip_address, user_agent

#### `ai_predictions` - Prévisions IA
- **Types** : demand_forecast, reorder_point, price_optimization
- **Données** : input_data, prediction_result (JSON)
- **Qualité** : confidence_score, is_accurate

#### `settings` - Paramètres globaux
- **Flexibilité** : Clé-valeur avec groupes
- **Sécurité** : is_public pour exposition API

---

## 🔗 Relations Clés et Leur Importance

### Relations Critiques

1. **User → Role → Permissions**
   - **Importance** : Sécurité et contrôle d'accès granulaire
   - **Flexibilité** : Ajout de permissions sans modification de code

2. **Product → Stock → Warehouse**
   - **Importance** : Gestion multi-sites du stock
   - **Performance** : Index unique pour requêtes rapides

3. **Sale/Purchase → Items → Products**
   - **Importance** : Intégrité des transactions
   - **Calculs** : Totaux automatiques et cohérents

4. **Polymorphic Payments**
   - **Importance** : Réutilisabilité pour ventes ET achats
   - **Évolutivité** : Extensible à d'autres entités

### Relations de Traçabilité

- **StockMovement** : Audit trail complet des stocks
- **PriceHistory** : Suivi des changements de prix
- **AuditLog** : Journal global des actions

## 🎯 Avantages de cette Architecture

### Sécurité
- **UUID partout** : Protection contre l'énumération
- **Soft Deletes** : Récupération des données critiques
- **Audit complet** : Traçabilité de toutes les actions

### Performance
- **Index optimisés** : Sur les clés étrangères et champs uniques
- **Relations efficaces** : Eager loading possible
- **Pagination** : Support natif Laravel

### Flexibilité
- **JSON columns** : Attributs dynamiques sans migration
- **Polymorphic relations** : Réutilisabilité maximale
- **Multi-tenant** : Isolation complète par entreprise

### Évolutivité
- **Modules séparés** : Développement indépendant
- **Relations extensibles** : Ajout facile de nouvelles entités
- **API-ready** : Structure adaptée aux APIs REST

## 🚀 Cas d'Usage Principaux

1. **Gestion Multi-Sites** : Stocks par entrepôt avec transferts
2. **E-commerce** : Produits avec variantes et promotions
3. **B2B** : Gestion fournisseurs avec conditions spécifiques
4. **Audit & Compliance** : Traçabilité complète requise
5. **IA & Analytics** : Prédictions basées sur l'historique
6. **Multi-Tenant SaaS** : Isolation complète par entreprise

Cette architecture offre une base solide pour un système de gestion de stock moderne, évolutif et sécurisé.