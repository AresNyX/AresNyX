// js/modules/ProductData.js

import { UIManager } from './UIManager.js'; 

export const ProductData = {
    // Stanje za proizvode i filtere
    products: [],
    filteredProducts: [],
    currentMaterialFilter: 'all',
    currentSizeFilter: 'all',
    currentSort: 'default',
    
    init() {
        this.loadProducts();
        this.filteredProducts = [...this.products]; 
        this.applyFiltersAndSort(); // Pokreće inicijalno renderovanje
    },

    /**
     * Učitava proizvode u memoriju. (PREUZETO IZ STARE KLASE)
     */
    loadProducts() {
        this.products = [
            { 
                id: 1, 
                name: "Classic Pamuk", 
                material: "100% Organski Pamuk", 
                price: 1300, 
                category: "pamuk", 
                images: ["slika1.webp", "slika1a.webp"],
                badge: "BESTSELLER",
                sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 }
            },
            { 
                id: 2, 
                name: "Egipt Pamuk", 
                material: "100% Premium Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika2.webp", "slike2a.webp"], 
                badge: "BESTSELLER",
                sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: }
            },
            { 
                id: 3, 
                name: "Elegant", 
                material: "100% Prirodni Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika3.webp", "slika3a.webp"], 
                badge: "LUXURY",
                sizes: { S: 7, M: 0, L: 5, XL: 0, XXL: 3 }
            },
            { 
                id: 4, 
                name: "Tamno Sivo", 
                material: "100% Premium Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika4.webp", "slika4a.webp"], 
                badge: "PREMIUM",
                sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 } 
                
            },
            { 
                id: 5, 
                name: "Mastilo Plavo", 
                material: "100% Organski Pamuk", 
                price: 1700, 
                category: "pamuk", 
                images: ["slika5.webp", "slika5a.webp"],
                badge: "LUXURY",
                sizes: { S: 2, M: 3, L: 0, XL: 0, XXL: 1 } 
                
            },
            { 
                id: 6, 
                name: "Plavo Bele Prugice", 
                material: "100% Premium Pamuk", 
                price: 1400, 
                category: "pamuk", 
                images: ["slika6.webp", "slika6a.webp"], 
                badge: "TRENDING",
                sizes: { S: 8, M: 8, L: 8, XL: 8, XXL: 8 } 
                
            },
            { 
                id: 7, 
                name: "Karirano Crno Belo", 
                material: "100% Premium Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika7.webp", "slika7a.webp"], 
                badge: "LUXURY",
                sizes: { S: 6, M: 6, L: 6, XL: 6, XXL: 6 } 
                
            },
            { 
                id: 8, 
                name: "Svetlo Plavo", 
                material: "100% Premium Pamuk", 
                price: 1400, 
                category: "Pima Pamuk", 
                images: ["slika8.webp", "slika8a.webp"], 
                badge: "NEW",
                sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 } 
                
            },
            { 
                id: 9, 
                name: "Petrolej Plavo", 
                material: "100% Premium Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika9.webp", "slika9a.webp"],
                badge: "PREMIUM",
                sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 1 }
            
            },
            { 
                id: 10, 
                name: "Teget", 
                material: "100% Arabic Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika10.webp", "slika10a.webp"],
                badge: "LUXURY",
                sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 0 } 
            
            },
            { 
                id: 11, 
                name: "Tamne pruge", 
                material: "100% Organski Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika11.webp", "slika11a.webp"], 
                badge: "PREMIUM",
                sizes: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 } 
    
            }
        ];
    },

    /**
     * Postavlja CSS klasu za badge na osnovu teksta.
     */
    getBadgeClass(badgeText) {
        const text = badgeText.toUpperCase();
        if (text === "PREMIUM" || text === "LUXURY") {
            return "badge-premium"; 
        } else if (text === "CLASSIC" || text === "BESTSELLER" || text === "ECO") {
            return "badge-classic"; 
        } else {
            return "badge-default"; 
        }
    },
    
    /**
     * Ažurira stanje filtera/sortiranja.
     */
    updateFilterState(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } else if (filterType === 'size') {
            this.currentSizeFilter = value;
        }
    },

    /**
     * Ažurira stanje sortiranja.
     */
    updateSortState(sortType) {
        this.currentSort = sortType;
    },

    /**
     * Glavna logika za primenu svih filtera i sortiranja. (PREUZETO)
     */
    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        // 1. PRIMENA FILTERA PO MATERIJALU
        if (this.currentMaterialFilter !== 'all') {
             // NAPOMENA: Vaš filter trenutno traži P.CATEGORY, a neki su "Pima Pamuk". 
             // Možda je bolje koristiti product.material.toLowerCase().includes(this.currentMaterialFilter)
             tempProducts = tempProducts.filter(p => p.category.toLowerCase().includes(this.currentMaterialFilter));
        }

        // 2. PRIMENA FILTERA PO VELIČINI
        if (this.currentSizeFilter !== 'all') {
            tempProducts = tempProducts.filter(p => 
                p.sizes && p.sizes[this.currentSizeFilter] > 0
            );
        }
        
        this.filteredProducts = tempProducts;

        // 3. PRIMENA SORTIRANJA
        if (this.currentSort === 'lowToHigh') {
            this.filteredProducts.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === 'highToLow') {
            this.filteredProducts.sort((a, b) => b.price - a.price);
        }

        // 4. POZIVANJE UIManager-a za prikaz rezultata
        UIManager.renderProducts(); 
    },

    /**
     * Proverava da li su artikli u korpi još dostupni u traženoj količini. (PREUZETO)
     * NAPOMENA: Ovu metodu koristi CartLogic za Checkout.
     */
    validateStock(cartItems) {
        const unavailableItems = [];

        cartItems.forEach(cartItem => {
            const product = this.products.find(p => p.id === cartItem.productId);
            // ... (ostatak logike je ispravan)
            if (!product) {
                unavailableItems.push({ name: cartItem.name, size: cartItem.size, reason: 'Proizvod više ne postoji u katalogu.' });
                return;
            }
            
            const availableStock = product.sizes[cartItem.size] || 0; 

            if (cartItem.quantity > availableStock) {
                unavailableItems.push({ 
                    name: cartItem.name, 
                    size: cartItem.size, 
                    reason: `Traženo: ${cartItem.quantity}, Dostupno: ${availableStock}.` 
                });
            }
        });

        return unavailableItems;
    },

    // Dodato: Getter za dohvat proizvoda po ID-u
    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }
};
