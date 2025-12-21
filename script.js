class AresNyXShop {
    
    // =========================================================
    // === KONSTRUKTOR I INICIJALIZACIJA ===
    // =========================================================
    constructor() {
        console.log("🛍️ AresNyXShop constructor started");
        
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.filteredProducts = []; 
        this.currentMaterialFilter = 'all'; 
        this.currentSizeFilter = 'all';     
        this.currentSort = 'default'; 
        this.currentProduct = null;
        this.checkoutData = {};
        this.currentSize = null;
        this.currentQuantity = 1;
        this.currentImageIndex = 0;
        
        this.init(); 
    }

    init() {
        console.log("🔄 Initializing shop...");
        
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 
        this.attachEventListeners();

        // EMAILJS INICIJALIZACIJA SA VAŠIM PUBLIC KLJUČEM
        try {
            emailjs.init("WKV419-gz6OQWSgRJ");
            console.log("✅ EmailJS initialized");
        } catch (e) {
            console.error("EmailJS biblioteka nije pronađena ili nije inicijalizovana.");
        }
        
        console.log("✅ Shop initialization complete");
    } 
    
    // =========================================================
    // === POMOĆNE METODE ZA OBRADU PODATAKA ===
    // =========================================================

    /**
     * Učitava proizvode u memoriju.
     */
    loadProducts() {
        console.log("📦 Loading products...");
        this.products = [
            { 
                id: 1, 
                name: "Classic Pamuk", 
                material: "100% Organski Pamuk", 
                price: 1300, 
                category: "pamuk", 
                images: ["slika1.webp", "slika1a.webp"],
                badge: "CLASSIC",
                sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 } 
            },
            { 
                id: 2, 
                name: "Egipt Pamuk", 
                material: "100% Premium Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika2.webp", "slika2a.webp"], 
                badge: "BESTSELLER",
                sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: 8 } 
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
                name: "Grey Elegant", 
                material: "100% Premium Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika4.webp", "slika4a.webp"], 
                badge: "PREMIUM",
                sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 } 
            },
            { 
                id: 5, 
                name: "Ink Blue", 
                material: "100% Organski Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika5.webp", "slika5a.webp"],
                badge: "LUXURY",
                sizes: { S: 2, M: 3, L: 0, XL: 0, XXL: 1 } 
            },
            { 
                id: 6, 
                name: "Blue White", 
                material: "100% Premium Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika6.webp", "slika6a.webp"], 
                badge: "TRENDING",
                sizes: { S: 8, M: 8, L: 8, XL: 8, XXL: 8 } 
            },
            { 
                id: 7, 
                name: "Black & White", 
                material: "100% Premium Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika7.webp", "slika7a.webp"], 
                badge: "LUXURY",
                sizes: { S: 6, M: 6, L: 6, XL: 6, XXL: 6 } 
            },
            { 
                id: 8, 
                name: "Light Blue", 
                material: "100% Premium Pamuk", 
                price: 1400, 
                category: "100% Pamuk", 
                images: ["slika8.webp", "slika8a.webp"], 
                badge: "NEW",
                sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 } 
            },
            { 
                id: 9, 
                name: "Blue", 
                material: "100% Premium Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika9.webp", "slika9a.webp"],
                badge: "PREMIUM",
                sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 1 } 
            },
            { 
                id: 10, 
                name: "Petrol Blue", 
                material: "100% Arabic Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika10.webp", "slika10a.webp"],
                badge: "LUXURY",
                sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 0 } 
            },
            { 
                id: 11, 
                name: "Grey White", 
                material: "100% Organski Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika11.webp", "slika11a.webp"], 
                badge: "PREMIUM",
                sizes: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 } 
            }
        ];
        
        this.filteredProducts = [...this.products]; 
        console.log(`✅ Loaded ${this.products.length} products`);
    }

    /**
     * Postavlja CSS klasu za badge na osnovu teksta (za stilizaciju boje).
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
    }
    
    /**
     * Proverava da li su artikli u korpi još dostupni u traženoj količini.
     */
    validateStock() {
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

    /**
     * Postavlja sve event listenere koji nisu inline u HTML-u.
     */
    attachEventListeners() {
        console.log("🔗 Attaching event listeners...");
        
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    this.currentSizeFilter = size;
                }
            });
        }

        // Inicijalizacija dimenzija modala
        this.initDimensionsModal();
        
        console.log("✅ Event listeners attached");
    }

    /**
     * Otvara/zatvara panel za filtere.
     */
    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel.classList.toggle('active');
    }

    /**
     * Ažurira stanje filtera/sortiranja.
     */
    filterProducts(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } else if (filterType === 'size') {
            this.currentSizeFilter = value;
            
            document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
            if (value !== 'all') {
                document.querySelector(`.size-btn[data-size="${value}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.size-btn[data-size="all"]`)?.classList.add('active');
            }
        }
    }

    /**
     * Ažurira stanje sortiranja.
     */
    sortProducts(sortType) {
        this.currentSort = sortType;
    }

    /**
     * Pokreće kompletnu logiku filtera nakon klika na dugme "Primeni filtere".
     */
    applyAllFilters() {
        this.toggleFilterPanel();

        const materialValue = document.getElementById('materialFilter').value;
        const sortValue = document.getElementById('priceSort').value;
        
        this.currentMaterialFilter = materialValue;
        this.currentSort = sortValue;
        
        this.applyFiltersAndSort(); 
    }

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

        // 4. PRIKAZ REZULTATA
        this.renderProducts();
    }

    /**
     * Renderuje listu proizvoda na stranicu.
     * Uključuje sigurnosnu proveru za materijal.
     */
    renderProducts() {
        console.log("🎨 Rendering products...");
        console.log("📊 Products to render:", this.filteredProducts.length);
        
        const grid = document.getElementById('productsGrid');
        
        if (!grid) {
            console.error('❌ CRITICAL: HTML element #productsGrid nije pronađen!');
            console.error('Please check if <div id="productsGrid"> exists in HTML');
            
            // Emergency fallback - show error message
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.innerHTML += `
                    <div style="background: #f8d7da; color: #721c24; padding: 20px; margin: 20px; border-radius: 5px;">
                        <h3>❌ Greška u prikazu proizvoda</h3>
                        <p>Element #productsGrid nije pronađen. Proverite HTML strukturu.</p>
                        <p>Trenutno dostupno proizvoda: ${this.filteredProducts.length}</p>
                    </div>
                `;
            }
            return;
        }

        if (!this.filteredProducts || this.filteredProducts.length === 0) {
            grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
            console.log("ℹ️ No products to display");
            return;
        }
        
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
        
        console.log("🖼️ Base image URL:", BASE_IMAGE_URL);
        
        const productsHTML = this.filteredProducts.map(product => {
            const imageSrc = BASE_IMAGE_URL + product.images[0]; 
            const badgeClass = this.getBadgeClass(product.badge);

            return `
              <div class="product-card" data-id="${product.id}" onclick="shop.openProductModal(${product.id})">
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                
                <img src="${imageSrc}" 
                    alt="${product.name}" 
                    class="product-image"
                    loading="lazy"
                    width="300"
                    height="400"> 

                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    
                    ${product.material ? `<p class="product-material">${product.material}</p>` : ''}
                    
                    <p class="product-price">${product.price} RSD</p> 
                </div>
            </div>
            `;
        }).join('');
        
        grid.innerHTML = productsHTML;
        console.log(`✅ Rendered ${this.filteredProducts.length} products`);
    }
    // =========================================================
    // === METODE ZA FILTRIRANJE, SORTIRANJE I RENDER (FIXED) ===
    // =========================================================

    /**
     * Postavlja event listenere. Uklonjena dupla inicijalizacija dimenzija.
     */
    attachEventListeners() {
        console.log("🔗 Attaching event listeners...");
        
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentSizeFilter = size;
                }
            });
        }
        
        // Isključen initDimensionsModal jer sada koristimo openDimensionsFromBtn unutar modala
        console.log("✅ Event listeners attached");
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        if(panel) panel.classList.toggle('active');
    }

    /**
     * Objedinjena funkcija za promenu stanja filtera
     */
    filterProducts(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } else if (filterType === 'size') {
            this.currentSizeFilter = value;
            // Vizuelno ažuriranje dugmića ako se pozove van applyAllFilters
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.size === value);
            });
        }
    }

    sortProducts(sortType) {
        this.currentSort = sortType;
    }

    /**
     * Čisti i primenjuje sve filtere odjednom
     */
    applyAllFilters() {
        this.toggleFilterPanel();

        // Uzimamo vrednosti direktno iz DOM elemenata pre filtriranja
        const materialEl = document.getElementById('materialFilter');
        const sortEl = document.getElementById('priceSort');
        
        if(materialEl) this.currentMaterialFilter = materialEl.value;
        if(sortEl) this.currentSort = sortEl.value;
        
        this.applyFiltersAndSort(); 
    }

    applyFiltersAndSort() {
        // Počinjemo od svih proizvoda
        let tempProducts = [...this.products];

        // 1. Filter materijal
        if (this.currentMaterialFilter !== 'all') {
             tempProducts = tempProducts.filter(p => p.category === this.currentMaterialFilter);
        }

        // 2. Filter veličina
        if (this.currentSizeFilter !== 'all') {
            tempProducts = tempProducts.filter(p => 
                p.sizes && p.sizes[this.currentSizeFilter] > 0
            );
        }
        
        // 3. Sortiranje
        if (this.currentSort === 'lowToHigh') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === 'highToLow') {
            tempProducts.sort((a, b) => b.price - a.price);
        }

        this.filteredProducts = tempProducts;
        this.renderProducts();
    }

    /**
     * Renderuje grid proizvoda. Optimizovano za brzinu i čistiji HTML.
     */
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (this.filteredProducts.length === 0) {
            grid.innerHTML = '<p class="no-results">Nema dostupnih proizvoda prema izabranom filteru.</p>';
            return;
        }
        
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
        
        grid.innerHTML = this.filteredProducts.map(product => {
            const badgeClass = this.getBadgeClass(product.badge || '');
            return `
              <div class="product-card" onclick="shop.openProductModal(${product.id})">
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                <img src="${BASE_IMAGE_URL + product.images[0]}" 
                    alt="${product.name}" 
                    class="product-image" 
                    loading="lazy"> 
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-material">${product.material}</p>
                    <p class="product-price">${product.price} RSD</p> 
                </div>
            </div>
            `;
        }).join('');
    }

    // =========================================================
    // === METODE ZA CHECKOUT I FORME ===
    // =========================================================

    getPaymentMethodText(method) {
        switch (method) {
            case 'pouzecem': return 'Pouzećem (Plaćanje prilikom preuzimanja)';
            case 'racun': return 'Uplata na račun (E-banking)';
            case 'licno': return 'Lično preuzimanje (dogovor)';
            default: return 'Nepoznato';
        }
    }

    startCheckout() {
        if (this.cart.length === 0) {
            this.showToast("Vaša korpa je prazna!");
            return;
        }
        this.toggleCart(); 
        this.goToStep(1);
        document.getElementById('checkoutModal').style.display = 'block';
        document.body.classList.add('checkout-open');
    }

    closeCheckoutModal() {
        document.getElementById('checkoutModal').style.display = 'none';
        document.body.classList.remove('checkout-open');
        this.goToStep(1); 
    }

    goToStep(step) {
        document.getElementById('checkoutStep1').style.display = step === 1 ? 'block' : 'none';
        document.getElementById('checkoutStep2').style.display = step === 2 ? 'block' : 'none';
        document.getElementById('checkoutStep3').style.display = step === 3 ? 'block' : 'none';
    }

    submitShippingForm(event) {
        event.preventDefault();

        this.checkoutData = {
            ime: document.getElementById('ime').value,
            prezime: document.getElementById('prezime').value,
            email: document.getElementById('email').value,
            telefon: document.getElementById('telefon').value,
            ulica: document.getElementById('ulica').value,
            postanskiBroj: document.getElementById('postanskiBroj').value,
            grad: document.getElementById('grad').value,
            opstina: document.getElementById('opstina').value,
            placanje: document.getElementById('placanje').value,
            napomena: document.getElementById('napomena').value
        };

        document.getElementById('previewIme').innerHTML = `<strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}`;
        document.getElementById('previewEmail').innerHTML = `<strong>Email:</strong> ${this.checkoutData.email}`;
        document.getElementById('previewTelefon').innerHTML = `<strong>Telefon:</strong> ${this.checkoutData.telefon}`;
        document.getElementById('previewAdresa').innerHTML = `<strong>Adresa:</strong> ${this.checkoutData.ulica}`;
        document.getElementById('previewPostaGrad').innerHTML = `<strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`;
        document.getElementById('previewPlacanje').innerHTML = `<strong>Plaćanje:</strong> ${this.getPaymentMethodText(this.checkoutData.placanje)}`;
        document.getElementById('previewNapomena').innerHTML = `<strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene.'}`;

        this.renderPreviewOrderItems();
        this.updateCartTotals(true);

        this.goToStep(2); 
    }

    renderPreviewOrderItems() {
        const container = document.getElementById('previewOrderItems');
        container.innerHTML = this.cart.map(item => `
            <div class="preview-item">
                <span style="font-weight: 700;">${item.quantity}x ${item.name} (${item.size})</span>
                <span style="float: right;">${item.price * item.quantity} RSD</span>
            </div>
        `).join('');
    }

    formatOrderItemsForEmail() {
        if (this.cart.length === 0) return '<p>Nema stavki u porudžbini.</p>';

        let html = '<div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; background: #f9f9f9;">';
        this.cart.forEach(item => {
            const total = item.quantity * item.price;
            html += `
                <div style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                    <p style="font-size: 16px; font-weight: bold; color: #121212; margin: 0 0 5px 0;">${item.name}</p>
                    <p style="font-size: 14px; margin: 0;">Veličina: <strong>${item.size}</strong></p>
                    <p style="font-size: 14px; margin: 0;">Količina: ${item.quantity} kom.</p>
                    <p style="font-size: 14px; margin: 0;">Jedinična cena: ${item.price} RSD</p>
                    <p style="font-size: 14px; font-weight: bold; margin: 5px 0 0 0; color: #D4AF37;">Ukupno za stavku: ${total} RSD</p>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }
    
    // =========================================================
    // === completeOrder() FUNKCIJA (FINALNA) ===
    // =========================================================
    completeOrder() {
        if (!this.checkoutData.email) {
            this.showToast("Greška: Podaci kupca nisu popunjeni.");
            return;
        }
        
        const ADMIN_MAIL = 'ares.nyx.info@gmail.com'; 
        const SENDER_NAME = 'AresNyX Porudžbina';
        const BRAND_NAME = 'AresNyX'; 
        const FREE_SHIPPING_LIMIT = 4000; 
        const DISCOUNT_LIMIT = 8000;
        const baseShipping = 400; 

        document.getElementById('confirmationEmail').textContent = this.checkoutData.email;
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_LIMIT ? 0 : baseShipping);
        const discount = subtotal >= DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + shipping - discount;

        const submitBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;

        // 🛑 VALIDACIJA ZALIHA 🛑
        const stockCheck = this.validateStock();

        if (stockCheck.length > 0) {
            const errorDetails = stockCheck.map(item => 
                `(${item.size}) ${item.name} - ${item.reason}`
            ).join('\n');
            
            console.error(`⚠️ Zalihe nisu dovoljne! \n\n${errorDetails}`);
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            this.showToast("Greška: Nema dovoljno zaliha. Molimo izmenite korpu.");
            
            this.goToStep(1); 
            
            return; 
        }
        
        const templateParams = {
            sender_name: SENDER_NAME, 
            admin_email: ADMIN_MAIL,   
            
            ime_kupca: this.checkoutData.ime,
            prezime_kupca: this.checkoutData.prezime,
            email_kupca: this.checkoutData.email,
            telefon_kupca: this.checkoutData.telefon,
            
            adresa_dostave: `${this.checkoutData.ulica}, ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`,
            
            broj_porudzbine: 'ARX-' + Date.now(), 
            nacin_placanja: this.getPaymentMethodText(this.checkoutData.placanje),
            napomena: this.checkoutData.napomena || 'Nema napomene.',
            
            medjuzbir: `${subtotal} RSD`,
            postarina: `${shipping} RSD`,
            popust: `${discount} RSD`,
            ukupno: `${total} RSD`,
            
            lista_proizvoda: this.formatOrderItemsForEmail(),
            
            poslati_kupcu: this.checkoutData.email,
            
            brend_naziv: BRAND_NAME 
        };
        
        const SERVICE_ID = 'service_rxj533m';
        const ADMIN_TEMPLATE_ID = 'template_5o6etkn';
        const CUSTOMER_TEMPLATE_ID = 'template_u8dh76a';

        const sendAdminPromise = emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams);
        const sendCustomerPromise = emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, templateParams);


        Promise.all([sendAdminPromise, sendCustomerPromise])
            .then((responses) => {
                console.log('Slanje e-mailova uspešno završeno za Admina i Kupca.', responses);
                
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                this.renderCart(); 
                
                this.goToStep(3);
                
                this.showToast("Porudžbina uspešno poslata! Proverite Vaš email.");
            })
            .catch((error) => {
                console.error('Greška pri slanju jedne ili obe porudžbine:', error);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.showToast("Greška pri slanju porudžbine. Molimo kontaktirajte podršku.");
            });
    }

    // =========================================================
    // === DIMENZIJE MODAL FUNKCIONALNOST ===
    // =========================================================

    initDimensionsModal() {
        console.log("📏 Initializing dimensions modal...");
        
        const dimBtn = document.getElementById('dimensionsBtn');
        const dimModal = document.getElementById('dimensionsModal');
        const closeBtn = document.querySelector('.close-modal');
        
        if (!dimBtn || !dimModal) {
            console.warn('⚠️ Elementi za dimenzije nisu pronađeni');
            return;
        }
        
        // KLIK NA DUGME ZA DIMENZIJE
        dimBtn.addEventListener('click', () => {
            console.log("📐 Dimensions button clicked");
            
            const size = dimBtn.dataset.size;
            if (!size) {
                console.warn("No size selected for dimensions");
                return;
            }
            
            const dim = this.dimenzije[size];
            if (!dim) {
                console.error("No dimensions data for size:", size);
                return;
            }
            
            document.getElementById('selectedSizeLabel').textContent = size;
            document.getElementById('dimStruk').textContent = dim.struk;
            document.getElementById('dimKuk').textContent = dim.kuk;
            document.getElementById('dimSirina').textContent = dim.sirina;
            document.getElementById('dimDuzina').textContent = dim.duzina;
            
            dimModal.style.display = 'flex';
            console.log("✅ Dimensions modal opened for size:", size);
        });
        
        // ZATVARANJE MODALA
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                dimModal.style.display = 'none';
                console.log("❌ Dimensions modal closed");
            });
        }
        
        // KLIK VAN MODALA
        dimModal.addEventListener('click', (e) => {
            if (e.target === dimModal) {
                dimModal.style.display = 'none';
            }
        });
        
        console.log("✅ Dimensions modal initialized");
    }

    // Podaci o dimenzijama
    dimenzije = {
        "S": {"struk":"76-81cm","kuk":"85-90cm","sirina":"12cm","duzina":"39cm"},
        "M": {"struk":"81-86cm","kuk":"90-95cm","sirina":"13cm","duzina":"40cm"},
        "L": {"struk":"86-91cm","kuk":"95-100cm","sirina":"14cm","duzina":"41cm"},
        "XL": {"struk":"91-96cm","kuk":"100-105cm","sirina":"15cm","duzina":"42cm"},
        "XXL": {"struk":"96-101cm","kuk":"105-110cm","sirina":"16cm","duzina":"43cm"}
    };
}

// =========================================================
// === POKRETANJE NAKON UČITAVANJA DOM-a ===
// =========================================================

console.log("🚀 script.js loaded - Creating shop instance...");

// Kreiraj globalni shop objekat
window.shop = new AresNyXShop();

// Kada se DOM učita, renderuj proizvode
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM Content Loaded");
    
    if (window.shop && window.shop.renderProducts) {
        console.log("🎨 Calling renderProducts...");
        window.shop.renderProducts();
    } else {
        console.error("❌ Shop not ready when DOM loaded");
    }
});

// Fallback za slučaj da je DOM već učitan
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("⚡ DOM already ready");
    
    setTimeout(() => {
        if (window.shop && window.shop.renderProducts) {
            console.log("🎨 Fallback renderProducts call");
            window.shop.renderProducts();
        }
    }, 100);
}

// Debug funkcija za testiranje
window.debugShop = function() {
    console.log("🔧 Debug shop:");
    console.log("1. Shop object:", window.shop);
    console.log("2. Products count:", window.shop?.products?.length);
    console.log("3. productsGrid element:", document.getElementById('productsGrid'));
    console.log("4. Calling renderProducts...");
    window.shop?.renderProducts();
};
