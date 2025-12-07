// js/script.js - KONAČNA GLAVNA SKRIPTA

import { UIManager } from './modules/UIManager.js';
import { ProductData } from './modules/ProductData.js';
import { CartLogic } from './modules/CartLogic.js';

// === Glavni ARESNYXSHOP Objekat (Globalni API) ===
// Ovo mapira metode modula na globalni objekat, koji HTML poziva preko onclick="..."
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
    
    // CartLogic metode
    removeCartItem: CartLogic.removeCartItem.bind(CartLogic),
    updateCartItem: CartLogic.updateCartItem.bind(CartLogic),
    clearCart: CartLogic.clearCart.bind(CartLogic),
    
    // ProductData metode
    filterProducts: ProductData.updateFilterState.bind(ProductData), 
    sortProducts: ProductData.updateSortState.bind(ProductData) 
};
// === Inicijalizacija ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicijalizacija Logike i Podataka
    ProductData.init(); 
    CartLogic.init(); // <- UČITAVA PODATKE IZ LOCALSTORAGE
    UIManager.init();
    
    // 2. Ažuriranje Brojača
    // OVAJ RED GARANTUJE DA SE BROJAČ KORPE AŽURIRA ČIM SE PODACI IZ LOCALSTORAGE UČITAJU
    UIManager.updateCartCount(); // <- DODATO
    
    // 3. Inicijalno Renderovanje
    UIManager.renderCart(); 
});
<script src="./js/script.js" type="module"></script> 
</body>
</html>

