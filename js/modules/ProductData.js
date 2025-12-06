// js/modules/ProductData.js

// OBAVEZNO: Moramo uvesti UIManager da bismo mu javili da renderuje proizvode nakon filtera
import { UIManager } from './UIManager.js'; 

export const ProductData = {
    // Stanje (Preuzeto iz constructor() i ostalih delova starog koda)
    products: [],
    filteredProducts: [],
    currentMaterialFilter: 'all',
    currentSizeFilter: 'all',
    currentSort: 'default',
    
    init() {
        this.loadProducts();
        // Na startu se filtrirani proizvodi inicijalizuju sa svim proizvodima
        this.filteredProducts = [...this.products]; 
    },

    /**
     * Učitava proizvode (Vaš hardkodirani niz).
     */
    loadProducts() {
        // ⭐ OVDE UMESTITE VAŠ KOMPLETAN NIZ PROIZVODA ⭐
        this.products = [
            // { id: 1, name: "Classic Pamuk", ... },
            // ... ceo niz od 11 proizvoda
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
        // OVA FUNKCIJA NE RADI RENDER, TO RADI UIManager
    },

    /**
     * Ažurira stanje sortiranja.
     */
    updateSortState(sortType) {
        this.currentSort = sortType;
    },

    /**
     * Glavna logika za primenu svih filtera i sortiranja.
     */
    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        // 1. PRIMENA FILTERA PO MATERIJALU
        if (this.currentMaterialFilter !== 'all') {
             tempProducts = tempProducts.filter(p => p.category === this.currentMaterialFilter);
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
     * Proverava da li su artikli u korpi još dostupni u traženoj količini.
     * NAPOMENA: CartLogic će morati da uvozi ovu metodu za Checkout.
     */
    validateStock(cartItems) {
        const unavailableItems = [];

        cartItems.forEach(cartItem => {
            const product = this.products.find(p => p.id === cartItem.productId);

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
    }
};

