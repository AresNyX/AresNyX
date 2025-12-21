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
        
        // Podaci o dimenzijama (iz HTML-a)
        this.dimenzije = {
            "S": {"struk":"76-81cm","kuk":"85-90cm","sirina":"12cm","duzina":"39cm"},
            "M": {"struk":"81-86cm","kuk":"90-95cm","sirina":"13cm","duzina":"40cm"},
            "L": {"struk":"86-91cm","kuk":"95-100cm","sirina":"14cm","duzina":"41cm"},
            "XL": {"struk":"91-96cm","kuk":"100-105cm","sirina":"15cm","duzina":"42cm"},
            "XXL": {"struk":"96-101cm","kuk":"105-110cm","sirina":"16cm","duzina":"43cm"}
        };
        
        this.init(); 
    }

    init() {
        console.log("🔄 Initializing shop...");
        
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 
        this.attachEventListeners();

        // EMAILJS INICIJALIZACIJA
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init("WKV419-gz6OQWSgRJ");
                console.log("✅ EmailJS initialized");
            }
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
                category: "pamuk", 
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

        // Event listener za zatvaranje modala klikom na overlay
        const productModal = document.getElementById('productModal');
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    this.closeModal();
                }
            });
        }
        
        // Escape key zatvara modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('productModal');
                if (modal && modal.classList.contains('active')) {
                    this.closeModal();
                }
                
                const dimModal = document.getElementById('dimensionsModal');
                if (dimModal && dimModal.style.display === 'flex') {
                    dimModal.style.display = 'none';
                }
            }
        });
        
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
     */
    renderProducts() {
        console.log("🎨 Rendering products...");
        console.log("📊 Products to render:", this.filteredProducts.length);
        
        const grid = document.getElementById('productsGrid');
        
        if (!grid) {
            console.error('❌ CRITICAL: HTML element #productsGrid nije pronađen!');
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
    // === METODE ZA MODAL I KORPU ===
    // =========================================================

    openProductModal(productId) {
        console.log("🔍 Opening product modal for ID:", productId);
        
        this.currentProduct = this.products.find(p => p.id === productId);
        if (!this.currentProduct) {
            console.error("Product not found:", productId);
            return;
        }

        this.currentSize = null; 
        this.currentQuantity = 1;
        this.currentImageIndex = 0;

        // Popuni modal sa podacima
        document.getElementById('modalTitle').textContent = this.currentProduct.name;
        document.getElementById('modalMaterial').textContent = this.currentProduct.material;
        document.getElementById('modalPrice').textContent = `${this.currentProduct.price} RSD`;
        document.getElementById('modalQty').textContent = '1';

        // Postavi sliku
        this.updateModalImage();

        // Postavi veličine
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
                        ${isDisabled ? 'disabled' : ''}
                        title="Dostupno: ${stock} kom. - ${isDisabled ? 'RASPRODATO' : 'Dostupno'}"
                    >
                        ${size}
                    </button>
                `;
            })
            .join('');
            
        sizeSelector.innerHTML = sizesHtml;
        
        // Dodaj event listenere za veličine nakon renderovanja
        sizeSelector.querySelectorAll('.size-option:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.selectSize(size);
            });
        });
        
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            // Automatski selektuj prvu dostupnu veličinu
            const firstBtn = sizeSelector.querySelector(`.size-option[data-size="${firstAvailableSize}"]`);
            if (firstBtn) {
                firstBtn.classList.add('selected');
            }
            
            // Omogući dugme za dimenzije
            const dimBtn = document.getElementById('dimensionsBtn');
            if (dimBtn) {
                dimBtn.disabled = false;
                dimBtn.classList.add('active');
                dimBtn.textContent = `📏 Dimenzije za ${firstAvailableSize}`;
                dimBtn.dataset.size = firstAvailableSize;
            }
            
            if (addToCartBtn) {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
                addToCartBtn.style.background = 'var(--primary-dark)';
                addToCartBtn.disabled = false;
            }
        } else {
            // Ako nema dostupnih veličina, onemogući dugme
            const dimBtn = document.getElementById('dimensionsBtn');
            if (dimBtn) {
                dimBtn.disabled = true;
                dimBtn.classList.remove('active');
                dimBtn.textContent = `📏 Dimenzije`;
            }
            
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
                addToCartBtn.style.background = 'var(--danger)';
            }
        }

        // OTVORI MODAL SA CSS KLASAMA
        const modal = document.getElementById('productModal');
        const modalContainer = modal.querySelector('.modal-container');
        
        modal.classList.add('active');
        modalContainer.classList.add('active');
        document.body.classList.add('modal-open');
        
        console.log("✅ Product modal opened:", this.currentProduct.name);
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
        const mainImage = document.getElementById('modalMainImage');
        
        if (mainImage && this.currentProduct.images[this.currentImageIndex]) {
            mainImage.src = BASE_IMAGE_URL + this.currentProduct.images[this.currentImageIndex];
            mainImage.alt = `${this.currentProduct.name} - slika ${this.currentImageIndex + 1}`;
        }
        
        // Ažuriraj slider dugmadi
        const totalImages = this.currentProduct.images.length;
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentImageIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentImageIndex === totalImages - 1;
    }
    
    selectSize(size) {
        this.currentSize = size;
        
        // Ukloni selektovano sa svih
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        
        // Dodaj selektovano na kliknuto
        const selectedBtn = document.querySelector(`.size-option[data-size="${size}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Ažuriraj dugme za dimenzije
        const dimBtn = document.getElementById('dimensionsBtn');
        if (dimBtn) {
            dimBtn.textContent = `📏 Dimenzije za ${size}`;
            dimBtn.dataset.size = size;
            dimBtn.disabled = false;
            dimBtn.classList.add('active');
        }
    }

    changeQuantity(change) {
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
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
        if (!this.currentProduct || !this.currentSize) return;
        
        const btn = event.currentTarget;
        if (btn.disabled) return;
        btn.disabled = true;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.background = 'var(--success)';
        
        this.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        
        this.updateCartCount();
        this.renderCart(); 
        
        this.showToast(`${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`);
        
        setTimeout(() => {
            this.closeModal();
            btn.innerHTML = originalText;
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        }, 500); 
    }

    addToCart(productId, size, quantity) {
        console.log("🛒 Adding to cart:", productId, size, quantity);
        
        const product = this.products.find(p => p.id === productId);
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
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = totalItems;
        
        // Animacija
        cartCount.classList.remove('quick-pulse'); 
        void cartCount.offsetWidth;
        cartCount.classList.add('quick-pulse');
        
        this.updateCartTotals(); 
        this.toggleCartVisibility();
    }
    
    toggleCartVisibility() {
        const cartFooter = document.getElementById('cartFooter');
        const emptyCart = document.getElementById('emptyCart');
        
        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'block';
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');

        if (this.cart.length === 0) {
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

        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeCartItem(productId, size); 
            return;
        }
        
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
            document.getElementById('previewSubtotal').textContent = subtotal + ' RSD';
            document.getElementById('previewShipping').textContent = shipping + ' RSD';
            document.getElementById('previewDiscount').textContent = discount + ' RSD';
            document.getElementById('previewTotal').textContent = total + ' RSD';
        } else {
            document.getElementById('cartSubtotal').textContent = subtotal + ' RSD';
            document.getElementById('cartShipping').textContent = shipping + ' RSD';
            document.getElementById('cartDiscount').textContent = discount + ' RSD';
            
            const totalElement = document.getElementById('cartTotal');
            totalElement.textContent = total + ' RSD';

            totalElement.classList.remove('quick-pulse'); 
            void totalElement.offsetWidth; 
            totalElement.classList.add('quick-pulse');
            
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
        toast.textContent = message;
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        const modalContainer = modal.querySelector('.modal-container');
        
        modal.classList.remove('active');
        modalContainer.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        this.currentProduct = null;
        this.currentSize = null;
        this.currentImageIndex = 0;
    }

    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
        document.body.classList.toggle('cart-open');
    }

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        table.style.display = table.style.display === 'none' ? 'block' : 'none';
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
        
        // KLIK NA DUGME ZA DIMENZIJE - ovo će se pozivati iz globalne funkcije
        // Globalna funkcija openDimensionsModal() će pozivati ovu logiku
        // iz HTML onclick atributa
        
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
        
        // OTVORI CHECKOUT MODAL
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutContainer = checkoutModal.querySelector('.modal-container');
        
        checkoutModal.classList.add('active');
        checkoutContainer.classList.add('active');
        document.body.classList.add('checkout-open');
    }

    closeCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutContainer = checkoutModal.querySelector('.modal-container');
        
        checkoutModal.classList.remove('active');
        checkoutContainer.classList.remove('active');
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
    // === completeOrder() FUNKCIJA ===
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

        // VALIDACIJA ZALIHA
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
