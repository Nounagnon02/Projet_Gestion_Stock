import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div className={styles.brandText}>
              <h1>GestionStock</h1>
              <p>Admin Entreprise</p>
            </div>
          </div>
          
          <nav className={styles.navigation}>
            <a href="#" className={`${styles.navItem} ${styles.active}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p>Tableau de bord</p>
            </a>
            <a href="#" className={styles.navItem}>
              <span className="material-symbols-outlined">warehouse</span>
              <p>Inventaire</p>
            </a>
            <a href="#" className={styles.navItem}>
              <span className="material-symbols-outlined">point_of_sale</span>
              <p>Système POS</p>
            </a>
            <a href="#" className={styles.navItem}>
              <span className="material-symbols-outlined">auto_graph</span>
              <p>Prédictions IA</p>
            </a>
            <a href="#" className={styles.navItem}>
              <span className="material-symbols-outlined">settings</span>
              <p>Paramètres</p>
            </a>
          </nav>
        </div>
        
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}></div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Alex Morgan</p>
            <p className={styles.userAction}>Voir le profil</p>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Vue d'ensemble du tableau de bord</h2>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Rechercher stocks, commandes ou SKU..." />
            </div>
            <button className={styles.notificationBtn}>
              <span className="material-symbols-outlined">notifications</span>
              <span className={styles.notificationDot}></span>
            </button>
            <button className={styles.addStockBtn}>
              <span className="material-symbols-outlined">add</span>
              <span>Ajouter Stock Rapide</span>
            </button>
          </div>
        </header>

        <div className={styles.dashboardContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Chiffre d'affaires total</p>
                <p className={styles.statValue}>124 500€</p>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendBadge} ${styles.positive}`}>
                  <span className="material-symbols-outlined">trending_up</span> 8,2%
                </span>
                <p>vs mois dernier</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Alertes stock faible</p>
                <p className={styles.statValue}>12 Articles</p>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendBadge} ${styles.warning}`}>Action requise</span>
                <p>Réapprovisionner bientôt</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Commandes actives</p>
                <p className={styles.statValue}>45</p>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendBadge} ${styles.info}`}>+12 En attente</span>
                <p>Nécessite traitement</p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.aiCard}`}>
              <div className={`${styles.statIcon} ${styles.ai}`}>
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div className={styles.statInfo}>
                <div className={styles.aiLabel}>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <p className={styles.statLabel}>Prévision demande IA</p>
                </div>
                <p className={styles.statValue}>+15% Vol</p>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendBadge} ${styles.neutral}`}>Haute confiance</span>
                <p>Pour la semaine prochaine</p>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-header">
              <div>
                <h3>Valorisation stock vs Ventes</h3>
                <p>Aperçu financier des 6 derniers mois</p>
              </div>
              <div className="time-filters">
                <button className="active">6 Mois</button>
                <button>1 An</button>
                <button>Tout</button>
              </div>
            </div>
            <div className="chart-container">
              <svg className="chart" viewBox="0 0 1000 300">
                <defs>
                  <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#36e27b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#36e27b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line stroke="#334f40" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="0" y2="0" />
                <line stroke="#334f40" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="75" y2="75" />
                <line stroke="#334f40" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
                <line stroke="#334f40" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="225" y2="225" />
                <line stroke="#334f40" strokeWidth="1" x1="0" x2="1000" y1="300" y2="300" />
                <path d="M0,220 C150,200 250,250 400,150 C550,50 700,100 850,80 C950,60 1000,20 1000,20 V300 H0 Z" fill="url(#gradientGreen)" />
                <path d="M0,220 C150,200 250,250 400,150 C550,50 700,100 850,80 C950,60 1000,20 1000,20" fill="none" stroke="#36e27b" strokeLinecap="round" strokeWidth="3" />
                <circle cx="850" cy="80" fill="#112117" r="6" stroke="#36e27b" strokeWidth="3" />
              </svg>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Fév</span>
                <span>Mar</span>
                <span>Avr</span>
                <span>Mai</span>
                <span>Jun</span>
              </div>
            </div>
          </div>

          <div className="products-table">
            <div className="table-header">
              <h3>Mouvements de produits récents</h3>
              <button className="view-all-btn">Voir tout</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Qté Stock</th>
                    <th>Dernière MAJ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="product-info">
                        <div className="product-image headphones"></div>
                        <div>
                          <a href="#" className="product-name">Sony WH-1000XM5</a>
                          <p className="product-sku">SKU: HD-9921</p>
                        </div>
                      </div>
                    </td>
                    <td>Électronique</td>
                    <td><span className="status-badge in-stock">En stock</span></td>
                    <td>124</td>
                    <td>Il y a 2 min</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-info">
                        <div className="product-image watch"></div>
                        <div>
                          <a href="#" className="product-name">Galaxy Watch 5</a>
                          <p className="product-sku">SKU: WA-3320</p>
                        </div>
                      </div>
                    </td>
                    <td>Objets connectés</td>
                    <td><span className="status-badge low-stock">Stock faible</span></td>
                    <td>8</td>
                    <td>Il y a 45 min</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-info">
                        <div className="product-image keyboard"></div>
                        <div>
                          <a href="#" className="product-name">Keychron K2</a>
                          <p className="product-sku">SKU: KB-1102</p>
                        </div>
                      </div>
                    </td>
                    <td>Accessoires</td>
                    <td><span className="status-badge out-of-stock">Rupture de stock</span></td>
                    <td>0</td>
                    <td>Il y a 2h</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-info">
                        <div className="product-image stand"></div>
                        <div>
                          <a href="#" className="product-name">Support Aluminium</a>
                          <p className="product-sku">SKU: ST-4401</p>
                        </div>
                      </div>
                    </td>
                    <td>Bureau</td>
                    <td><span className="status-badge in-stock">En stock</span></td>
                    <td>210</td>
                    <td>Il y a 4h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

