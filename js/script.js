// js/script.js - KONAČNA GLAVNA SKRIPTA

import { UIManager } from './modules/UIManager.js';
import { ProductData } from './modules/ProductData.js';
import { CartLogic } from './modules/CartLogic.js';

// === ГЛОБАЛНИ ОБЈЕКАТ (КЉУЧНО ЗА ONCLICK ИЗ HTML-а) ===
window.AresNyXShop = {
    // === UIManager (Sve metode za prikaz i interakciju) ===
    openProductModal: UIManager.openProductModal.bind(UIManager),
    selectSize: UIManager.selectSize.bind(UIManager),
    changeQuantity: UIManager.changeQuantity.bind(UIManager),
    prevImage: UIManager.prevImage.bind(UIManager),
    nextImage: UIManager.nextImage.bind(UIManager),
    addToCartFromModal: UIManager.addToCartFromModal.bind(UIManager),
    toggleCart: UIManager.toggleCart.bind(UIManager),
    toggleSizeTable: UIManager.toggleSizeTable.bind(UIManager),
    removeCartItem: CartLogic.removeCartItem.bind(CartLogic), // Metoda je u CartLogic
    updateCartItem: CartLogic.updateCartItem.bind(CartLogic), // Metoda je u CartLogic
    clearCart: CartLogic.clearCart.bind(CartLogic), // Metoda je u CartLogic
    toggleFilterPanel: UIManager.toggleFilterPanel.bind(UIManager),
    applyAllFilters: UIManager.applyAllFilters.bind(UIManager),
    
    // === Checkout (Logika i forme) ===
    startCheckout: UIManager.startCheckout.bind(UIManager),
    closeCheckoutModal: UIManager.closeCheckoutModal.bind(UIManager),
    goToStep: UIManager.goToStep.bind(UIManager),
    submitShippingForm: UIManager.submitShippingForm.bind(UIManager),
    completeOrder: UIManager.completeOrder.bind(UIManager),
    
    // === Produkt Data (Za evente filtriranja) ===
    updateFilterState: ProductData.updateFilterState.bind(ProductData),
    updateSortState: ProductData.updateSortState.bind(ProductData)
};


// === INICIJALIZACIJA PRI UČITAVANJU STRANICE ===
document.addEventListener('DOMContentLoaded', () => {
    // Inicijalizacija CartLogic (učitava iz localStorage)
    CartLogic.init(); 

    // Inicijalizacija UIManager (postavlja event listenere i renderuje)
    UIManager.init();
    
    // Početno renderovanje svih proizvoda
    UIManager.renderProducts();
    
    // Početno renderovanje korpe
    UIManager.renderCart(); 
    
    // Ažuriranje brojača korpe
    UIManager.updateCartCount(); 
});
