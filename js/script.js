// js/script.js

import { ProductData } from './modules/ProductData.js';
import { CartLogic } from './modules/CartLogic.js';
import { UIManager } from './modules/UIManager.js';

// Globalni objekat da bi funkcije iz HTML-a (onclick) radile
window.AresNyXShop = {
    // Svi metodi koje je HTML ranije pozivao (npr. onclick="shop.openProductModal(id)")
    // Sada ih mapiramo na UIManager i CartLogic
    openProductModal: UIManager.openProductModal,
    selectSize: UIManager.selectSize,
    changeQuantity: UIManager.changeQuantity,
    addToCartFromModal: UIManager.addToCartFromModal,
    prevImage: UIManager.prevImage,
    nextImage: UIManager.nextImage,
    closeModal: UIManager.closeModal,
    toggleSizeTable: UIManager.toggleSizeTable,
    toggleCart: UIManager.toggleCart,
    
    // Metode za filtere
    toggleFilterPanel: UIManager.toggleFilterPanel,
    applyAllFilters: UIManager.applyAllFilters,
    
    // Metode za korpu
    removeCartItem: CartLogic.removeCartItem,
    updateCartItem: CartLogic.updateCartItem,
    clearCart: CartLogic.clearCart,
    
    // Metode za checkout
    startCheckout: UIManager.startCheckout,
    closeCheckoutModal: UIManager.closeCheckoutModal,
    submitShippingForm: UIManager.submitShippingForm,
    completeOrder: UIManager.completeOrder
};

document.addEventListener('DOMContentLoaded', () => {
    // EmailJS inicijalizacija je deo globalne inicijalizacije
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("WKV419-gz6OQWSgRJ"); // Vaš Public Key
        } else {
             console.error("EmailJS biblioteka nije pronađena. Proverite link.");
        }
    } catch (e) {
        console.error("Greška pri inicijalizaciji EmailJS:", e);
    }
    
    // Inicijalizacija modula
    ProductData.init();
    CartLogic.init(); 
    UIManager.init();
    
    // Inicijalizacija uvek mora da uključi renderovanje
    UIManager.renderProducts(); 
    CartLogic.updateCartState(); // Poziva updateCartCount i renderCart
    
    console.log("AresNyX modularni šop je spreman.");
});

