import React from 'react';
import styles from './Inventory.module.css';

const Inventory = () => {
  return (
    <div className="inventory-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <span className="material-symbols-outlined icon-fill">inventory_2</span>
          </div>
          <div>
            <h1>GestionStock</h1>
            <p>Console de gestion</p>
          </div>
        </div>
        
        <nav className="navigation">
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Vue d'ensemble</span>
          </a>
          <a href="#" className="nav-item active">
            <span className="material-symbols-outlined icon-fill">inventory</span>
            <span>Inventaire</span>
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>Commandes</span>
            <span className="badge">3</span>
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">local_shipping</span>
            <span>Fournisseurs</span>
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analyses</span>
          </a>
          
          <div className="nav-section">
            <p className="section-title">Paramètres</p>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">settings</span>
              <span>Configuration</span>
            </a>
          </div>
        </nav>
        
        <div className="user-profile">
          <div className="user-avatar"></div>
          <div className="user-info">
            <span className="user-name">Alex Morgan</span>
            <span className="user-role">Gestionnaire magasin</span>
          </div>
          <span className="material-symbols-outlined">more_vert</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="mobile-menu">
            <button className="menu-btn">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="mobile-title">GestionStock</span>
          </div>
          
          <div className="breadcrumbs">
            <span className="breadcrumb-link">Tableau de bord</span>
            <span className="material-symbols-outlined">chevron_right</span>
            <span className="breadcrumb-current">Gestion d'inventaire</span>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Recherche globale..." />
            </div>
            <button className="notification-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h2>Inventaire</h2>
              <p>Gérez vos produits, suivez les niveaux de stock et mettez à jour les prix.</p>
            </div>
            <div className="page-actions">
              <button className="btn-secondary">
                <span className="material-symbols-outlined">file_upload</span>
                Exporter
              </button>
              <button className="btn-primary">
                <span className="material-symbols-outlined">add</span>
                Ajouter nouveau produit
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <p>Total produits</p>
                  <h3>1 240</h3>
                </div>
                <div className="stat-icon blue">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
              </div>
              <div className="stat-trend positive">
                <span className="material-symbols-outlined">trending_up</span>
                12% vs mois dernier
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <p>Valeur totale</p>
                  <h3>45 200€</h3>
                </div>
                <div className="stat-icon green">
                  <span className="material-symbols-outlined">attach_money</span>
                </div>
              </div>
              <div className="stat-trend positive">
                <span className="material-symbols-outlined">trending_up</span>
                5% vs mois dernier
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <p>Articles stock faible</p>
                  <h3>12</h3>
                </div>
                <div className="stat-icon orange">
                  <span className="material-symbols-outlined">warning</span>
                </div>
              </div>
              <div className="stat-trend negative">
                <span className="material-symbols-outlined">trending_down</span>
                2 nouvelles alertes
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <p>Rupture de stock</p>
                  <h3>5</h3>
                </div>
                <div className="stat-icon red">
                  <span className="material-symbols-outlined">remove_shopping_cart</span>
                </div>
              </div>
              <div className="stat-trend stable">
                <span className="material-symbols-outlined">check</span>
                Stable depuis hier
              </div>
            </div>
          </div>

          <div className="inventory-table">
            <div className="selection-bar">
              <div className="selection-info">
                <div className="selection-check">
                  <span className="material-symbols-outlined">check</span>
                </div>
                <span>2 articles sélectionnés</span>
              </div>
              <div className="selection-actions">
                <button className="btn-outline">
                  <span className="material-symbols-outlined">edit_note</span>
                  Modification groupée
                </button>
                <button className="btn-danger">
                  <span className="material-symbols-outlined">delete</span>
                  Supprimer sélection
                </button>
                <button className="close-btn">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="table-controls">
              <div className="search-input">
                <span className="material-symbols-outlined">search</span>
                <input type="text" placeholder="Rechercher par nom de produit, SKU ou tag..." />
              </div>
              <div className="filters">
                <button className="filter-btn">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filtrer
                </button>
                <div className="divider"></div>
                <select className="filter-select">
                  <option>Toutes catégories</option>
                  <option>Électronique</option>
                  <option>Vêtements</option>
                  <option>Maison et jardin</option>
                </select>
                <select className="filter-select">
                  <option>Statut stock</option>
                  <option>En stock</option>
                  <option>Stock faible</option>
                  <option>Rupture de stock</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>Produit</th>
                    <th>SKU</th>
                    <th>Niveau de stock</th>
                    <th>Coût</th>
                    <th>Prix</th>
                    <th>Fournisseur</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="selected">
                    <td>
                      <input type="checkbox" checked />
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMH9Ad4GzI7QTKFuqm2bOBtri40rIugWDYIyw34PwNlgL4ZJkXco1oNw5giN6Je8NbxPP95dFhrRVjf6kCYuvfmF7H6SSlG4n6BlxS9kGZkWrdofAZX1TS8r-aDbt4YY4cYm_10dkK1L-USLxR1dhr95c-D1PEgsRyaVxGEk0_ng6Eijz5KvY4Ql9T8zZYQGCgpVeH03Qhwi9TF_8ZDwN9B-YMWcKB8TC_jiCHltiXVp5Y9gtTPd3vGhuNHQXocEKGdYlKvrFyrPwq" alt="Casque sans fil" />
                        <div>
                          <div className="product-name">Casque sans fil</div>
                          <div className="product-category">Électronique</div>
                        </div>
                      </div>
                    </td>
                    <td className="sku">WH-2024-X</td>
                    <td>
                      <span className="status-badge in-stock">En stock (45)</span>
                    </td>
                    <td className="cost">120,00€</td>
                    <td className="price">199,00€</td>
                    <td className="supplier">TechAudio Inc.</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="selected">
                    <td>
                      <input type="checkbox" checked />
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzM8Cy2i6jMtKXwvswQbEAElT6RvPoehm5ShMAlWuI_QXvev0Eq3duBiRcjUVGrrlZ6DpupxAhAvfLeuWVWC1g9Ig8O8IHGRwFZkQd7QmNAR7tQZndZwQXiFU6-V86L8FTTs9HjxTPP0o-twXwNcdOZHPLutpzmdj2z39l-85aDajc6R0yHZUYdPw8CO7_6V9L6UHEyBALufDK7wqa6RH2Y7JbrHlfN8G8Hj8xOENdliJrePntJp_R4coDJ-nyg2T5nUap0Xna-RMv" alt="Montre connectée" />
                        <div>
                          <div className="product-name">Montre connectée Série 5</div>
                          <div className="product-category">Électronique</div>
                        </div>
                      </div>
                    </td>
                    <td className="sku">SW-SER-05</td>
                    <td>
                      <span className="status-badge low-stock">Stock faible (3)</span>
                    </td>
                    <td className="cost">210,00€</td>
                    <td className="price">349,00€</td>
                    <td className="supplier">GadgetWorld</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuATbPv1buSz6jdf1CG-lHnwD4KaHN6eXEORK7tvko3fcBPBC6lB_evbElF1rZvCssDihNRLVN5d3uIKWtypCmqbgyoEmDKHDohI_mEW_VVf_m1q42lYvGTqKaEw-vB3w_HhTfKY1LQVuKQPFW_dcc0_-NakXVq_nC4O0wDeRO2oz0gUXi5qwMD8CpezZuwwPxpTGFI-IjmJ_B13xkgDGypXxZuG23XlCczl9LbVc4eAtzsi_gdy55raH-BlXIGftntvQ_usNgyl1zmX" alt="Baskets de course" />
                        <div>
                          <div className="product-name">Baskets de course</div>
                          <div className="product-category">Vêtements</div>
                        </div>
                      </div>
                    </td>
                    <td className="sku">SN-RUN-001</td>
                    <td>
                      <span className="status-badge out-of-stock">Rupture de stock (0)</span>
                    </td>
                    <td className="cost">45,00€</td>
                    <td className="price">89,00€</td>
                    <td className="supplier">FitLife Styles</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmMtV-WIaGWTW-_vhFrR0bXaNiexn5jsMZbngDqcTOTAnIInCW3wSsvpdzZm3e6K7OFaTBVNQFNNsuqu5S11c6s4XFBgQeLzaqgfLLj5sHAF0eRQLKlcnEsiH70yS01cww8uZm7W28aRp9JUK_F2yNTDYvEBT1UfKvEHrA9VMNjL1cKbxQlXBVNGzaTt0ETtUuOgSkuNUQw4KiLFe_4gAP9SdagKQX_w2Ze2IkNQkQktN1V1mxRINrhfQwC7awD_N142Ai4eiiWPYY" alt="Appareil photo instantané" />
                        <div>
                          <div className="product-name">Appareil photo instantané</div>
                          <div className="product-category">Électronique</div>
                        </div>
                      </div>
                    </td>
                    <td className="sku">CAM-INS-99</td>
                    <td>
                      <span className="status-badge in-stock">En stock (12)</span>
                    </td>
                    <td className="cost">65,00€</td>
                    <td className="price">109,99€</td>
                    <td className="supplier">PhotoGear Ltd</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiaj4cdK4vkliFolYDFj2g3G9l27XOU0o8En52YstOyANPF0T503BhJf0QViO8dHl8xBzuzK-5MwSWX426kdo2jH_pOSuJ-eYUCtG0vZrv0I00Kg3QS8-xeqZ6hFY3iTvh-mCg1De47AD913eEAiz8SW2OZ-UUoLVigifs8d4bOuDf47YFl_2tMVGZgGNf0IzMuF-UrJvFcDNA1hNbeBu6NVlTXaasxqSZNizpe-9z5Ioi49Hr0-3UKEJ2l717XdPlmuUu0YE-t7xK" alt="Lotion visage quotidienne" />
                        <div>
                          <div className="product-name">Lotion visage quotidienne</div>
                          <div className="product-category">Beauté</div>
                        </div>
                      </div>
                    </td>
                    <td className="sku">BE-LOT-250</td>
                    <td>
                      <span className="status-badge in-stock">En stock (85)</span>
                    </td>
                    <td className="cost">8,50€</td>
                    <td className="price">24,00€</td>
                    <td className="supplier">GlowCo Inc.</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="action-btn delete">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div className="pagination-info">
                <p>Affichage de <span>1</span> à <span>5</span> sur <span>1240</span> résultats</p>
              </div>
              <nav className="pagination-nav">
                <a href="#" className="page-btn">
                  <span className="material-symbols-outlined">chevron_left</span>
                </a>
                <a href="#" className="page-btn active">1</a>
                <a href="#" className="page-btn">2</a>
                <a href="#" className="page-btn">3</a>
                <span className="page-dots">...</span>
                <a href="#" className="page-btn">124</a>
                <a href="#" className="page-btn">
                  <span className="material-symbols-outlined">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inventory;