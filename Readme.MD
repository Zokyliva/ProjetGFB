# 📦 StockFlow – Gestion des approvisionnements à quantité constante

## 🎯 Objectif pédagogique

StockFlow est une application web interactive qui illustre et prouve mathématiquement la **détermination de la période de commande** dans un système où la quantité commandée (`Q`) est constante.

L’application permet de :

- Comprendre la relation `T = Q / D` (période = quantité / demande annuelle)
- Visualiser l’impact d’une variation de `Q` sur les coûts et le niveau de stock
- Comparer une politique arbitraire avec l’optimum théorique de Wilson (EOQ)
- Explorer des scénarios réels : demande saisonnière, délai aléatoire, contrainte de capacité

---

## 🧠 Concepts théoriques mis en œuvre

### 📐 Période de commande à quantité constante

Dans un système d’approvisionnement où l’on commande toujours **la même quantité** `Q`, la période moyenne entre deux commandes est :
T = Q / D

text

avec :
- `D` = demande annuelle (unités)
- `Q` = quantité fixe par commande (unités)
- `T` = période en années (convertie en jours)

### 📊 Indicateurs calculés

| Indicateur | Formule | Unité |
|------------|---------|-------|
| Nombre de commandes / an | `D / Q` | – |
| Coût de passation annuel | `(D / Q) × K` | MGA |
| Coût de possession annuel | `(Q / 2) × h` | MGA |
| Coût total (hors achat) | Passation + Possession | MGA |
| Rotation du stock | `D / (Q / 2)` | tours/an |
| Point de commande | `(D / 365) × L` | unités |

### 🎯 Quantité économique de Wilson (EOQ)
Q* = √(2 × K × D / h)
T* = Q* / D

text

Cette quantité minimise le coût total (passation + possession).

---

## 🖥️ Fonctionnalités de l’application

### 1. 📋 Paramètres

L’utilisateur saisit les données suivantes (valeurs par défaut en **MGA** – Ariary malgache) :

| Champ | Symbole | Valeur par défaut | Unité |
|-------|---------|-------------------|-------|
| Demande annuelle | `D` | 10 000 | unités |
| Quantité commandée | `Q` | 2 500 | unités |
| Coût de passation | `K` | 25 000 | MGA |
| Coût possession unitaire | `h` | 1 000 | MGA/un·an |
| Prix unitaire | `P` | 5 000 | MGA |
| Taux financier | `i` | 5 % | – |
| Délai d’approvisionnement | `L` | 5 | jours |

#### 🎚️ Simulation dynamique

Un curseur permet de faire varier `Q` en temps réel et visualiser instantanément :

- La nouvelle période `T`
- Le nouveau coût total
- Le nombre de commandes par an
- Un badge coloré indique le gain ou la perte par rapport à la situation initiale

---

### 2. 📊 Analyse (Visualisation)

Cette section affiche :

- **8 indicateurs clés** (période, coûts, rotation, stock moyen, point de commande)
- **Comparaison avec Wilson** : montre la quantité optimale, la période optimale, le coût total minimal et l’écart avec la politique actuelle
- **Courbe du coût total** : graphique interactif montrant comment le coût total varie en fonction de `Q`. Les courbes de passation et de possession sont superposées.
- **Graphique dents de scie** : évolution du stock dans le temps (pente = consommation quotidienne, sauts = arrivées de commandes)
- **Calendrier prévisionnel** : dates des 6 prochaines commandes et budget associé
- **Export PDF** : génère un rapport téléchargeable des indicateurs

---

### 3. 🔍 Exploration (Scénarios avancés)

#### 🌿 Demande saisonnière

L’utilisateur saisit 12 coefficients (multiplicateurs mensuels). L’application calcule la nouvelle demande annuelle et la période moyenne résultante.

*Exemple* : `1, 0.8, 0.9, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.3` (pic en novembre/décembre)

#### ⚠️ Délai aléatoire

Simulation de 1000 commandes avec un écart-type donné autour du délai nominal. Affiche le délai moyen observé et une recommandation de stock de sécurité (pour un taux de service de 95 %).

#### 📦 Contrainte de capacité

Si la quantité commandée dépasse la capacité maximale de stockage, l’application propose une réduction de `Q` et calcule la nouvelle période.

#### 🔬 Analyse de sensibilité

Tableau montrant comment la période optimale `T*` varie quand la demande `D` et le coût de passation `K` changent. Les cellules proches de la période actuelle sont surlignées.

---

## 🧭 Guide d’utilisation pas à pas

### Cas d’étude : Réduction des coûts par optimisation de `Q`

1. **Paramètres** : utilisez les valeurs par défaut.
   - `D` = 10 000 unités, `Q` = 2 500 unités
   - `K` = 25 000 MGA, `h` = 1 000 MGA

2. **Onglet Analyse** :
   - Constater : `T` ≈ 91 jours, coût total = 350 000 MGA/an

3. **Comparaison Wilson** :
   - `Q*` ≈ 707 unités, `T*` ≈ 26 jours
   - Économie potentielle : ~ 289 000 MGA/an

4. **Simulation dynamique** (dans Paramètres) :
   - Déplacer le curseur vers `Q` = 700 unités
   - Observer la période tomber à ~26 jours et le coût total diminuer

5. **Graphique coût total** :
   - Visualiser le minimum de la courbe rouge autour de `Q*`

6. **Exploration – Demande saisonnière** :
   - Saisir des coefficients pour simuler un pic de fin d’année
   - Voir la période moyenne s’ajuster

7. **Exploration – Délai aléatoire** :
   - Écart-type = 3 jours → simulation donne un délai moyen ~5 jours
   - Suggestion de stock de sécurité

8. **Export PDF** : générer un rapport pour présenter les résultats

---

## 🛠️ Technologies utilisées

- **HTML5 / TailwindCSS** – interface responsive (mobile-first)
- **JavaScript (ES6)** – logique métier (MVC)
- **Chart.js** – graphiques interactifs (dents de scie, courbe des coûts)
- **html2canvas + jsPDF** – export PDF
- **Font Awesome** – icônes
- **Architecture MVC** : `model.js` (données), `view.js` (affichage), `controller.js` (événements), `app.js` (initialisation)

---

## 🚀 Installation et exécution

### Méthode 1 : En local (recommandée pour la démonstration)

1. Téléchargez ou clonez le projet
2. Ouvrez le dossier dans VS Code
3. Lancez **Live Server** (cliquer sur "Go Live" en bas à droite)
4. L’application s’ouvre dans votre navigateur

### Méthode 2 : Hébergement en ligne (GitHub Pages)

1. Déposez les fichiers sur un dépôt GitHub public
2. Activez **GitHub Pages** (Settings → Pages → branch `main`)
3. Accédez à l’URL générée

### Structure des fichiers
projet/
├── index.html
├── css/
│ └── style.css
├── js/
│ ├── model.js
│ ├── view.js
│ ├── controller.js
│ └── app.js
└── README.md

text

---

## 📸 Aperçu (interface)

| Onglet | Contenu |
|--------|---------|
| **Paramètres** | Champs de saisie + curseur dynamique |
| **Analyse** | Indicateurs, Wilson, graphiques, calendrier, export PDF |
| **Exploration** | Scénarios saison, délai aléatoire, capacité, sensibilité |

> L’interface s’adapte automatiquement aux écrans mobiles : navigation en bas, graphiques scrollables horizontalement.

---

## 🔬 Preuves mathématiques apportées

1. **Relation linéaire `T = Q / D`** : le slider montre que doubler `Q` double `T`
2. **Convexité du coût total** : la courbe `C(Q)` a un unique minimum
3. **Optimum Wilson** : `Q*` minimise bien le coût total (vérifiable sur le graphique)
4. **Sensibilité** : `T*` augmente avec `K`, diminue avec `D` (tableau)
5. **Période régulière** : le graphique dents de scie montre des cycles égaux
