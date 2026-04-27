class StockController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.model.onChange(() => this.refresh());
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                this.setActiveNav(view);
                this.view.renderCurrentView(this.model, view);
                if (view === 'visual') { this.view.updateChart(this.model); this.view.updateCostCurve(this.model); }
                if (view === 'explore') this.attachExploreListeners();
                if (view === 'params') this.attachParamsListeners();
            });
        });
        document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('dark'));
    }

    setActiveNav(view) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.view === view) btn.classList.add('active', 'bg-blue-600', 'text-white');
            else btn.classList.remove('active', 'bg-blue-600', 'text-white');
        });
    }

    attachParamsListeners() {
        const inputs = ['D', 'Q', 'K', 'h', 'P', 'i', 'L'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const handler = (e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val)) val = 0;
                this.model.setParams({ [id]: val });
            };
            el.removeEventListener('input', el._handler);
            el._handler = handler;
            el.addEventListener('input', handler);
        });

        // Slider simulation amélioré
        const qSlider = document.getElementById('QSIM');
        const qValueBig = document.getElementById('QSIMvalueBig');
        const simText = document.getElementById('simText');
        const simCostText = document.getElementById('simCostText');
        const simNbCmdText = document.getElementById('simNbCmdText');
        const periodProgress = document.getElementById('periodProgress');
        const simFeedback = document.getElementById('simulationFeedback');

        if (qSlider) {
            const updateSim = () => {
                const newQ = parseFloat(qSlider.value);
                const D = this.model.D, K = this.model.K, h = this.model.h;
                if (qValueBig) qValueBig.textContent = newQ;
                if (simText) simText.textContent = (newQ / D * 365).toFixed(1);
                if (simCostText) simCostText.textContent = ((D / newQ) * K + (newQ / 2) * h).toFixed(0);
                if (simNbCmdText) simNbCmdText.textContent = (D / newQ).toFixed(1);
                if (periodProgress) {
                    const ratio = (newQ - 100) / (D - 100);
                    periodProgress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
                }
                // Afficher badge de différence
                const oldCost = parseFloat(this.model.getIndicators().coutTotal);
                const newCost = (D / newQ) * K + (newQ / 2) * h;
                const diff = newCost - oldCost;
                if (simFeedback) {
                    const existing = simFeedback.querySelector('.diff-badge');
                    if (existing) existing.remove();
                    const badge = document.createElement('div');
                    badge.className = 'diff-badge absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ' + (diff > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/50' : 'bg-green-100 text-green-600 dark:bg-green-900/50');
                    badge.innerHTML = diff > 0 ? `↗️ +${Math.round(diff).toLocaleString('fr-FR')} MGA` : `↙️ ${Math.abs(Math.round(diff)).toLocaleString('fr-FR')} MGA`;
                    simFeedback.style.position = 'relative';
                    simFeedback.appendChild(badge);
                    setTimeout(() => badge.remove(), 2000);
                }
            };
            qSlider.addEventListener('input', (e) => {
                const newQ = parseFloat(e.target.value);
                const qInput = document.getElementById('Q');
                if (qInput) qInput.value = newQ;
                this.model.setParams({ Q: newQ });
                updateSim();
            });
            updateSim();
        }
    }

    attachExploreListeners() {
        const showMessage = (elementId, message, isError = false) => {
            const div = document.getElementById(elementId);
            if (div) div.innerHTML = `<div class="p-3 rounded-xl ${isError ? 'bg-red-100 dark:bg-red-950/50 text-red-700' : 'bg-green-100 dark:bg-green-950/50 text-green-700'}"><i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-2"></i>${message}</div>`;
        };
        // Saison
        document.getElementById('applySeasonal')?.addEventListener('click', () => {
            const val = document.getElementById('seasonalFactors').value.trim();
            let factors = val.split(',').map(Number);
            if (factors.length === 1 && !isNaN(factors[0])) factors = Array(12).fill(factors[0]);
            if (factors.length !== 12 || factors.some(isNaN)) { showMessage('seasonalResult', 'Entrez 12 coefficients ou un seul nombre.', true); return; }
            const newDemand = (this.model.D / 12) * factors.reduce((a, b) => a + b, 0);
            const T_eff = (this.model.Q / newDemand) * 365;
            showMessage('seasonalResult', `📆 Demande annuelle : ${Math.round(newDemand)} unités<br>📊 Période T moyenne : ${T_eff.toFixed(1)} jours (normale = ${(this.model.Q / this.model.D * 365).toFixed(1)} jours)`, false);
        });
        // Délai aléatoire
        document.getElementById('applyRandomLead')?.addEventListener('click', () => {
            const std = parseFloat(document.getElementById('ltStd').value);
            if (isNaN(std)) { showMessage('randomLeadResult', 'Écart-type invalide', true); return; }
            const Lnom = this.model.L;
            const sim = Array.from({ length: 1000 }, () => Math.max(0.1, Lnom + (Math.random() - 0.5) * 2 * std));
            const avg = sim.reduce((a, b) => a + b, 0) / 1000;
            showMessage('randomLeadResult', `🕒 Délai moyen simulé : ${avg.toFixed(1)} jours (nominal ${Lnom} jours)<br>⚠️ Stock sécurité suggéré : +${Math.ceil(std * 1.645)} unités (95% service)`, false);
        });
        // Capacité
        document.getElementById('applyCapacity')?.addEventListener('click', () => {
            const maxCap = parseFloat(document.getElementById('maxCap').value);
            if (isNaN(maxCap)) { showMessage('capacityResult', 'Capacité invalide', true); return; }
            if (this.model.Q > maxCap) {
                const newT = (maxCap / this.model.D) * 365;
                showMessage('capacityResult', `⚠️ Q réduit de ${this.model.Q} à ${maxCap} unités.<br>📅 Nouvelle période T = ${newT.toFixed(1)} jours.`, true);
            } else {
                showMessage('capacityResult', `✅ Capacité suffisante (${maxCap} ≥ ${this.model.Q}). Q inchangé.`, false);
            }
        });
        this.updateSensitivityTable();
    }

    updateSensitivityTable() {
        const table = document.getElementById('sensitivityTable');
        if (!table) return;
        const D_base = this.model.D;
        const h_base = this.model.h;
        const K_values = [25000, 50000, 100000, 200000];
        const D_values = [D_base * 0.5, D_base, D_base * 1.5, D_base * 2];
        const currentT = (this.model.Q / this.model.D) * 365;
        let rows = '';
        for (let D of D_values) {
            let cells = '';
            for (let K of K_values) {
                const Qw = Math.sqrt(2 * K * D / h_base);
                const Tw = (Qw / D) * 365;
                const isClose = Math.abs(Tw - currentT) < 10;
                cells += `<td class="p-2 text-center ${isClose ? 'bg-green-100 dark:bg-green-950/30 font-bold' : ''}">${Tw.toFixed(0)} j<\/td>`;
            }
            rows += `<tr class="border-b border-gray-100 dark:border-slate-700"><td class="p-2 font-medium">${Math.round(D)}<\/td>${cells}<\/tr>`;
        }
        table.innerHTML = rows;
        const info = document.getElementById('sensitivityInfo');
        if (info) info.innerHTML = `<i class="fas fa-info-circle mr-1"></i> En surbrillance : périodes proches de votre T actuel (${currentT.toFixed(0)} jours)`;
    }

    refresh() {
        if (this.view.currentView === 'params') {
            this.view.updateParamsFields(this.model);
        } else if (this.view.currentView === 'visual') {
            this.view.renderCurrentView(this.model, 'visual');
            this.view.updateChart(this.model);
            this.view.updateCostCurve(this.model);
            document.getElementById('exportPDFBtn')?.addEventListener('click', () => this.exportToPDF());
        } else if (this.view.currentView === 'explore') {
            this.view.renderCurrentView(this.model, 'explore');
            this.attachExploreListeners();
        }
    }

    async exportToPDF() {
        const element = document.querySelector('#mainContent .card-dark:first-child');
        if (!element) return;
        const btn = document.getElementById('exportPDFBtn');
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...'; btn.disabled = true; }
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const w = pdf.internal.pageSize.getWidth();
            const h = (imgProps.height * w) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, w, h);
            pdf.save('stockflow_rapport.pdf');
        } catch (e) { console.error(e); }
        if (btn) { btn.innerHTML = '<i class="fas fa-file-pdf"></i> Exporter en PDF'; btn.disabled = false; }
    }
}