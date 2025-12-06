// js/script.js - ISPRAVLJENA GLAVNA SKRIPTA

import { UIManager } from './modules/UIManager.js';
import { ProductData } from './modules/ProductData.js';
import { CartLogic } from './modules/CartLogic.js';

// === Glavni ARESNYXSHOP Objekat ===
// Svi pozivi iz HTML-a (onclick) moraju ići preko ovog objekta
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
    clearCart: CartLogic.clearCart.bind(CartLogic),
    startCheckout: UIManager.startCheckout.bind(UIManager),
    closeCheckoutModal: UIManager.closeCheckoutModal.bind(UIManager),
    goToStep: UIManager.goToStep.bind(UIManager),
    submitShippingForm: UIManager.submitShippingForm.bind(UIManager),
    completeOrder: UIManager.completeOrder.bind(UIManager),
    toggleFilterPanel: UIManager.toggleFilterPanel.bind(UIManager),
    applyAllFilters: UIManager.applyAllFilters.bind(UIManager),
    
    // Metode za Korpu koje se pozivaju iz generisanog HTML-a u UIManager-u
    removeCartItem: CartLogic.removeCartItem.bind(CartLogic),
    updateCartItem: CartLogic.updateCartItem.bind(CartLogic),

    // Metode za filtriranje/sortiranje koje se pozivaju iz statičkog HTML-a
    // Iako UIManager.js to sada upravlja preko applyAllFilters, ostavljamo ih kao fallback/clarity
    filterProducts: ProductData.filterProducts.bind(ProductData),
    sortProducts: ProductData.sortProducts.bind(ProductData)
};


// === Inicijalizacija ===
// DOMContentLoaded osigurava da je HTML učitan pre izvršenja skripte
document.addEventListener('DOMContentLoaded', () => {
    // 1. Učitavanje proizvoda (i inicijalno postavljanje filtera/sorta)
    ProductData.init(); 

    // 2. Učitavanje korpe iz localStorage-a i ažuriranje prikaza
    CartLogic.init(); 
    
    // 3. Postavljanje svih Event Listeners-a (koji nisu inline)
    UIManager.init();

    // 4. Inicijalno renderovanje (sada već filtriranih/sortiranih) proizvoda
    UIManager.renderProducts(); 
    
    // 5. Inicijalno renderovanje korpe (sa stanjem iz local storage-a)
    UIManager.renderCart(); 
    UIManager.updateCartCount();
});
