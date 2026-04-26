document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 StockFlow démarré');

    const model = new StockModel();
    const view = new StockView();
    const controller = new StockController(model, view);

    view.renderCurrentView(model, 'params');
    controller.attachParamsListeners();
    controller.setActiveNav('params');

    console.log('✅ Application prête');
});