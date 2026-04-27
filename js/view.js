class StockView {
    constructor() {
        this.currentView = 'params';
        this.chart = null;
        this.costChart = null;
    }

    _formatMoney(value) {
        const rounded = Math.round(parseFloat(value));
        return rounded.toLocaleString('fr-FR') + ' MGA';
    }

    renderParams(model) {
        return `
        <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700 transition-theme">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-cog text-blue-500"></i> Paramètres de base
          </h2>
          <div class="space-y-4">
            ${this._renderInput('Demande annuelle (D)', 'D', model.D, 'unités', 'fa-chart-simple')}
            ${this._renderInput('Quantité commandée (Q)', 'Q', model.Q, 'unités', 'fa-cubes')}
            ${this._renderInput('Coût de passation (K)', 'K', model.K, 'MGA', 'fa-truck')}
            ${this._renderInput('Coût possession (h)', 'h', model.h, 'MGA/unite·an', 'fa-warehouse')}
            ${this._renderInput('Prix unitaire (P)', 'P', model.P, 'MGA', 'fa-tag')}
            ${this._renderInput('Taux financier (i)', 'i', model.i, '%', 'fa-percent')}
            ${this._renderInput('Délai appro (L)', 'L', model.L, 'jours', 'fa-clock')}
          </div>
          <!-- Slider simulation amélioré -->
          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                <i class="fas fa-sliders-h text-blue-500 mr-2"></i> Simulation dynamique : faire varier Q
              </label>
              <span class="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg">
                <i class="fas fa-chart-line mr-1"></i> En direct
              </span>
            </div>
            <div class="text-center mb-3">
              <span class="text-3xl font-bold text-blue-600 dark:text-blue-400" id="QSIMvalueBig">${model.Q}</span>
              <span class="text-sm text-gray-500 ml-1">unités</span>
            </div>
            <input type="range" id="QSIM" min="100" max="${model.D}" step="100" value="${model.Q}" 
              class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-slate-700">
            <div class="flex justify-between mt-2 text-xs text-gray-500">
              <span class="flex items-center gap-1"><i class="fas fa-arrow-down text-gray-400"></i> 100</span>
              <span class="text-blue-600 dark:text-blue-400 font-medium">← glisser →</span>
              <span class="flex items-center gap-1">${model.D} <i class="fas fa-arrow-up text-gray-400"></i></span>
            </div>
            <div id="simulationFeedback" class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl shadow-inner relative">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><i class="fas fa-clock text-white text-xs"></i></div>
                  <div><p class="text-xs text-gray-500">Période</p><p class="text-xl font-bold text-blue-600"><span id="simText">${(model.Q / model.D * 365).toFixed(1)}</span> jours</p></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><i class="fas fa-calculator text-white text-xs"></i></div>
                  <div><p class="text-xs text-gray-500">Coût total</p><p class="text-xl font-bold text-emerald-600"><span id="simCostText">${((model.D / model.Q) * model.K + (model.Q / 2) * model.h).toFixed(0)}</span> MGA</p></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><i class="fas fa-truck text-white text-xs"></i></div>
                  <div><p class="text-xs text-gray-500">Commandes/an</p><p class="text-xl font-bold text-orange-600"><span id="simNbCmdText">${(model.D / model.Q).toFixed(1)}</span></p></div>
                </div>
              </div>
              <div class="mt-3 pt-2">
                <div class="flex justify-between text-xs text-gray-400 mb-1"><span>Plus fréquent</span><span>Équilibre</span><span>Plus espacé</span></div>
                <div class="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"><div id="periodProgress" class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300" style="width: 33%"></div></div>
              </div>
            </div>
          </div>
          <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-sm text-gray-600 dark:text-gray-300">
            <i class="fas fa-info-circle text-blue-500 mr-2"></i> Modifiez les valeurs → passage à l'onglet "Analyse" pour voir l'impact.
          </div>
        </div>
      `;
    }

    _renderInput(label, id, value, unit, icon) {
        const step = id === 'i' ? '0.01' : (id === 'P' || id === 'h' || id === 'K' ? '100' : '100');
        return `
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            <i class="fas ${icon} mr-2 text-blue-500"></i> ${label}
          </label>
          <div class="relative">
            <input type="number" id="${id}" value="${value}" step="${step}" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500">
            <span class="absolute right-3 top-2.5 text-gray-400 text-sm">${unit}</span>
          </div>
        </div>
      `;
    }

    renderVisualisation(model) {
        const ind = model.getIndicators();
        const wilson = model.getWilson();
        const diff = (ind.coutTotal - wilson.coutTotalWilson).toFixed(0);
        const diffClass = diff > 0 ? 'text-orange-600' : 'text-green-600';
        return `
        <div class="space-y-6">
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-chart-pie text-blue-500"></i> Indicateurs clés</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${this._indicatorCard('Période T', ind.T_jours + ' jours', 'fa-calendar-week', 'blue')}
              ${this._indicatorCard('Commandes/an', ind.nbCommandes, 'fa-truck-fast', 'green')}
              ${this._indicatorCard('Coût passation', this._formatMoney(ind.coutPassation), 'fa-receipt', 'orange')}
              ${this._indicatorCard('Coût possession', this._formatMoney(ind.coutPossession), 'fa-box', 'purple')}
              ${this._indicatorCard('Coût total (hors achat)', this._formatMoney(ind.coutTotal), 'fa-calculator', 'red')}
              ${this._indicatorCard('Rotation stock', ind.rotation + ' tours/an', 'fa-rotate', 'teal')}
              ${this._indicatorCard('Stock moyen', ind.stockMoyen + ' unités', 'fa-layer-group', 'indigo')}
              ${this._indicatorCard('Point commande', ind.pointCommande + ' unités', 'fa-location-dot', 'pink')}
            </div>
          </div>
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-chart-line text-emerald-500"></i> Comparaison Wilson (EOQ)</h2>
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-xl">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div><p class="text-sm text-gray-500">Q* optimal</p><p class="text-2xl font-bold text-emerald-600">${wilson.Qw}</p><p class="text-xs">unités</p></div>
                <div><p class="text-sm text-gray-500">T* optimal</p><p class="text-2xl font-bold text-emerald-600">${wilson.Tw}</p><p class="text-xs">jours</p></div>
                <div><p class="text-sm text-gray-500">Coût total</p><p class="text-2xl font-bold text-emerald-600">${this._formatMoney(wilson.coutTotalWilson)}</p><p class="text-xs">/an</p></div>
              </div>
              <div class="mt-3 text-center p-2 rounded-lg ${diff > 0 ? 'bg-orange-100 dark:bg-orange-950/30' : 'bg-green-100 dark:bg-green-950/30'}">
                <p class="text-sm ${diffClass} font-medium"><i class="fas ${diff > 0 ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-1"></i> Écart par rapport à l'optimum : ${this._formatMoney(diff)}/an</p>
              </div>
            </div>
            <button id="exportPDFBtn" class="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"><i class="fas fa-file-pdf"></i> Exporter en PDF</button>
          </div>
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-chart-line text-purple-500"></i> Optimisation du coût total</h2>
            <p class="text-sm text-gray-500 mb-3">La courbe montre que le coût total est minimum lorsque Q = Q* (Wilson)</p>
            <div class="chart-container"><canvas id="costCurveChart" width="400" height="200" class="w-full h-auto rounded-xl border border-gray-100 dark:border-slate-700"></canvas></div>
            <div class="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
              <div class="p-2 bg-gray-100 dark:bg-slate-700 rounded"><span class="font-bold">Zone Q faible</span><br>Coût passation élevé</div>
              <div class="p-2 bg-green-100 dark:bg-green-950/30 rounded"><span class="font-bold">Optimum Q*</span><br>Coût total minimum</div>
              <div class="p-2 bg-gray-100 dark:bg-slate-700 rounded"><span class="font-bold">Zone Q élevé</span><br>Coût possession élevé</div>
            </div>
          </div>
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-chart-line text-blue-500"></i> Évolution du stock (dents de scie)</h2>
            <canvas id="stockChart" width="400" height="200" class="w-full h-auto rounded-xl border border-gray-100 dark:border-slate-700"></canvas>
            <p class="text-xs text-center text-gray-400 mt-3"><i class="fas fa-info-circle"></i> Pente = demande quotidienne, sauts = arrivées de commandes (Q constant)</p>
          </div>
          ${this.renderCalendar(model)}
        </div>
      `;
    }

    _indicatorCard(label, value, icon, color) {
        const colors = { blue: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700', green: 'bg-green-100 dark:bg-green-950/50 text-green-700', orange: 'bg-orange-100 dark:bg-orange-950/50 text-orange-700', purple: 'bg-purple-100 dark:bg-purple-950/50 text-purple-700', red: 'bg-red-100 dark:bg-red-950/50 text-red-700', teal: 'bg-teal-100 dark:bg-teal-950/50 text-teal-700', indigo: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700', pink: 'bg-pink-100 dark:bg-pink-950/50 text-pink-700' };
        return `<div class="${colors[color]} p-3 rounded-xl"><div class="flex items-center gap-2"><i class="fas ${icon}"></i><span class="font-medium">${label}</span></div><p class="text-2xl font-bold mt-1">${value}</p></div>`;
    }

    renderExploration(model) {
        return `
        <div class="space-y-6">
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-leaf text-green-500"></i> Demande saisonnière</h2>
            <p class="text-sm text-gray-500 mb-3">Multiplicateurs mensuels (ex: 1,0.8,0.9,1,1,1,1,1,1,1,1.5,1.3)</p>
            <input type="text" id="seasonalFactors" placeholder="1,1,1,1,1,1,1,1,1,1,1,1" class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 mb-3">
            <button id="applySeasonal" class="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"><i class="fas fa-chart-line mr-2"></i>Simuler la saisonnalité</button>
            <div id="seasonalResult" class="mt-3 text-sm"></div>
          </div>
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-random text-yellow-500"></i> Délai aléatoire</h2>
            <div class="flex gap-3 items-center flex-wrap"><label class="text-sm">Écart-type (jours) :</label><input type="number" id="ltStd" value="2" step="0.5" class="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700"></div>
            <button id="applyRandomLead" class="w-full mt-3 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"><i class="fas fa-dice-d6 mr-2"></i>Simuler 1000 commandes</button>
            <div id="randomLeadResult" class="mt-3 text-sm"></div>
          </div>
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-warehouse text-purple-500"></i> Contrainte de capacité</h2>
            <div class="flex gap-3 items-center flex-wrap"><label class="text-sm">Capacité max (unités) :</label><input type="number" id="maxCap" value="${model.Q + 500}" step="100" class="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700"></div>
            <button id="applyCapacity" class="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"><i class="fas fa-cubes mr-2"></i>Ajuster</button>
            <div id="capacityResult" class="mt-3 text-sm"></div>
          </div>
          <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-chart-simple text-cyan-500"></i> Analyse de sensibilité</h2>
            <p class="text-sm text-gray-500 mb-3">Comment la période optimale T* réagit aux variations de D (demande) et K (coût passation)</p>
            <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-gray-200 dark:border-slate-700"><th class="p-2 text-left">D \\ K</th><th class="p-2 text-center">K = 25 000</th><th class="p-2 text-center">K = 50 000</th><th class="p-2 text-center">K = 100 000</th><th class="p-2 text-center">K = 200 000</th></tr></thead><tbody id="sensitivityTable"></tbody></table></div>
            <div id="sensitivityInfo" class="mt-3 p-2 text-xs text-center text-gray-500"></div>
          </div>
        </div>
      `;
    }

    renderCurrentView(model, viewName) {
        const main = document.getElementById('mainContent');
        if (!main) return;
        if (viewName === 'params') main.innerHTML = this.renderParams(model);
        else if (viewName === 'visual') main.innerHTML = this.renderVisualisation(model);
        else if (viewName === 'explore') main.innerHTML = this.renderExploration(model);
        this.currentView = viewName;
    }

    updateParamsFields(model) {
        const fields = ['D', 'Q', 'K', 'h', 'P', 'i', 'L'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && parseFloat(input.value) !== model[field]) input.value = model[field];
        });
        // Mettre à jour aussi le slider et ses textes
        const qSlider = document.getElementById('QSIM');
        if (qSlider && qSlider.value != model.Q) qSlider.value = model.Q;
        const qValueBig = document.getElementById('QSIMvalueBig');
        if (qValueBig) qValueBig.textContent = model.Q;
        const simText = document.getElementById('simText');
        if (simText) simText.textContent = (model.Q / model.D * 365).toFixed(1);
        const simCost = document.getElementById('simCostText');
        if (simCost) simCost.textContent = ((model.D / model.Q) * model.K + (model.Q / 2) * model.h).toFixed(0);
        const simNb = document.getElementById('simNbCmdText');
        if (simNb) simNb.textContent = (model.D / model.Q).toFixed(1);
        const progress = document.getElementById('periodProgress');
        if (progress) {
            const ratio = (model.Q - 100) / (model.D - 100);
            progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
        }
    }

    updateChart(model) {
        const ctx = document.getElementById('stockChart')?.getContext('2d');
        if (!ctx) return;
        const isMobile = window.innerWidth < 640;
        const data = model.getStockTimeSeries(isMobile ? 120 : 180);
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(ctx, {
            type: 'line',
            data: { labels: data.map(d => d.day), datasets: [{ label: 'Stock (unités)', data: data.map(d => d.stock), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.05)', fill: true, tension: 0.2, pointRadius: 0, borderWidth: isMobile ? 1.5 : 2 }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top', labels: { font: { size: isMobile ? 10 : 12 } } }, tooltip: { mode: 'index' } }, scales: { y: { title: { display: true, text: 'Stock', font: { size: isMobile ? 10 : 12 } }, ticks: { font: { size: isMobile ? 9 : 11 } } }, x: { title: { display: true, text: 'Jours', font: { size: isMobile ? 10 : 12 } }, ticks: { maxRotation: isMobile ? 45 : 0, autoSkip: true, maxTicksLimit: isMobile ? 8 : 12, font: { size: isMobile ? 9 : 11 } } } } }
        });
    }

    updateCostCurve(model) {
        const canvas = document.getElementById('costCurveChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { D, K, h } = model;
        const isMobile = window.innerWidth < 640;
        const step = isMobile ? 200 : 100;
        const Qmax = Math.min(D, isMobile ? 5000 : 8000);
        const Qvalues = [], total = [], pass = [], poss = [];
        for (let q = 100; q <= Qmax; q += step) {
            Qvalues.push(q);
            const passation = (D / q) * K;
            const possession = (q / 2) * h;
            total.push(passation + possession);
            pass.push(passation);
            poss.push(possession);
        }
        if (this.costChart) this.costChart.destroy();
        this.costChart = new Chart(ctx, {
            type: 'line', data: {
                labels: Qvalues, datasets: [
                    { label: 'Coût total', data: total, borderColor: '#ef4444', borderWidth: isMobile ? 2 : 3, fill: false, pointRadius: 0, tension: 0.1 },
                    { label: 'Passation', data: pass, borderColor: '#f59e0b', borderWidth: isMobile ? 1.5 : 2, borderDash: [5, 5], pointRadius: 0, fill: false },
                    { label: 'Possession', data: poss, borderColor: '#10b981', borderWidth: isMobile ? 1.5 : 2, borderDash: [5, 5], pointRadius: 0, fill: false }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${Math.round(ctx.raw).toLocaleString('fr-FR')} MGA` } }, legend: { position: isMobile ? 'bottom' : 'top', labels: { font: { size: isMobile ? 10 : 12 }, boxWidth: isMobile ? 10 : 15, padding: isMobile ? 6 : 10 } } },
                scales: {
                    x: { title: { display: true, text: 'Quantité commandée Q (unités)', font: { size: isMobile ? 10 : 12 } }, ticks: { maxRotation: isMobile ? 45 : 0, autoSkip: true, maxTicksLimit: isMobile ? 5 : 8, font: { size: isMobile ? 9 : 11 } } },
                    y: { title: { display: true, text: 'Coût annuel (MGA)', font: { size: isMobile ? 10 : 12 } }, ticks: { font: { size: isMobile ? 9 : 11 }, callback: (val) => val >= 1e6 ? (val / 1e6).toFixed(1) + 'M' : (val >= 1e3 ? (val / 1e3).toFixed(0) + 'k' : val) } }
                },
                layout: { padding: { top: 10, bottom: isMobile ? 15 : 10, left: isMobile ? 5 : 10, right: isMobile ? 5 : 10 } }
            }
        });
    }

    renderCalendar(model) {
        const T_jours = (model.Q / model.D) * 365;
        const today = new Date();
        const orders = [];
        for (let i = 0; i < 6; i++) { const d = new Date(today); d.setDate(today.getDate() + i * T_jours); orders.push(d); }
        return `
        <div class="card-dark bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mt-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><i class="fas fa-calendar-alt text-indigo-500"></i> Calendrier prévisionnel des commandes</h2>
          <p class="text-sm text-gray-500 mb-3">Période T = ${T_jours.toFixed(1)} jours entre chaque commande</p>
          <div class="space-y-2">
            ${orders.map((date, idx) => `<div class="flex items-center justify-between p-3 ${idx === 0 ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-gray-50 dark:bg-slate-700/50'} rounded-xl"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-gray-400'} flex items-center justify-center text-white text-sm font-bold">${idx + 1}</div><div><p class="font-medium">Commande n°${idx + 1}</p><p class="text-xs text-gray-500">${date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div><div class="text-right"><p class="font-semibold text-blue-600 dark:text-blue-400">${model.Q} unités</p><p class="text-xs text-gray-500">${(model.Q * model.P).toLocaleString('fr-FR')} MGA HT</p></div></div>`).join('')}
          </div>
          <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl text-sm"><i class="fas fa-euro-sign text-yellow-600 mr-2"></i> Budget prévisionnel sur 6 mois : <strong>${(model.Q * model.P * 6).toLocaleString('fr-FR')} MGA</strong> d'achats</div>
        </div>
      `;
    }
}