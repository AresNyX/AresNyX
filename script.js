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
        this.currentSize = null; // Dodato za modal
        this.currentQuantity = 1; // Dodato za modal
        this.currentImageIndex = 0; // Dodato za modal
        this.checkoutData = {};
        
        // ⭐ KOREKCIJA 2: Dodata BASE_IMAGE_URL u konstruktor ⭐
        this.BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/"; 
        
        this.init(); 
    }

    init() {
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 
        this.attachEventListeners();
        
        // ⭐ KOREKCIJA 1: Pozivamo glavnu logiku filtera odmah na početku ⭐
        this.applyFiltersAndSort(); 

        // EMAILJS INICIJALIZACIJA SA VAŠIM PUBLIC KLJUČEM
        try {
            if (typeof emailjs !== 'undefined' && emailjs.init) {
                 emailjs.init("WKV419-gz6OQWSgRJ"); // Vaš Public Key
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

    /**
     * Učitava proizvode u memoriju.
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
                badge: "CLASSIC",
                sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 } 
            },
            { 
                id: 2, 
                name: "Egipt Pamuk", 
                material: "100% Premium Pamuk", 
                price: 1500, 
                category: "pamuk", 
                // ⭐ KOREKCIJA 4: Ispravljen naziv slike: 'slike2a.webp' u 'slika2a.webp' ⭐
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
                category: "pamuk", // Kategorija mora biti 'pamuk' ili 'lan' itd.
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
    }

    /**
     * Postavlja CSS klasu za badge na osnovu teksta (za stilizaciju boje).
     */
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
        const sizeFilterOptionsDesktop = document.getElementById('sizeFilterOptions');
        const sizeFilterOptionsMobile = document.getElementById('sizeFilterOptionsMobile');
        
        const handler = (e) => {
            const btn = e.target.closest('.size-btn');
            if (btn) {
                const size = btn.dataset.size;
                
                // Sinhronizacija (aktivira dugme na svim mestima)
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll(`.size-btn[data-size="${size}"]`).forEach(b => b.classList.add('active'));
                
                this.currentSizeFilter = size;
                this.applyFiltersAndSort(); // Pokreni filter odmah
            }
        };

        if (sizeFilterOptionsDesktop) {
            sizeFilterOptionsDesktop.addEventListener('click', handler);
        }
        if (sizeFilterOptionsMobile) {
            sizeFilterOptionsMobile.addEventListener('click', handler);
        }
    }

    /**
     * Otvara/zatvara panel za filtere.
     */
    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    /**
     * Ažurira stanje filtera/sortiranja po materijalu (poziva se iz Select-a).
     */
    filterProducts(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } 
        
        // ⭐ KOREKCIJA 1: Pokreće filtriranje odmah nakon promene materijala ⭐
        this.applyFiltersAndSort(); 
    }

    /**
     * Ažurira stanje sortiranja (poziva se iz Select-a).
     */
    sortProducts(sortType) {
        this.currentSort = sortType;
        // ⭐ KOREKCIJA 1: Pokreće filtriranje odmah nakon promene sortiranja ⭐
        this.applyFiltersAndSort();
    }

    /**
     * Pokreće kompletnu logiku filtera nakon klika na dugme "Primeni filtere".
     */
    applyAllFilters() {
        // Sinhronizacija vrednosti iz Select polja
        const materialValue = document.getElementById('materialFilter').value;
        const sortValue = document.getElementById('priceSort').value;
        
        this.currentMaterialFilter = materialValue;
        this.currentSort = sortValue;
        
        this.applyFiltersAndSort(); 
        
        // Zatvori panel nakon primene (za mobilni prikaz)
        const panel = document.getElementById('filterSortPanel');
        if (panel && panel.classList.contains('active')) {
             this.toggleFilterPanel(); 
        }
    }

    /**
     * Glavna logika za primenu svih filtera i sortiranja.
     */
    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        // 1. PRIMENA FILTERA PO MATERIJALU
        if (this.currentMaterialFilter !== 'all') {
             // Uporedi po category property, koji bi trebao da je uvek lower-case
             tempProducts = tempProducts.filter(p => p.category.toLowerCase() === this.currentMaterialFilter.toLowerCase());
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
     */
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const displayProducts = this.filteredProducts; 
        
        // ⭐ KOREKCIJA 2: Koristi this.BASE_IMAGE_URL ⭐
        const BASE_IMAGE_URL = this.BASE_IMAGE_URL; 

        if (!grid) {
             console.error('HTML element #productsGrid nije pronađen!');
             return;
        }

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = displayProducts.map(product => {
            
            const imageSrc = BASE_IMAGE_URL + product.images[0]; 
            const badgeClass = this.getBadgeClass(product.badge);

            const srcset = product.images.map((imgName, index) => {
                const width = (index === 0) ? '800w' : '400w'; 
                return `${BASE_IMAGE_URL}${imgName} ${width}`;
            }).join(', ');
            
            return `
              <div class="product-card" data-id="${product.id}" onclick="shop.openProductModal(${product.id})">
        
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                
                <img src="${imageSrc}" 
                    alt="${product.name}" 
                    srcset="${srcset}"
                    sizes="(min-width: 992px) 33vw, (min-width: 576px) 50vw, 100vw"
                    class="product-image"
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
    // === METODE ZA MODAL I KORPU ===
    // =========================================================

    openProductModal(productId) {
        this.currentProduct = this.products.find(p => p.id === productId);
        if (!this.currentProduct) return;

        this.currentSize = null; 
        this.currentQuantity = 1;
        this.currentImageIndex = 0;

        document.getElementById('modalTitle').textContent = this.currentProduct.name;
        document.getElementById('modalMaterial').textContent = this.currentProduct.material;
        document.getElementById('modalPrice').textContent = `${this.currentProduct.price} RSD`;
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
            // Dodajemo klasu 'selected' odmah na prvi dostupan size
            document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
        } else {
             this.currentSize = null;
        }
        
        const btn = document.querySelector('#productModal .add-to-cart-btn');
        if (!firstAvailableSize) {
             btn.disabled = true;
             btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
             btn.style.background = '#dc3545'; // Dodato da se vidi promena
        } else {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
            btn.style.background = '#4a0e0b'; // Vraćen originalan stil
            btn.disabled = false;
        }

        document.getElementById('sizeTable').style.display = 'none';
        document.getElementById('productModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        // ⭐ KOREKCIJA 2: Koristi this.BASE_IMAGE_URL ⭐
        const BASE_IMAGE_URL = this.BASE_IMAGE_URL;
        document.getElementById('modalMainImage').src = BASE_IMAGE_URL + this.currentProduct.images[this.currentImageIndex];
        
        const totalImages = this.currentProduct.images.length;
        const sliderNav = document.querySelector('.slider-nav');

        if (totalImages > 1) {
            sliderNav.style.display = 'flex'; 
            
            const isFirst = this.currentImageIndex === 0;
            const isLast = this.currentImageIndex === totalImages - 1;
            
            const prevBtn = document.getElementById('prevImageBtn');
            const nextBtn = document.getElementById('nextImageBtn');
            
            if(prevBtn) prevBtn.disabled = isFirst;
            if(nextBtn) nextBtn.disabled = isLast;

        } else if (sliderNav) {
            sliderNav.style.display = 'none'; 
        }
    }
    
    selectSize(event, size, isDisabled) {
        if (isDisabled) return;
        this.currentSize = size;
        document.querySelectorAll('#sizeSelector .size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    }

    changeQuantity(change) {
        // Dodata provera zaliha za trenutno odabranu veličinu
        const maxStock = this.currentProduct.sizes[this.currentSize] || 1;
        
        this.currentQuantity = Math.min(maxStock, Math.max(1, this.currentQuantity + change));
        document.getElementById('modalQty').textContent = this.currentQuantity;
    }

    prevImage() {
        if (!this.currentProduct) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProduct.images.length) % this.currentProduct.images.length;
        this.updateModalImage();
    }

    nextImage() {
        if (!this.currentProduct) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProduct.images.length;
        this.updateModalImage();
    }

    addToCartFromModal(event) {
        if (!this.currentProduct || !this.currentSize) {
             this.showToast("Morate izabrati veličinu!");
             return;
        }
        
        const btn = event.currentTarget;
        if (btn.disabled) return;
        btn.disabled = true;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.background = '#28a745'; // Zeleno
        
        this.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        
        this.updateCartCount();
        this.renderCart(); 
        
        this.showToast(`${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`);
        
        setTimeout(() => {
            this.closeModal();
            btn.innerHTML = originalText;
            btn.style.background = '#4a0e0b'; // Vraćen originalan stil
            btn.disabled = false;
        }, 500); 
    }

    addToCart(productId, size, quantity) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.productId === productId && item.size === size);

        if (existingItem) {
            // Dodata provera zaliha pre dodavanja
            const maxStock = product.sizes[size] || 0;
            const newQuantity = Math.min(maxStock, existingItem.quantity + quantity);
            if (newQuantity <= existingItem.quantity) {
                 this.showToast(`Maksimalno dostupno: ${maxStock}`);
                 return;
            }
            existingItem.quantity = newQuantity;
        } else {
            // ⭐ KOREKCIJA 2: Koristi this.BASE_IMAGE_URL ⭐
            const imageURL = this.BASE_IMAGE_URL + product.images[0];

            this.cart.push({ 
                productId, 
                size, 
                quantity, 
                name: product.name, 
                price: product.price, 
                image: imageURL // Postavljamo punu putanju za renderCart()
            });
        }

        this.saveCart();
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        
        cartCount.textContent = totalItems;
        
        cartCount.classList.remove('quick-pulse'); 
        void cartCount.offsetWidth;
        cartCount.classList.add('quick-pulse');
        
        this.updateCartTotals(); 
        this.toggleCartVisibility();
    }
    
    toggleCartVisibility() {
        const cartFooter = document.getElementById('cartFooter');
        const emptyCart = document.getElementById('emptyCart');
        
        const shouldShowEmpty = this.cart.length === 0;
        
        if (emptyCart) emptyCart.style.display = shouldShowEmpty ? 'block' : 'none';
        if (cartFooter) cartFooter.style.display = shouldShowEmpty ? 'none' : 'block';
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            // Ako je korpa prazna, kreiraj placeholder
            cartItemsContainer.innerHTML = `<div class="empty-cart" id="emptyCart" style="text-align: center; padding: 2rem;"><i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i><p>Vaša korpa je prazna</p></div>`;
            this.toggleCartVisibility(); 
            this.updateCartTotals(); 
            return;
        }
        
        cartItemsContainer.innerHTML = ''; 

        this.cart.forEach((item) => {
            const itemHtml = `
<div class="cart-item" data-id="${item.productId}" data-size="${item.size}">
    <button class="cart-item-remove" onclick="shop.removeCartItem(${item.productId}, '${item.size}')" title="Ukloni proizvod">×</button>
    <img src="${item.image}" alt="${item.name} veličine ${item.size}" class="cart-item-image" loading="lazy">
    <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-size">Veličina: ${item.size}</div>
        <div class="cart-item-controls">
            <div class="cart-item-qty-wrapper">
                <button class="cart-item-qty-btn" onclick="shop.updateCartItem(${item.productId}, '${item.size}', -1)">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="cart-item-qty-btn" onclick="shop.updateCartItem(${item.productId}, '${item.size}', 1)">+</button>
            </div>
            <span class="cart-item-price">${item.price * item.quantity} RSD</span>
        </div>
    </div>
</div>
`;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        this.toggleCartVisibility(); 
        this.updateCartTotals();
    }

    
    updateCartItem(productId, size, change) {
        const item = this.cart.find(i => i.productId === productId && i.size === size);
        if (!item) return;

        const product = this.products.find(p => p.id === productId);
        const maxStock = product ? (product.sizes[size] || 0) : item.quantity; // Domaći proizvod uvek ima maxStock

        let newQuantity = item.quantity + change;
        
        if (newQuantity > maxStock) {
            newQuantity = maxStock;
            this.showToast(`Maksimalno dostupno: ${maxStock}`);
        }
        
        if (newQuantity < 1) {
            this.removeCartItem(productId, size); 
            return;
        }
        
        item.quantity = newQuantity;

        this.saveCart();
        this.updateCartCount();
        
        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"][data-size="${size}"]`);
        if(cartItem) {
            cartItem.querySelector('.cart-item-qty').textContent = item.quantity;
            cartItem.querySelector('.cart-item-price').textContent = (item.price * item.quantity) + ' RSD';
        }
        
        this.updateCartTotals();
        this.showToast(change > 0 ? "Količina povećana" : "Količina smanjena");
    }

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

            this.updateCartCount(); 
            this.showToast(`"${itemName}" je uklonjen iz korpe`);
            
            if (this.cart.length === 0) {
                this.renderCart(); 
            }
        }
    }

    updateCartPromoMessage(subtotal) {
        const cartPromo = document.getElementById('cartPromoMessage');
        if (!cartPromo) return;

        const FREE_SHIPPING_LIMIT = 4000;
        const DISCOUNT_LIMIT = 8000;
        
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
    }

    updateCartTotals(preview = false) {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const FREE_SHIPPING_LIMIT = 4000;
        const DISCOUNT_LIMIT = 8000;
        const baseShipping = 400;

        const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_LIMIT ? 0 : baseShipping);
        const discount = subtotal >= DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        
        const total = subtotal + shipping - discount;
        
        if (preview) {
            if (document.getElementById('previewSubtotal')) document.getElementById('previewSubtotal').textContent = subtotal + ' RSD';
            if (document.getElementById('previewShipping')) document.getElementById('previewShipping').textContent = shipping + ' RSD';
            if (document.getElementById('previewDiscount')) document.getElementById('previewDiscount').textContent = discount + ' RSD';
            if (document.getElementById('previewTotal')) document.getElementById('previewTotal').textContent = total + ' RSD';
        } else {
            if (document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = subtotal + ' RSD';
            if (document.getElementById('cartShipping')) document.getElementById('cartShipping').textContent = shipping + ' RSD';
            if (document.getElementById('cartDiscount')) document.getElementById('cartDiscount').textContent = discount + ' RSD';
            
            const totalElement = document.getElementById('cartTotal');
            if (totalElement) {
                totalElement.textContent = total + ' RSD';

                totalElement.classList.remove('quick-pulse'); 
                void totalElement.offsetWidth; 
                totalElement.classList.add('quick-pulse');
            }
            
            this.updateCartPromoMessage(subtotal);
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showToast("Korpa je već prazna!");
            return;
        }
        
        if (confirm("Da li ste sigurni da želite da ispraznite korpu? Ova akcija se ne može poništiti.")) {
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.renderCart(); 
            this.showToast("Korpa je ispražnjena!");
        }
    }
     
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if(modal) modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    toggleCart() {
         // ⭐ KOREKCIJA 3: Toggle Cart ⭐
         const sidebar = document.getElementById('cartSidebar');
         if (sidebar) sidebar.classList.toggle('active');
         document.body.classList.toggle('no-scroll');
    }

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        if (table) table.style.display = table.style.display === 'none' ? 'block' : 'none';
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
        const modal = document.getElementById('checkoutModal');
        if (modal) modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
        this.goToStep(1); 
    }

    goToStep(step) {
        const step1 = document.getElementById('checkoutStep1');
        const step2 = document.getElementById('checkoutStep2');
        const step3 = document.getElementById('checkoutStep3');

        if(step1) step1.style.display = step === 1 ? 'block' : 'none';
        if(step2) step2.style.display = step === 2 ? 'block' : 'none';
        if(step3) step3.style.display = step === 3 ? 'block' : 'none';
    }

    submitShippingForm(event) {
        event.preventDefault();

        // Jednostavna validacija
        if (!document.getElementById('ime').value || !document.getElementById('email').value || !document.getElementById('ulica').value) {
            this.showToast("Molimo popunite sva obavezna polja!");
            return;
        }
        
        // Prikupljanje podataka
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

        // Renderovanje podataka u pregledu
        if (document.getElementById('previewIme')) document.getElementById('previewIme').innerHTML = `<strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}`;
        if (document.getElementById('previewEmail')) document.getElementById('previewEmail').innerHTML = `<strong>Email:</strong> ${this.checkoutData.email}`;
        if (document.getElementById('previewTelefon')) document.getElementById('previewTelefon').innerHTML = `<strong>Telefon:</strong> ${this.checkoutData.telefon}`;
        if (document.getElementById('previewAdresa')) document.getElementById('previewAdresa').innerHTML = `<strong>Adresa:</strong> ${this.checkoutData.ulica}`;
        if (document.getElementById('previewPostaGrad')) document.getElementById('previewPostaGrad').innerHTML = `<strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`;
        if (document.getElementById('previewPlacanje')) document.getElementById('previewPlacanje').innerHTML = `<strong>Plaćanje:</strong> ${this.getPaymentMethodText(this.checkoutData.placanje)}`;
        if (document.getElementById('previewNapomena')) document.getElementById('previewNapomena').innerHTML = `<strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene.'}`;

        this.renderPreviewOrderItems();
        this.updateCartTotals(true);

        this.goToStep(2); 
    }

    renderPreviewOrderItems() {
        const container = document.getElementById('previewOrderItems');
        if (!container) return;

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
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
            submitBtn.disabled = true;
        }

        // 🛑 VALIDACIJA ZALIHA 🛑
        const stockCheck = this.validateStock();

        if (stockCheck.length > 0) {
            const errorDetails = stockCheck.map(item => 
                `(${item.size}) ${item.name} - ${item.reason}`
            ).join('\n');
            
            console.error(`⚠️ Zalihe nisu dovoljne! \n\n${errorDetails}`);
            
            if (submitBtn) {
                 submitBtn.innerHTML = originalText;
                 submitBtn.disabled = false;
            }
            
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

        if (typeof emailjs === 'undefined' || !emailjs.send) {
             console.error('EmailJS nije ispravno učitan/inicijalizovan. Preskačem slanje.');
              if (submitBtn) {
                 submitBtn.innerHTML = originalText;
                 submitBtn.disabled = false;
            }
            this.showToast("Greška u sistemu za slanje emailova. Pokušajte ponovo kasnije.");
            return;
        }

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
                
                if (submitBtn) {
                     submitBtn.innerHTML = originalText;
                     submitBtn.disabled = false;
                }
                this.showToast("Greška pri slanju porudžbine. Molimo kontaktirajte podršku.");
            
            });
    }
} 
// =========================================================
// === POKRETANJE NAKON UČITAVANJA DOM-a ===
// =========================================================
let shop;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof AresNyXShop !== 'undefined') {
         shop = new AresNyXShop(); 
    } else {
        console.error("AresNyXShop klasa nije definisana. Greška u učitavanju skripte.");
    }
});

