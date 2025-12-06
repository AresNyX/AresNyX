// js/modules/CartLogic.js

import { UIManager } from './UIManager.js';
import { ProductData } from './ProductData.js'; // Potrebno za podatke o proizvodu

export const CartLogic = {
    cart: [],
    
    init() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    /**
     * Logika dodavanja u korpu (PREUZETO)
     */
    addToCart(productId, size, quantity) {
        const product = ProductData.getProductById(productId);
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
        UIManager.updateCartCount(); // Obaveštava UIManager
        UIManager.renderCart(); 
    },
    
    /**
     * Logika ažuriranja artikla u korpi (PREUZETO)
     */
    updateCartItem(productId, size, change) {
        const item = this.cart.find(i => i.productId === productId && i.size === size);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeCartItem(productId, size); 
            return;
        }
        
        this.saveCart();
        UIManager.updateCartCount();
        
        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"][data-size="${size}"]`);
        if(cartItem) {
            cartItem.querySelector('.cart-item-qty').textContent = item.quantity;
            cartItem.querySelector('.cart-item-price').textContent = (item.price * item.quantity) + ' RSD';
        }
        
        UIManager.updateCartTotals();
        UIManager.showToast(change > 0 ? "Količina povećana" : "Količina smanjena");
    },

    /**
     * Logika uklanjanja artikla iz korpe (PREUZETO)
     */
    removeCartItem(productId, size) {
        const index = this.cart.findIndex(i => i.productId === productId && i.size === size);
        const cartItemElement = document.querySelector(`.cart-item[data-id="${productId}"][data-size="${size}"]`);

        if (index > -1) {
            const itemName = this.cart[index].name;
            this.cart.splice(index, 1);
            this.saveCart();
            
            if (cartItemElement) {
                cartItemElement.remove();
            }

            UIManager.updateCartCount(); 
            UIManager.showToast(`"${itemName}" je uklonjen iz korpe`);
            
            if (this.cart.length === 0) {
                UIManager.renderCart(); 
            }
        }
    },

    /**
     * Logika za pražnjenje korpe (PREUZETO)
     */
    clearCart() {
        if (this.cart.length === 0) {
            UIManager.showToast("Korpa je već prazna!");
            return;
        }
        
        if (confirm("Da li ste sigurni da želite da ispraznite korpu? Ova akcija se ne može poništiti.")) {
            this.cart = [];
            this.saveCart();
            UIManager.updateCartCount();
            UIManager.renderCart(); 
            UIManager.showToast("Korpa je ispražnjena!");
        }
    }
};
