import React from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  return (
    <div className="product-detail-container">
      <header className="top-navbar">
        <div className="navbar-left">
          <div className="brand-logo">
            <div className="logo-icon">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fillRule="evenodd" />
              </svg>
            </div>
            <h2>GestionStock</h2>
          </div>
          <div className="search-container">
            <div className="search-input">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Rechercher..." />
            </div>
          </div>
        </div>
        <div className="navbar-right">
          <nav className="nav-links">
            <a href="#" className="nav-link">Tableau de bord</a>
            <a href="#" className="nav-link active">Inventaire</a>
            <a href="#" className="nav-link">Commandes</a>
            <a href="#" className="nav-link">Rapports</a>
            <a href="#" className="nav-link">Paramètres</a>
          </nav>
          <div className="user-avatar"></div>
        </div>
      </header>

      <main className="main-content">
        <div className="breadcrumbs">
          <a href="#">Inventaire</a>
          <span>/</span>
          <a href="#">Tous les produits</a>
          <span>/</span>
          <span>Casque sans fil</span>
        </div>

        <div className="product-header">
          <div className="product-title">
            <h1>Casque sans fil à réduction de bruit</h1>
            <div className="product-meta">
              <span className="sku">SKU: AUDIO-WH-001</span>
              <span className="status-badge in-stock">En stock</span>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn-secondary">
              <span className="material-symbols-outlined">archive</span>
              Archiver
            </button>
            <button className="btn-primary">
              <span className="material-symbols-outlined">edit</span>
              Modifier produit
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <p>Stock actuel</p>
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div className="stat-value">
              <p className="value">142</p>
              <p className="unit">Unités</p>
            </div>
            <p className="stat-trend positive">
              <span className="material-symbols-outlined">trending_up</span>
              +5% vs mois dernier
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <p>Valeur totale</p>
              <span className="material-symbols-outlined">attach_money</span>
            </div>
            <p className="stat-value-large">14 200€</p>
            <p className="stat-trend positive">
              <span className="material-symbols-outlined">trending_up</span>
              +12% vs mois dernier
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <p>Commandes en attente</p>
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <p className="stat-value-large">12</p>
            <p className="stat-description">Nécessite expédition</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <p>Point de réapprovisionnement</p>
              <span className="material-symbols-outlined">low_priority</span>
            </div>
            <div className="stat-value">
              <p className="value">25</p>
              <p className="unit">Unités</p>
            </div>
            <p className="stat-description positive">Stock en bonne santé</p>
          </div>
        </div>

        <div className="content-layout">
          <div className="left-column">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Performance des ventes</h3>
                <select className="time-selector">
                  <option>30 derniers jours</option>
                  <option>90 derniers jours</option>
                  <option>Cette année</option>
                </select>
              </div>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 800 200">
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#36e27b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#36e27b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line stroke="#254632" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="0" y2="0" />
                  <line stroke="#254632" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
                  <line stroke="#254632" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
                  <line stroke="#254632" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
                  <line stroke="#254632" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" />
                  <path d="M0,150 C50,140 100,160 150,120 C200,80 250,100 300,90 C350,80 400,60 450,50 C500,40 550,70 600,40 C650,10 700,30 750,20 L800,40 L800,200 L0,200 Z" fill="url(#gradient)" />
                  <path d="M0,150 C50,140 100,160 150,120 C200,80 250,100 300,90 C350,80 400,60 450,50 C500,40 550,70 600,40 C650,10 700,30 750,20 L800,40" fill="none" stroke="#36e27b" strokeLinecap="round" strokeWidth="3" />
                  <circle cx="150" cy="120" fill="#112117" r="4" stroke="#36e27b" strokeWidth="2" />
                  <circle cx="300" cy="90" fill="#112117" r="4" stroke="#36e27b" strokeWidth="2" />
                  <circle cx="450" cy="50" fill="#112117" r="4" stroke="#36e27b" strokeWidth="2" />
                  <circle cx="600" cy="40" fill="#112117" r="4" stroke="#36e27b" strokeWidth="2" />
                  <circle cx="750" cy="20" fill="#112117" r="4" stroke="#36e27b" strokeWidth="2" />
                </svg>
                <div className="chart-labels">
                  <span>1 Oct</span>
                  <span>8 Oct</span>
                  <span>15 Oct</span>
                  <span>22 Oct</span>
                  <span>29 Oct</span>
                </div>
              </div>
            </div>

            <div className="movements-table">
              <div className="table-header">
                <h3>Mouvements récents</h3>
                <a href="#" className="view-all">Voir tout</a>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Quantité</th>
                      <th>Date et heure</th>
                      <th>Utilisateur</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="movement-type">
                          <div className="movement-icon sold">
                            <span className="material-symbols-outlined">arrow_upward</span>
                          </div>
                          <span>Vendu</span>
                        </div>
                      </td>
                      <td className="quantity negative">-2</td>
                      <td>Aujourd'hui, 10:00</td>
                      <td>Jane Doe</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="movement-type">
                          <div className="movement-icon restock">
                            <span className="material-symbols-outlined">add</span>
                          </div>
                          <span>Réapprovisionnement</span>
                        </div>
                      </td>
                      <td className="quantity positive">+50</td>
                      <td>Hier, 16:30</td>
                      <td>Gestionnaire entrepôt</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="movement-type">
                          <div className="movement-icon return">
                            <span className="material-symbols-outlined">keyboard_return</span>
                          </div>
                          <span>Retour client</span>
                        </div>
                      </td>
                      <td className="quantity neutral">+1</td>
                      <td>24 Oct, 2023</td>
                      <td>Équipe support</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="movement-type">
                          <div className="movement-icon sold">
                            <span className="material-symbols-outlined">arrow_upward</span>
                          </div>
                          <span>Vendu</span>
                        </div>
                      </td>
                      <td className="quantity negative">-5</td>
                      <td>22 Oct, 2023</td>
                      <td>Boutique en ligne</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="product-images">
              <div className="main-image"></div>
              <div className="thumbnail-gallery">
                <div className="thumbnail active"></div>
                <div className="thumbnail"></div>
                <div className="thumbnail"></div>
              </div>
            </div>

            <div className="financials-card">
              <h3>Finances</h3>
              <div className="financial-item">
                <span>Prix de revient</span>
                <span>45,00€</span>
              </div>
              <div className="financial-item">
                <span>Prix de vente</span>
                <span className="selling-price">100,00€</span>
              </div>
              <div className="financial-item">
                <span>Marge bénéficiaire</span>
                <span className="profit-margin">55%</span>
              </div>
            </div>

            <div className="details-card">
              <h3>Détails</h3>
              <div className="detail-item">
                <span className="detail-label">Catégorie</span>
                <span>Électronique > Audio</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fournisseur</span>
                <div className="supplier-info">
                  <span className="material-symbols-outlined">business</span>
                  <span>TechGiant Inc.</span>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Emplacement</span>
                <div className="location-info">
                  <span className="material-symbols-outlined">warehouse</span>
                  <span>Entrepôt A, Étagère 4B</span>
                </div>
              </div>
              <div className="detail-item description">
                <span className="detail-label">Description</span>
                <p>Casque supra-auriculaire premium avec réduction active du bruit, autonomie de 30 heures et coussinets en mousse à mémoire de forme.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;