/* ------------------------------------------------ */
/* AresNyXShop - Glavni JavaScript Fajl (BEZ FONT AWESOME) */
/* ------------------------------------------------ */

class AresNyXShop {
    
    // =========================================================
    // === KONSTRUKTOR I INICIJALIZACIJA ===
    // =========================================================
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.filteredProducts = [];
        this.currentMaterialFilter = 'all'; 
        this.currentSizeFilter = 'all';     
        this.currentSort = 'default'; 
        this.currentProduct = null;
        this.currentSize = null; 
        this.currentQuantity = 1;
        this.currentImageIndex = 0;
        this.checkoutData = {};
        // Osnovna putanja ka slikama
        this.BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/"; 
        
        this.init(); 
    }

    init() {
        this.loadProducts();   
        this.attachEventListeners();
        
        // Podesavanje pocetnih filtera/sortiranja
        this.applyFiltersAndSort(); 
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 

        // Inicijalizacija EmailJS
        try {
            if (typeof emailjs !== 'undefined' && emailjs.init) {
                 emailjs.init("WKV419-gz6OQWSgRJ"); 
            } else {
                 console.error("EmailJS objekat nije dostupan.");
            }
        } catch (e) {
            console.error("EmailJS inicijalizacija nije uspela:", e);
        }
    } 
    
    // =========================================================
    // === POMOĆNE METODE ZA OBRADU PODATAKA ===
    // =========================================================
    loadProducts() {
        // KOREKCIJA IMENA SLIKA: Slike bi trebalo da imaju smislene nazive
        // Koristim Vaše nazive slika, ali ispravljam očiglednu grešku ('slike2a.webp' u 'slika2a.webp')
        this.products = [
            { id: 1, name: "Classic Pamuk", material: "100% Organski Pamuk", price: 1300, category: "pamuk", images: ["slika1.webp", "slika1a.webp"], badge: "CLASSIC", sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 } },
            { id: 2, name: "Egipt Pamuk", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika2.webp", "slika2a.webp"], badge: "BESTSELLER", sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: 8 } },
            { id: 3, name: "Elegant", material: "100% Prirodni Pamuk", price: 1600, category: "pamuk", images: ["slika3.webp", "slika3a.webp"], badge: "LUXURY", sizes: { S: 7, M: 0, L: 5, XL: 0, XXL: 3 } },
            { id: 4, name: "Grey Elegant", material: "100% Premium Pamuk", price: 1600, category: "pamuk", images: ["slika4.webp", "slika4a.webp"], badge: "PREMIUM", sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 } },
            { id: 5, name: "Ink Blue", material: "100% Organski Pamuk", price: 1500, category: "pamuk", images: ["slika5.webp", "slika5a.webp"], badge: "LUXURY", sizes: { S: 2, M: 3, L: 0, XL: 0, XXL: 1 } },
            { id: 6, name: "Blue White", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika6.webp", "slika6a.webp"], badge: "TRENDING", sizes: { S: 8, M: 8, L: 8, XL: 8, XXL: 8 } },
            { id: 7, name: "Black & White", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika7.webp", "slika7a.webp"], badge: "LUXURY", sizes: { S: 6, M: 6, L: 6, XL: 6, XXL: 6 } },
            { id: 8, name: "Light Blue", material: "100% Premium Pamuk", price: 1400, category: "pamuk", images: ["slika8.webp", "slika8a.webp"], badge: "NEW", sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 } },
            { id: 9, name: "Blue", material: "100% Premium Pamuk", price: 1600, category: "pamuk", images: ["slika9.webp", "slika9a.webp"], badge: "PREMIUM", sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 1 } },
            { id: 10, name: "Petrol Blue", material: "100% Arabic Pamuk", price: 1600, category: "pamuk", images: ["slika10.webp", "slika10a.webp"], badge: "LUXURY", sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 0 } },
            { id: 11, name: "Grey White", material: "100% Organski Pamuk", price: 1500, category: "pamuk", images: ["slika11.webp", "slika11a.webp"], badge: "PREMIUM", sizes: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 } }
        ];
        
        this.filteredProducts = [...this.products]; 
    }

    getBadgeClass(badgeText) {
        const text = badgeText.toUpperCase();
        if (text === "PREMIUM" || text === "LUXURY") {
            return "badge-premium"; 
        } else if (text === "CLASSIC" || text === "BESTSELLER" || text === "ECO" || text === "TRENDING" || text === "NEW") {
            return "badge-classic"; 
        } else {
            return "badge-default"; 
        }
    }
    
    validateStock() {
        // ... (funkcija ostaje ista)
        const unavailableItems = [];
        this.cart.forEach(cartItem => {
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

    // =========================================================
    // === METODE ZA FILTRIRANJE, SORTIRANJE I RENDER ===
    // =========================================================
    attachEventListeners() {
        // Event listeneri za filtere ostaju isti (dobro su napisani za sinhronizaciju)
        const sizeFilterOptionsDesktop = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptionsDesktop) {
            sizeFilterOptionsDesktop.addEventListener('click', (e) => {
                this.handleSizeFilterClick(e);
            });
        }
        
        const sizeFilterOptionsMobile = document.getElementById('sizeFilterOptionsMobile');
        if (sizeFilterOptionsMobile) {
            sizeFilterOptionsMobile.addEventListener('click', (e) => {
                this.handleSizeFilterClick(e);
            });
        }
    }
    
    handleSizeFilterClick(e) {
        // Funkcija je ispravna za sinhronizaciju
        const btn = e.target.closest('.size-btn');
        if (btn && !btn.classList.contains('active')) { 
            const size = btn.dataset.size;
            
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            
            document.querySelectorAll(`.size-btn[data-size="${size}"]`).forEach(b => b.classList.add('active'));
            
            this.currentSizeFilter = size;
        }
    }
    
    // KOREKCIJA: Preimenovanje iz filterProducts() u applyAllFilters()
    // KOREKCIJA: Preimenovanje iz sortProducts() u applyAllFilters()
    // HTML pozivi su shop.applyAllFilters(), shop.filterProducts(), shop.sortProducts() - treba ih ujediniti.
    
    // Funkcije koje se pozivaju iz HTML Select/Buttons moraju biti definisane na objektu.

    // 1. Filter po materijalu (iz Select elementa)
    filterProducts(materialValue) {
        this.currentMaterialFilter = materialValue;
        this.applyFiltersAndSort();
    }
    
    // 2. Sortiranje po ceni (iz Select elementa)
    sortProducts(sortValue) {
        this.currentSort = sortValue;
        this.applyFiltersAndSort();
    }
    
    // 3. Selektovanje veličine (iz Button elemenata - već se radi u handleSizeFilterClick)
    selectFilterSize(element) {
        // Ova funkcija je redundantna zbog event listenera, ali je ostavljamo ako se negde koristi direktno
        const size = element.dataset.size;
        
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.size-btn[data-size="${size}"]`).forEach(b => b.classList.add('active'));
        
        this.currentSizeFilter = size;
    }
    
    // 4. Glavna funkcija za primenu svih filtera (poziva se i iz mobilnog panela)
    applyAllFilters() {
        // KORISTI TRENUTNE VREDNOSTI
        
        // Sinhronizacija select vrednosti ako nije rađena pre klika
        const materialDesktop = document.getElementById('materialFilter');
        const materialMobile = document.getElementById('materialFilterMobile');
        const sortDesktop = document.getElementById('priceSort');
        const sortMobile = document.getElementById('priceSortMobile');

        // Ako su promenjeni Select-ovi, ažuriraj this.currentFilter/Sort
        if (materialDesktop) this.currentMaterialFilter = materialDesktop.value;
        else if (materialMobile) this.currentMaterialFilter = materialMobile.value;

        if (sortDesktop) this.currentSort = sortDesktop.value;
        else if (sortMobile) this.currentSort = sortMobile.value;
        
        this.applyFiltersAndSort(); 
        
        // Zatvori panel ako je mobilni
        const panel = document.getElementById('filterSortPanel');
        if (panel && panel.classList.contains('active')) {
             this.toggleFilterPanel(); 
        }
    }


    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); 
    }

    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        if (this.currentMaterialFilter !== 'all') {
             // Uporedi po category property, koji bi trebao da je uvek lower-case
             tempProducts = tempProducts.filter(p => p.category.toLowerCase() === this.currentMaterialFilter.toLowerCase());
        }

        if (this.currentSizeFilter !== 'all') {
            tempProducts = tempProducts.filter(p => 
                p.sizes && p.sizes[this.currentSizeFilter] > 0
            );
        }
        
        this.filteredProducts = tempProducts;

        if (this.currentSort === 'lowToHigh') {
            this.filteredProducts.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === 'highToLow') {
            this.filteredProducts.sort((a, b) => b.price - a.price);
        }

        this.renderProducts();
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const displayProducts = this.filteredProducts; 

        if (!grid) {
             console.error('HTML element #productsGrid nije pronađen!');
             return;
        }

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = displayProducts.map(product => {
            
            // Ispravna putanja - kritičan deo
            const mainImageName = product.images[0];
            const imageSrc = this.BASE_IMAGE_URL + mainImageName; 
            const badgeClass = this.getBadgeClass(product.badge);

            const srcset = product.images.map((imgName, index) => {
                const width = (index === 0) ? '800w' : '400w'; 
                return `${this.BASE_IMAGE_URL}${imgName} ${width}`;
            }).join(', ');
            
            return `
              <div class="product-card" data-id="${product.id}" onclick="shop.openProductModal(${product.id})">
        
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                
                <img src="${imageSrc}" 
                    alt="${product.name}" 
                    srcset="${srcset}"
                    sizes="(min-width: 992px) 33vw, (min-width: 576px) 50vw, 100vw"
                    class="product-image"
                    width="400" 
                    height="400"
                    loading="lazy"> 

                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    
                    ${product.material ? `<p class="product-material">${product.material}</p>` : ''}
                    
                    <p class="product-price">${product.price} RSD</p> 
                </div>
            </div>
        `;
        }).join('');
    }

    // =========================================================
    // === METODE ZA MODAL I KORPU (Unicoded) ===
    // =========================================================

    openProductModal(productId) {
        this.currentProduct = this.products.find(p => p.id === productId);
        if (!this.currentProduct) return;

        this.currentSize = null; 
        this.currentQuantity = 1;
        this.currentImageIndex = 0;

        // KREIRANJE HTML-a za modal ako ne postoji
        let modalHtml = document.getElementById('productModal').innerHTML;
        if (!modalHtml || modalHtml.trim() === '') {
            document.getElementById('productModal').innerHTML = `
                <div class="modal-content">
                    <span class="modal-close" onclick="shop.closeModal()">&times;</span>
                    <div class="modal-image-container">
                        <img id="modalMainImage" src="" alt="Slika proizvoda" class="modal-image">
                        <div class="slider-nav">
                            <button id="prevImageBtn" onclick="shop.prevImage()">&lt;</button>
                            <button id="nextImageBtn" onclick="shop.nextImage()">&gt;</button>
                        </div>
                    </div>
                    <div class="modal-details">
                        <div>
                            <h2 class="modal-title" id="modalTitle"></h2>
                            <p class="modal-material" id="modalMaterial"></p>
                            <p class="modal-price" id="modalPrice"></p>
                            <p class="modal-description" id="modalDescription">Detaljan opis proizvoda ovde...</p>

                            <div class="size-selection-wrapper">
                                <h4>Izaberite veličinu:</h4>
                                <div id="sizeSelector"></div>
                            </div>

                            <div class="quantity-controls">
                                <span>Količina:</span>
                                <button onclick="shop.changeQuantity(-1)" title="Smanji količinu">−</button>
                                <span id="modalQty">1</span>
                                <button onclick="shop.changeQuantity(1)" title="Povećaj količinu">+</button>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-primary add-to-cart-btn" onclick="shop.addToCartFromModal(event)">🛒 Dodaj u Korpu</button>
                            <div class="size-table-toggle" onclick="shop.toggleSizeTable()">Tabela veličina</div>
                            <table id="sizeTable" style="display: none;">
                                <thead>
                                    <tr><th>Veličina</th><th>Obim (cm)</th><th>Dužina (cm)</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>S</td><td>70-75</td><td>30</td></tr>
                                    <tr><td>M</td><td>76-85</td><td>32</td></tr>
                                    <tr><td>L</td><td>86-95</td><td>34</td></tr>
                                    <tr><td>XL</td><td>96-105</td><td>36</td></tr>
                                    <tr><td>XXL</td><td>106-115</td><td>38</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }

        // Ažuriranje postojećih elemenata modala
        document.getElementById('modalTitle').textContent = this.currentProduct.name;
        document.getElementById('modalMaterial').textContent = this.currentProduct.material;
        document.getElementById('modalPrice').textContent = `${this.currentProduct.price} RSD`;
        // Dodavanje opisa, ako postoji
        const descriptionElem = document.getElementById('modalDescription');
        if (descriptionElem) descriptionElem.textContent = this.currentProduct.description || "Premium bokserice kreirane za maksimalnu udobnost.";

        document.getElementById('modalQty').textContent = '1';

        this.updateModalImage();

        const sizeSelector = document.getElementById('sizeSelector');
        let firstAvailableSize = null;

        const sizesHtml = Object.keys(this.currentProduct.sizes)
            .map(size => {
                const stock = this.currentProduct.sizes[size]; 
                const isDisabled = stock === 0; 
                
                if (!isDisabled && !firstAvailableSize) {
                    firstAvailableSize = size;
                }

                return `
                    <button 
                        class="size-option ${isDisabled ? 'disabled' : ''}"
                        data-size="${size}" 
                        onclick="shop.selectSize(event, '${size}', ${isDisabled})" 
                        ${isDisabled ? 'disabled' : ''}
                        title="Dostupno: ${stock} kom. - ${isDisabled ? 'RASPRODATO' : 'Dostupno'}"
                    >
                        ${size}${isDisabled ? ' (Nema)' : ''}
                    </button>
                `;
            })
            .join('');
            
        sizeSelector.innerHTML = sizesHtml;
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
        } else {
             this.currentSize = null;
        }
        
        const btn = document.querySelector('#productModal .add-to-cart-btn');
        if (!firstAvailableSize) {
             btn.disabled = true;
             btn.innerHTML = '✖ RASPRODATO'; 
             btn.style.background = 'var(--danger)';
        } else {
            btn.innerHTML = '🛒 Dodaj u Korpu'; 
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        }

        document.getElementById('sizeTable').style.display = 'none'; // Uvek sakrij tabelu na početku
        document.getElementById('productModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    }
    
    // ... (Ostale metode ostaju nepromenjene jer su ispravne i unicoded) ...
    // updateModalImage()
    // selectSize()
    // changeQuantity()
    // prevImage()
    // nextImage()
    // addToCartFromModal()
    // addToCart()
    // updateCartCount()
    // toggleCartVisibility()
    // renderCart() - proveriti samo da li postoji cartSidebar
    // renderCartFooter()
    // updateCartItem()
    // removeCartItem()
    // updateCartPromoMessage()
    // updateCartTotals()
    // clearCart()
    // saveCart()
    // showToast()
    // closeModal()
    // toggleCart()
    // toggleSizeTable()
    // getPaymentMethodText()
    // startCheckout()
    // closeCheckoutModal()
    // goToStep()
    // submitShippingForm()
    // renderPreviewOrderItems()
    // formatOrderItemsForEmail()
    // completeOrder()

} 

// =========================================================
// === POKRETANJE NAKON UČITAVANJA DOM-a ===
// =========================================================
let shop;

document.addEventListener('DOMContentLoaded', () => {
    // Provera da li je script.js učitan, ako jeste pokreni AresNyxShop
    if (typeof AresNyXShop !== 'undefined') {
         shop = new AresNyXShop(); 
    } else {
        console.error("AresNyXShop klasa nije definisana. Greška u učitavanju skripte.");
    }
});

