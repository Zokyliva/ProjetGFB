class StockModel {
    constructor() {
        this.D = 10000; this.Q = 2500; this.K = 50; this.h = 2; this.P = 10; this.i = 0.05; this.L = 5;
    }
    setParams(params) {
        let changed = false;
        for (let key in params) {
            if (this[key] !== undefined && this[key] !== params[key]) {
                this[key] = params[key];
                changed = true;
            }
        }
        if (changed) this.notifyChange();
    }
    onChange(callback) { this._onChange = callback; }
    notifyChange() { if (this._onChange) this._onChange(); }
    getIndicators() {
        const { D, Q, K, h, P, i, L } = this;
        const T_jours = (Q / D) * 365;
        const nbCommandes = D / Q;
        const coutPassation = nbCommandes * K;
        const coutPossession = (Q / 2) * h;
        const coutTotal = coutPassation + coutPossession;
        const coutAchat = D * P;
        const coutFinancier = i * (Q / 2) * P;
        const rotation = D / (Q / 2);
        const stockMoyen = Q / 2;
        const pointCommande = (D / 365) * L;
        return { T_jours: Math.round(T_jours * 10) / 10, nbCommandes: nbCommandes.toFixed(2), coutPassation: coutPassation.toFixed(2), coutPossession: coutPossession.toFixed(2), coutTotal: coutTotal.toFixed(2), coutAchat: coutAchat.toFixed(2), coutFinancier: coutFinancier.toFixed(2), rotation: rotation.toFixed(2), stockMoyen: stockMoyen.toFixed(1), pointCommande: pointCommande.toFixed(1) };
    }
    getWilson() {
        if (this.h <= 0) return null;
        const Qw = Math.sqrt(2 * this.K * this.D / this.h);
        const Tw = (Qw / this.D) * 365;
        const coutTotalWilson = (this.D / Qw) * this.K + (Qw / 2) * this.h;
        return { Qw: Math.round(Qw), Tw: Math.round(Tw * 10) / 10, coutTotalWilson: coutTotalWilson.toFixed(2) };
    }
    getStockTimeSeries(days = 365) {
        const dailyDemand = this.D / 365;
        const T_days = (this.Q / this.D) * 365;
        const series = [];
        let stock = this.Q;
        for (let day = 0; day <= days; day++) {
            series.push({ day, stock: Math.max(0, stock) });
            stock -= dailyDemand;
            if (stock <= 0 || (day + 1) % T_days === 0) stock += this.Q;
        }
        return series;
    }
}