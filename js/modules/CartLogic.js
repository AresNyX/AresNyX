// js/modules/CartLogic.js

import { ProductData } from './ProductData.js';
import { UIManager } from './UIManager.js';
import { showToast } from './Utilities.js';

export const CartLogic = {
    // Stanje korpe
    cart: [],
    
    // Inicijalizacija: učitavanje korpe iz localStorage
    init() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    },

    // Ažuriranje prikaza (poziva UIManager)
    updateCartState() {
        UIManager.updateCartCount(); // Ažurira brojač u headeru
        UIManager.renderCart();      // Renderuje stavke unutar sidebara
        this.updateCartTotals();     // Ažurira ukupne cene
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    addToCart(productId, size, quantity) {
        // Koristimo ProductData za pronalaženje detalja
        const product = ProductData.products.find(p => p.id === productId); 
        if (!product) return;

        const existingItem = this.cart.find(item => item.productId === productId && item.size === size);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
            const imageURL = BASE_IMAGE_URL + product.images[0];

            this.cart.push({ 
                productId, 
                size, 
                quantity, 
                name: product.name, 
                price: product.price, 
                image: imageURL 
            });
        }

        this.saveCart();
        this.updateCartState(); // Ažurira prikaz
    },

    updateCartItem(productId, size, change) {
        const item = this.cart.find(i => i.productId === productId && i.size === size);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeCartItem(productId, size); 
            return;
        }
        
        this.saveCart();
        this.updateCartState();
        showToast(change > 0 ? "Količina povećana" : "Količina smanjena");
    },

    removeCartItem(productId, size) {
        const index = this.cart.findIndex(i => i.productId === productId && i.size === size);
        if (index > -1) {
            const itemName = this.cart[index].name;
            this.cart.splice(index, 1);
            this.saveCart();
            
            // Renderovanje uklanjanja elementa je u UIManager
            this.updateCartState(); 
            showToast(`"${itemName}" je uklonjen iz korpe`);
        }
    },
    
    // =========================================================
    // === METODE ZA UKUPNE IZNOSE (TOTALS) ===
    // =========================================================

    updateCartPromoMessage(subtotal) {
        // Logika premeštena iz starog koda
        const promoBar = document.getElementById('promoBar');
        const cartPromo = document.getElementById('cartPromoMessage');

        const FREE_SHIPPING_LIMIT = 4000;
        const DISCOUNT_LIMIT = 8000;
        
        if (!cartPromo) return;

        if (subtotal >= DISCOUNT_LIMIT) {
            cartPromo.classList.add('success');
            cartPromo.innerHTML = '✅ Ostvarili ste <strong>Besplatnu dostavu</strong> i <strong>10% Popusta</strong>!';
        } else if (subtotal >= FREE_SHIPPING_LIMIT) {
            const nextTarget = DISCOUNT_LIMIT - subtotal;
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `🔥 Ostvarili ste <strong>BESPLATNU DOSTAVU</strong>! Dodajte još <strong>${nextTarget} RSD</strong> za 10% Popusta!`;
        } else {
            const nextTarget = FREE_SHIPPING_LIMIT - subtotal;
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `Dodajte još <strong>${nextTarget} RSD</strong> do Besplatne dostave!`;
        }
    },

    updateCartTotals(preview = false) {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const FREE_SHIPPING_LIMIT = 4000;
        const DISCOUNT_LIMIT = 8000;
        const baseShipping = 400;

        const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_LIMIT ? 0 : baseShipping);
        const discount = subtotal >= DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        
        const total = subtotal + shipping - discount;
        
        // Renderovanje totala se delegira UIManager-u
        UIManager.renderTotals(subtotal, shipping, discount, total, preview); 
        
        if (!preview) {
            this.updateCartPromoMessage(subtotal);
        }
        
        return { subtotal, shipping, discount, total };
    },

    clearCart() {
        if (this.cart.length === 0) {
            showToast("Korpa je već prazna!");
            return;
        }
        
        if (confirm("Da li ste sigurni da želite da ispraznite korpu? Ova akcija se ne može poništiti.")) {
            this.cart = [];
            this.saveCart();
            this.updateCartState(); 
            showToast("Korpa je ispražnjena!");
        }
    }
};

