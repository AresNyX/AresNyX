// js/script.js - KONAČNA GLAVNA SKRIPTA

import { UIManager } from './modules/UIManager.js';
import { ProductData } from './modules/ProductData.js';
import { CartLogic } from './modules/CartLogic.js';

// ===================================================
// === NOVO: EMAILJS INICIJALIZACIJA JE SADA OVDE ===
// Koristimo Vaš Public Key
try {
    emailjs.init("WKV419-gz6OQWSgRJ"); 
} catch (e) {
    console.error("EmailJS biblioteka nije pronađena ili nije inicijalizovana.");
}
// ===================================================


// === Glavni ARESNYXSHOP Objekat (Globalni API) ===
window.AresNyXShop = {
    // UIManager metode
    toggleCart: UIManager.toggleCart.bind(UIManager),
    closeModal: UIManager.closeModal.bind(UIManager),
    openProductModal: UIManager.openProductModal.bind(UIManager),
    prevImage: UIManager.prevImage.bind(UIManager),
    nextImage: UIManager.nextImage.bind(UIManager),
    changeQuantity: UIManager.changeQuantity.bind(UIManager),
    selectSize: UIManager.selectSize.bind(UIManager),
    addToCartFromModal: UIManager.addToCartFromModal.bind(UIManager),
    toggleSizeTable: UIManager.toggleSizeTable.bind(UIManager),
    startCheckout: UIManager.startCheckout.bind(UIManager),
    closeCheckoutModal: UIManager.closeCheckoutModal.bind(UIManager),
    goToStep: UIManager.goToStep.bind(UIManager),
    submitShippingForm: UIManager.submitShippingForm.bind(UIManager),
    completeOrder: UIManager.completeOrder.bind(UIManager),
    toggleFilterPanel: UIManager.toggleFilterPanel.bind(UIManager),
    applyAllFilters: UIManager.applyAllFilters.bind(UIManager),
    
    // CartLogic metode (Poziva se iz generisanog HTML-a)
    removeCartItem: CartLogic.removeCartItem.bind(CartLogic),
    updateCartItem: CartLogic.updateCartItem.bind(CartLogic),
    clearCart: CartLogic.clearCart.bind(CartLogic),
    
    // ProductData metode (Poziva se iz statičkog HTML-a filtera - i dalje ih treba rešiti u UIManager.js)
    filterProducts: ProductData.updateFilterState.bind(ProductData), 
    sortProducts: ProductData.updateSortState.bind(ProductData) 
};


// === Inicijalizacija ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicijalizacija Logike i Podataka
    ProductData.init(); 
    CartLogic.init(); 
    UIManager.init();
    
    // 2. Inicijalno Renderovanje
    // ProductData.init() poziva UIManager.renderProducts()
    UIManager.renderCart(); 
});
