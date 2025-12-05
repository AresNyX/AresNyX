class AresNyXShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.filteredProducts = [];
        this.currentMaterialFilter = 'all';
        this.currentSizeFilter = 'all';
        this.currentSort = 'default';
        this.currentProduct = null;
        this.currentImageIndex = 0;
        this.currentSize = null;
        this.currentQuantity = 1;
        this.checkoutData = null;
        this.isInitialized = false;
        this.BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
        
        // Environment variables (in production, these should be in .env)
        this.config = {
            EMAILJS_PUBLIC_KEY: "WKV419-gz6OQWSgRJ",
            EMAILJS_SERVICE_ID: "service_rxj533m",
            EMAILJS_ADMIN_TEMPLATE_ID: "template_5o6etkn",
            EMAILJS_CUSTOMER_TEMPLATE_ID: "template_u8dh76a",
            ADMIN_EMAIL: "ares.nyx.info@gmail.com",
            FREE_SHIPPING_LIMIT: 4000,
            DISCOUNT_LIMIT: 8000,
            BASE_SHIPPING: 400
        };
        
        this.init();
    }

    // ==================== INITIALIZATION ====================
    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.updateCartCount();
            this.renderCart();
            this.updateCartPromoMessage(0);
            this.renderProducts();
            
            // Initialize EmailJS safely
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.config.EMAILJS_PUBLIC_KEY);
            }
            
            this.isInitialized = true;
            console.log('🛒 AresNyX Shop initialized successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Došlo je do greške pri učitavanju shopa');
        }
    }

    // ==================== PRODUCT MANAGEMENT ====================
    async loadProducts() {
        try {
            // In production, this would be a fetch() to an API
            this.products = [
                { 
                    id: 1, 
                    name: "Classic Pamuk", 
                    material: "100% Organski Pamuk", 
                    price: 1300, 
                    category: "pamuk", 
                    images: ["slika1.webp", "slika1a.webp"],
                    badge: "BESTSELLER",
                    sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 },
                    description: "Klasične bokserice od organskog pamuka za maksimalnu udobnost."
                },
                { 
                    id: 2, 
                    name: "Premium Pamuk", 
                    material: "100% Premium Pamuk", 
                    price: 1500, 
                    category: "pamuk", 
                    images: ["slika2.webp", "slika2a.webp"], 
                    badge: "PREMIUM",
                    sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: 8 },
                    description: "Premium kvalitet pamuka za izuzetan osećaj."
                },
                { 
                    id: 3, 
                    name: "Elegant", 
                    material: "100% Prirodni Pamuk", 
                    price: 1800, 
                    category: "pamuk", 
                    images: ["slika3.webp", "slika3a.webp"], 
                    badge: "LUXURY",
                    sizes: { S: 7, M: 0, L: 5, XL: 0, XXL: 3 },
                    description: "Elegantni dizajn za posebne prilike."
                },
                { 
                    id: 4, 
                    name: "Night Black", 
                    material: "100% Premium Pamuk", 
                    price: 1300, 
                    category: "pamuk", 
                    images: ["slika4.webp", "slika4a.webp"], 
                    badge: "POPULAR",
                    sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 },
                    description: "Tamni tonovi za savršen izgled."
                },
                { 
                    id: 5, 
                    name: "Pure White", 
                    material: "100% Organski Pamuk", 
                    price: 1300, 
                    category: "pamuk", 
                    images: ["slika5.webp", "slika5a.webp"],
                    badge: "CLASSIC",
                    sizes: { S: 2, M: 3, L: 0, XL: 0, XXL: 1 },
                    description: "Čista bela boja za svakodnevno nošenje."
                },
                { 
                    id: 6, 
                    name: "Navy Stripes", 
                    material: "100% Premium Pamuk", 
                    price: 1400, 
                    category: "pamuk", 
                    images: ["slika6.webp", "slika6a.webp"], 
                    badge: "TRENDING",
                    sizes: { S: 8, M: 8, L: 8, XL: 8, XXL: 8 },
                    description: "Mornarske pruge za moderan stil."
                },
                { 
                    id: 7, 
                    name: "Dark Grey", 
                    material: "100% Premium Pamuk", 
                    price: 1300, 
                    category: "pamuk", 
                    images: ["slika7.webp", "slika7a.webp"], 
                    badge: "ESSENTIAL",
                    sizes: { S: 6, M: 6, L: 6, XL: 6, XXL: 6 },
                    description: "Tamno siva - neophodan osnov."
                },
                { 
                    id: 8, 
                    name: "Blue Stripes", 
                    material: "100% Premium Pamuk", 
                    price: 1400, 
                    category: "pamuk", 
                    images: ["slika8.webp", "slika8a.webp"], 
                    badge: "NEW",
                    sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 },
                    description: "Plave pruge za osveženje garderobe."
                },
                { 
                    id: 9, 
                    name: "Charcoal Black", 
                    material: "100% Premium Pamuk", 
                    price: 1350, 
                    category: "pamuk", 
                    images: ["slika9.webp", "slika9a.webp"],
                    badge: "PREMIUM",
                    sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 1 },
                    description: "Ugljeni crni - sofisticirano i moderno."
                },
                { 
                    id: 10, 
                    name: "Navy", 
                    material: "100% Arabic Pamuk", 
                    price: 1600, 
                    category: "pamuk", 
                    images: ["slika10.webp", "slika10a.webp"],
                    badge: "ECO",
                    sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 0 },
                    description: "Mornarsko plava od arapskog pamuka."
                },
                { 
                    id: 11, 
                    name: "Bamboo Cool", 
                    material: "Bambus i Pamuk", 
                    price: 1900, 
                    category: "pamuk", 
                    images: ["slika11.webp", "slika11a.webp"], 
                    badge: "BAMBUS",
                    sizes: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 },
                    description: "Bambus materijal za optimalnu ventilaciju."
                }
            ];

            // Prepend base URL to all images
            this.products.forEach(product => {
                product.images = product.images.map(img => this.BASE_IMAGE_URL + img);
                product.mainImage = product.images[0];
            });

            this.filteredProducts = [...this.products];
            return this.products;
            
        } catch (error) {
            console.error('Failed to load products:', error);
            throw error;
        }
    }

    // ==================== RENDERING ====================
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) {
            console.error('Products grid element not found');
            return;
        }

        if (!this.filteredProducts || this.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>Nema pronađenih proizvoda</h3>
                    <p>Pokušajte da promenite filtere ili pogledajte celu kolekciju.</p>
                    <button class="btn-primary" onclick="shop.resetFilters()">Prikaži sve proizvode</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredProducts.map(product => {
            const isOutOfStock = Object.values(product.sizes).every(qty => qty === 0);
            
            return `
                <article class="product-card" data-id="${product.id}" role="article" aria-label="${product.name}">
                    ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
                    ${isOutOfStock ? '<div class="product-badge out-of-stock">RASPRODATO</div>' : ''}
                    
                    <div class="product-image-wrapper" onclick="shop.openProductModal(${product.id})">
                        <img 
                            src="${product.mainImage}" 
                            alt="${product.name} - ${product.material}" 
                            class="product-image"
                            loading="lazy"
                            width="300"
                            height="400"
                        >
                        <div class="product-overlay">
                            <span>Brzi pregled</span>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-material">${product.material}</p>
                        <p class="product-description">${product.description}</p>
                        
                        <div class="product-price-stock">
                            <span class="product-price">${product.price.toLocaleString()} RSD</span>
                            <span class="product-stock">
                                ${isOutOfStock ? 
                                    '<i class="fas fa-times-circle"></i> Rasprodato' : 
                                    `<i class="fas fa-check-circle"></i> Na stanju`
                                }
                            </span>
                        </div>
                        
                        <div class="available-sizes">
                            ${Object.entries(product.sizes)
                                .filter(([size, qty]) => qty > 0)
                                .map(([size]) => `<span class="size-chip">${size}</span>`)
                                .join('')}
                        </div>
                        
                        <button 
                            class="btn-view-details"
                            onclick="shop.openProductModal(${product.id})"
                            ${isOutOfStock ? 'disabled' : ''}
                        >
                            <i class="fas fa-eye"></i> Detalji
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }

    // ==================== FILTERS & SORTING ====================
    setupEventListeners() {
        // Size filter buttons
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    this.selectSizeFilter(btn.dataset.size);
                }
            });
        }

        // Material filter
        const materialFilter = document.getElementById('materialFilter');
        if (materialFilter) {
            materialFilter.addEventListener('change', (e) => {
                this.currentMaterialFilter = e.target.value;
            });
        }

        // Price sort
        const priceSort = document.getElementById('priceSort');
        if (priceSort) {
            priceSort.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
            });
        }

        // Window resize for responsive
        window.addEventListener('resize', this.debounce(() => {
            this.renderProducts();
        }, 250));

        // Close modals on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    selectSizeFilter(size) {
        this.currentSizeFilter = size;
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.size-btn[data-size="${size}"]`).classList.add('active');
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    applyAllFilters() {
        this.toggleFilterPanel();
        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        // Material filter
        if (this.currentMaterialFilter !== 'all') {
            tempProducts = tempProducts.filter(p => p.category === this.currentMaterialFilter);
        }

        // Size filter
        if (this.currentSizeFilter !== 'all') {
            tempProducts = tempProducts.filter(p => 
                p.sizes && p.sizes[this.currentSizeFilter] > 0
            );
        }

        // Sorting
        if (this.currentSort === 'lowToHigh') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === 'highToLow') {
            tempProducts.sort((a, b) => b.price - a.price);
        }

        this.filteredProducts = tempProducts;
        this.renderProducts();
        
        // Announce to screen readers
        this.announceToScreenReader(`Prikazano ${tempProducts.length} proizvoda`);
    }

    resetFilters() {
        this.currentMaterialFilter = 'all';
        this.currentSizeFilter = 'all';
        this.currentSort = 'default';
        
        document.getElementById('materialFilter').value = 'all';
        document.getElementById('priceSort').value = 'default';
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.size-btn[data-size="all"]').classList.add('active');
        
        this.applyFiltersAndSort();
    }

    // ==================== PRODUCT MODAL ====================
    openProductModal(productId) {
        this.currentProduct = this.products.find(p => p.id === productId);
        if (!this.currentProduct) return;

        // Reset modal state
        this.currentImageIndex = 0;
        this.currentQuantity = 1;
        this.currentSize = null;

        // Update modal content
        document.getElementById('modalTitle').textContent = this.currentProduct.name;
        document.getElementById('modalMaterial').textContent = this.currentProduct.material;
        document.getElementById('modalPrice').textContent = `${this.currentProduct.price.toLocaleString()} RSD`;
        document.getElementById('modalQty').textContent = '1';

        // Update image
        this.updateModalImage();

        // Generate size options
        const sizeSelector = document.getElementById('sizeSelector');
        const sizes = Object.entries(this.currentProduct.sizes)
            .map(([size, stock]) => ({
                size,
                stock,
                isDisabled: stock === 0
            }))
            .sort((a, b) => a.size.localeCompare(b.size));

        sizeSelector.innerHTML = sizes.map(({ size, stock, isDisabled }) => `
            <button 
                class="size-option ${isDisabled ? 'disabled' : ''}"
                data-size="${size}" 
                onclick="shop.selectSize('${size}', ${isDisabled})"
                ${isDisabled ? 'disabled aria-disabled="true"' : ''}
                aria-label="Veličina ${size}, dostupno ${stock} komada"
            >
                ${size}
                <span class="stock-indicator">${stock} kom</span>
            </button>
        `).join('');

        // Auto-select first available size
        const firstAvailable = sizes.find(s => !s.isDisabled);
        if (firstAvailable) {
            this.selectSize(firstAvailable.size, false);
        }

        // Show modal
        const modal = document.getElementById('productModal');
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
        
        // Focus management for accessibility
        setTimeout(() => modal.querySelector('.modal-close').focus(), 100);
    }

    selectSize(size, isDisabled) {
        if (isDisabled) return;
        
        this.currentSize = size;
        document.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('selected');
            opt.setAttribute('aria-checked', 'false');
        });
        
        const selectedOpt = document.querySelector(`.size-option[data-size="${size}"]`);
        if (selectedOpt) {
            selectedOpt.classList.add('selected');
            selectedOpt.setAttribute('aria-checked', 'true');
        }
        
        this.updateAddToCartButton();
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        const img = document.getElementById('modalMainImage');
        img.src = this.currentProduct.images[this.currentImageIndex];
        img.alt = `${this.currentProduct.name} - slika ${this.currentImageIndex + 1}`;
        
        // Update navigation buttons
        const totalImages = this.currentProduct.images.length;
        const sliderNav = document.querySelector('.slider-nav');
        
        if (totalImages > 1) {
            sliderNav.style.display = 'flex';
            document.getElementById('prevImageBtn').disabled = this.currentImageIndex === 0;
            document.getElementById('nextImageBtn').disabled = this.currentImageIndex === totalImages - 1;
        } else {
            sliderNav.style.display = 'none';
        }
    }

    prevImage() {
        if (!this.currentProduct) return;
        this.currentImageIndex = Math.max(0, this.currentImageIndex - 1);
        this.updateModalImage();
    }

    nextImage() {
        if (!this.currentProduct) return;
        this.currentImageIndex = Math.min(
            this.currentProduct.images.length - 1, 
            this.currentImageIndex + 1
        );
        this.updateModalImage();
    }

    changeQuantity(delta) {
        const maxQuantity = this.currentSize ? 
            (this.currentProduct.sizes[this.currentSize] || 1) : 10;
        
        this.currentQuantity = Math.max(1, Math.min(maxQuantity, this.currentQuantity + delta));
        document.getElementById('modalQty').textContent = this.currentQuantity;
    }

    updateAddToCartButton() {
        const btn = document.querySelector('.add-to-cart-btn');
        if (!btn) return;

        if (!this.currentSize) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Izaberite veličinu';
            btn.style.background = '#ccc';
            return;
        }

        const stock = this.currentProduct.sizes[this.currentSize];
        if (stock === 0) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-times-circle"></i> Rasprodato';
            btn.style.background = 'var(--danger)';
            return;
        }

        if (this.currentQuantity > stock) {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Samo ${stock} kom`;
            btn.style.background = 'var(--warning)';
            return;
        }

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
        btn.style.background = 'var(--primary-dark)';
    }

    addToCartFromModal() {
        if (!this.currentProduct || !this.currentSize) return;
        
        const stock = this.currentProduct.sizes[this.currentSize];
        if (this.currentQuantity > stock) {
            this.showToast(`Dostupno je samo ${stock} komada`, 'warning');
            return;
        }

        const btn = document.querySelector('.add-to-cart-btn');
        const originalState = {
            html: btn.innerHTML,
            background: btn.style.background,
            disabled: btn.disabled
        };

        // Visual feedback
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.background = 'var(--success)';

        // Add to cart
        this.addToCart(
            this.currentProduct.id,
            this.currentSize,
            this.currentQuantity
        );

        // Update UI
        this.updateCartCount();
        this.renderCart();
        
        // Show success message
        this.showToast(
            `${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`,
            'success'
        );

        // Reset button and close modal
        setTimeout(() => {
            btn.innerHTML = originalState.html;
            btn.style.background = originalState.background;
            btn.disabled = originalState.disabled;
            this.closeModal();
        }, 1000);
    }

    // ==================== CART MANAGEMENT ====================
    addToCart(productId, size, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return false;

        // Check stock
        const availableStock = product.sizes[size] || 0;
        if (quantity > availableStock) {
            this.showToast(`Nema dovoljno zaliha za ${product.name} (${size})`, 'error');
            return false;
        }

        // Find existing item
        const existingIndex = this.cart.findIndex(item => 
            item.productId === productId && item.size === size
        );

        if (existingIndex > -1) {
            // Update existing item
            const newQuantity = this.cart[existingIndex].quantity + quantity;
            
            if (newQuantity > availableStock) {
                this.showToast(`Maksimalna količina za ${product.name} (${size}) je ${availableStock}`, 'warning');
                return false;
            }
            
            this.cart[existingIndex].quantity = newQuantity;
        } else {
            // Add new item
            this.cart.push({
                productId,
                size,
                quantity,
                name: product.name,
                price: product.price,
                image: product.mainImage,
                material: product.material
            });
        }

        // Update stock (in memory only - in production this would be API call)
        product.sizes[size] -= quantity;
        
        this.saveCart();
        return true;
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.add('pulse');
            setTimeout(() => cartCount.classList.remove('pulse'), 300);
        }

        this.toggleCartVisibility();
        this.updateCartTotals();
    }

    renderCart() {
        const container = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        
        if (this.cart.length === 0) {
            container.innerHTML = '';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        
        container.innerHTML = this.cart.map((item, index) => {
            const product = this.products.find(p => p.id === item.productId);
            const stock = product ? product.sizes[item.size] || 0 : 0;
            const isLowStock = stock < item.quantity;
            
            return `
                <div class="cart-item" data-index="${index}">
                    <button class="cart-item-remove" 
                            onclick="shop.removeCartItem(${index})"
                            aria-label="Ukloni ${item.name} veličine ${item.size}">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         class="cart-item-image"
                         loading="lazy"
                         width="80"
                         height="80">
                    
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <span class="cart-item-price">${(item.price * item.quantity).toLocaleString()} RSD</span>
                        </div>
                        
                        <div class="cart-item-meta">
                            <span class="cart-item-size">
                                <i class="fas fa-ruler"></i> Veličina: ${item.size}
                            </span>
                            <span class="cart-item-material">
                                <i class="fas fa-leaf"></i> ${item.material}
                            </span>
                        </div>
                        
                        ${isLowStock ? `
                            <div class="cart-item-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>Malo zaliha: ${stock} kom preostalo</span>
                            </div>
                        ` : ''}
                        
                        <div class="cart-item-controls">
                            <div class="quantity-control">
                                <button class="qty-btn" 
                                        onclick="shop.updateCartItemQuantity(${index}, -1)"
                                        ${item.quantity <= 1 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn" 
                                        onclick="shop.updateCartItemQuantity(${index}, 1)"
                                        ${item.quantity >= stock ? 'disabled' : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <span class="unit-price">${item.price.toLocaleString()} RSD/kom</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCartItemQuantity(index, delta) {
        if (index < 0 || index >= this.cart.length) return;
        
        const item = this.cart[index];
        const product = this.products.find(p => p.id === item.productId);
        const stock = product ? product.sizes[item.size] || 0 : 0;
        
        const newQuantity = item.quantity + delta;
        
        if (newQuantity < 1) {
            this.removeCartItem(index);
            return;
        }
        
        if (newQuantity > stock) {
            this.showToast(`Maksimalna količina: ${stock} komada`, 'warning');
            return;
        }
        
        // Update product stock
        if (product) {
            product.sizes[item.size] += (-delta); // Adjust stock
        }
        
        item.quantity = newQuantity;
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        
        this.showToast(
            delta > 0 ? 'Količina povećana' : 'Količina smanjena',
            'info'
        );
    }

    removeCartItem(index) {
        if (index < 0 || index >= this.cart.length) return;
        
        const item = this.cart[index];
        
        // Restore stock
        const product = this.products.find(p => p.id === item.productId);
        if (product) {
            product.sizes[item.size] += item.quantity;
        }
        
        this.cart.splice(index, 1);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        
        this.showToast(`${item.name} je uklonjen iz korpe`, 'info');
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showToast('Korpa je već prazna', 'info');
            return;
        }
        
        if (!confirm('Da li ste sigurni da želite da ispraznite korpu?')) {
            return;
        }
        
        // Restore all stock
        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                product.sizes[item.size] += item.quantity;
            }
        });
        
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        
        this.showToast('Korpa je ispražnjena', 'success');
    }

    toggleCart() {
        const cart = document.getElementById('cartSidebar');
        cart.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        if (cart.classList.contains('active')) {
            cart.querySelector('.modal-close').focus();
        }
    }

    updateCartTotals(preview = false) {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.config.FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : this.config.BASE_SHIPPING;
        const discount = subtotal >= this.config.DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + shipping - discount;
        
        if (preview) {
            document.getElementById('previewSubtotal').textContent = `${subtotal.toLocaleString()} RSD`;
            document.getElementById('previewShipping').textContent = `${shipping.toLocaleString()} RSD`;
            document.getElementById('previewDiscount').textContent = `${discount.toLocaleString()} RSD`;
            document.getElementById('previewTotal').textContent = `${total.toLocaleString()} RSD`;
        } else {
            document.getElementById('cartSubtotal').textContent = `${subtotal.toLocaleString()} RSD`;
            document.getElementById('cartShipping').textContent = `${shipping.toLocaleString()} RSD`;
            document.getElementById('cartDiscount').textContent = `${discount.toLocaleString()} RSD`;
            document.getElementById('cartTotal').textContent = `${total.toLocaleString()} RSD`;
            
            this.updateCartPromoMessage(subtotal);
        }
    }

    updateCartPromoMessage(subtotal) {
        const promo = document.getElementById('cartPromoMessage');
        if (!promo) return;
        
        const { FREE_SHIPPING_LIMIT, DISCOUNT_LIMIT } = this.config;
        
        if (subtotal >= DISCOUNT_LIMIT) {
            promo.className = 'cart-promo-message success';
            promo.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>Čestitamo! Ostvarili ste <strong>BESPLATNU DOSTAVU</strong> i <strong>10% POPUSTA</strong>!</span>
            `;
        } else if (subtotal >= FREE_SHIPPING_LIMIT) {
            const needed = DISCOUNT_LIMIT - subtotal;
            promo.className = 'cart-promo-message warning';
            promo.innerHTML = `
                <i class="fas fa-shipping-fast"></i>
                <span>Imate <strong>BESPLATNU DOSTAVU</strong>! Dodajte još <strong>${needed.toLocaleString()} RSD</strong> za 10% popusta.</span>
            `;
        } else {
            const needed = FREE_SHIPPING_LIMIT - subtotal;
            promo.className = 'cart-promo-message info';
            promo.innerHTML = `
                <i class="fas fa-truck"></i>
                <span>Dodajte još <strong>${needed.toLocaleString()} RSD</strong> do besplatne dostave!</span>
            `;
        }
    }

    // ==================== CHECKOUT ====================
    startCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Korpa je prazna', 'warning');
            return;
        }
        
        // Validate stock before checkout
        const stockIssues = this.validateStock();
        if (stockIssues.length > 0) {
            let message = 'Nema dovoljno zaliha za:\n';
            stockIssues.forEach(issue => {
                message += `- ${issue.name} (${issue.size}): ${issue.reason}\n`;
            });
            alert(message);
            return;
        }
        
        this.toggleCart();
        this.goToCheckoutStep(1);
        
        const modal = document.getElementById('checkoutModal');
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
        
        // Pre-fill form if returning customer
        const savedData = localStorage.getItem('lastCheckoutData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) input.value = data[key];
                });
            } catch (e) {
                // Ignore parse errors
            }
        }
    }

    submitShippingForm(event) {
        event.preventDefault();
        
        // Collect form data
        this.checkoutData = {
            ime: document.getElementById('ime').value.trim(),
            prezime: document.getElementById('prezime').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefon: document.getElementById('telefon').value.trim(),
            ulica: document.getElementById('ulica').value.trim(),
            postanskiBroj: document.getElementById('postanskiBroj').value.trim(),
            grad: document.getElementById('grad').value.trim(),
            opstina: document.getElementById('opstina').value.trim(),
            placanje: document.getElementById('placanje').value,
            napomena: document.getElementById('napomena').value.trim()
        };
        
        // Validate required fields
        const required = ['ime', 'prezime', 'email', 'telefon', 'ulica', 'postanskiBroj', 'grad'];
        const missing = required.filter(field => !this.checkoutData[field]);
        
        if (missing.length > 0) {
            this.showToast(`Popunite obavezna polja: ${missing.join(', ')}`, 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.checkoutData.email)) {
            this.showToast('Unesite validnu email adresu', 'error');
            return;
        }
        
        // Validate phone format
        const phoneRegex = /^[0-9+\s\-()]{9,}$/;
        if (!phoneRegex.test(this.checkoutData.telefon)) {
            this.showToast('Unesite validan broj telefona', 'error');
            return;
        }
        
        // Save for next time
        localStorage.setItem('lastCheckoutData', JSON.stringify(this.checkoutData));
        
        // Render preview
        this.renderCheckoutPreview();
        this.goToCheckoutStep(2);
    }

    renderCheckoutPreview() {
        // Shipping info
        document.getElementById('previewIme').innerHTML = `
            <strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}
        `;
        document.getElementById('previewEmail').innerHTML = `
            <strong>Email:</strong> ${this.checkoutData.email}
        `;
        document.getElementById('previewTelefon').innerHTML = `
            <strong>Telefon:</strong> ${this.checkoutData.telefon}
        `;
        document.getElementById('previewAdresa').innerHTML = `
            <strong>Adresa:</strong> ${this.checkoutData.ulica}
        `;
        document.getElementById('previewPostaGrad').innerHTML = `
            <strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}
            ${this.checkoutData.opstina ? `(${this.checkoutData.opstina})` : ''}
        `;
        document.getElementById('previewPlacanje').innerHTML = `
            <strong>Način plaćanja:</strong> ${this.getPaymentMethodText(this.checkoutData.placanje)}
        `;
        document.getElementById('previewNapomena').innerHTML = `
            <strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene'}
        `;
        
        // Order items
        const container = document.getElementById('previewOrderItems');
        container.innerHTML = this.cart.map(item => `
            <div class="preview-item">
                <div class="preview-item-info">
                    <div class="preview-item-name">${item.quantity}x ${item.name}</div>
                    <div class="preview-item-details">Veličina: ${item.size} | ${item.material}</div>
                </div>
                <div class="preview-item-price">
                    ${(item.price * item.quantity).toLocaleString()} RSD
                </div>
            </div>
        `).join('');
        
        // Totals
        this.updateCartTotals(true);
    }

    async completeOrder() {
        const submitBtn = document.querySelector('.submit-order-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;
        
        try {
            // Final stock validation
            const stockIssues = this.validateStock();
            if (stockIssues.length > 0) {
                throw new Error('Proizvodi više nisu dostupni u traženim količinama');
            }
            
            // Calculate totals
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = subtotal >= this.config.FREE_SHIPPING_LIMIT ? 0 : this.config.BASE_SHIPPING;
            const discount = subtotal >= this.config.DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
            const total = subtotal + shipping - discount;
            
            // Prepare email data
            const templateParams = {
                sender_name: 'AresNyX Shop',
                admin_email: this.config.ADMIN_EMAIL,
                customer_email: this.checkoutData.email,
                
                order_number: 'ARX-' + Date.now(),
                order_date: new Date().toLocaleDateString('sr-RS'),
                
                customer_name: `${this.checkoutData.ime} ${this.checkoutData.prezime}`,
                customer_phone: this.checkoutData.telefon,
                customer_email: this.checkoutData.email,
                shipping_address: `${this.checkoutData.ulica}, ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}`,
                payment_method: this.getPaymentMethodText(this.checkoutData.placanje),
                notes: this.checkoutData.napomena || 'Nema napomene',
                
                items: this.cart.map(item => `
                    • ${item.quantity}x ${item.name} (${item.size})
                      Cena: ${item.price} RSD x ${item.quantity} = ${item.price * item.quantity} RSD
                `).join('\n'),
                
                subtotal: `${subtotal.toLocaleString()} RSD`,
                shipping: `${shipping.toLocaleString()} RSD`,
                discount: `${discount.toLocaleString()} RSD`,
                total: `${total.toLocaleString()} RSD`,
                
                free_shipping_threshold: this.config.FREE_SHIPPING_LIMIT,
                discount_threshold: this.config.DISCOUNT_LIMIT
            };
            
            // Send emails
            await Promise.all([
                emailjs.send(
                    this.config.EMAILJS_SERVICE_ID,
                    this.config.EMAILJS_ADMIN_TEMPLATE_ID,
                    templateParams
                ),
                emailjs.send(
                    this.config.EMAILJS_SERVICE_ID,
                    this.config.EMAILJS_CUSTOMER_TEMPLATE_ID,
                    templateParams
                )
            ]);
            
            // Success
            document.getElementById('confirmationEmail').textContent = this.checkoutData.email;
            this.goToCheckoutStep(3);
            
            // Clear cart
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
            
            // Clear saved data
            localStorage.removeItem('lastCheckoutData');
            
            this.showToast('Porudžbina uspešno poslata!', 'success');
            
        } catch (error) {
            console.error('Checkout failed:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            this.showToast(
                error.message || 'Greška pri slanju porudžbine. Pokušajte ponovo.',
                'error'
            );
            
            // Fallback: Show contact info
            if (error.message.includes('EmailJS')) {
                alert('Pošaljite nam porudžbinu na: ' + this.config.ADMIN_EMAIL);
            }
        }
    }

    // ==================== UTILITIES ====================
    validateStock() {
        const issues = [];
        
        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            
            if (!product) {
                issues.push({
                    name: item.name,
                    size: item.size,
                    reason: 'Proizvod više ne postoji'
                });
                return;
            }
            
            const stock = product.sizes[item.size] || 0;
            if (item.quantity > stock) {
                issues.push({
                    name: item.name,
                    size: item.size,
                    reason: `Dostupno: ${stock}, Traženo: ${item.quantity}`
                });
            }
        });
        
        return issues;
    }

    getPaymentMethodText(method) {
        const methods = {
            pouzecem: 'Pouzećem (Plaćanje prilikom preuzimanja)',
            racun: 'Uplata na račun (E-banking)',
            licno: 'Lično preuzimanje (dogovor)'
        };
        return methods[method] || method;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast ${type}`;
        
        // Remove any existing show class
        toast.classList.remove('show');
        void toast.offsetWidth; // Trigger reflow
        
        // Add show class
        toast.classList.add('show');
        
        // Auto-hide
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('screenReaderAnnouncements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => announcer.textContent = '', 100);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    closeModal() {
        document.getElementById('productModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    closeAllModals() {
        this.closeModal();
        this.closeCheckoutModal();
        const cart = document.getElementById('cartSidebar');
        if (cart) cart.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    closeCheckoutModal() {
        document.getElementById('checkoutModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
        this.goToCheckoutStep(1);
    }

    goToCheckoutStep(step) {
        [1, 2, 3].forEach(s => {
            const element = document.getElementById(`checkoutStep${s}`);
            if (element) {
                element.style.display = s === step ? 'block' : 'none';
            }
        });
    }

    toggleSizeTable() {
        const table = document.getElementById('sizeTable');
        const isVisible = table.style.display === 'block';
        table.style.display = isVisible ? 'none' : 'block';
        
        const button = document.querySelector('.size-info');
        if (button) {
            button.setAttribute('aria-expanded', !isVisible);
        }
    }
}

// ==================== GLOBAL INITIALIZATION ====================
let shop = null;

document.addEventListener('DOMContentLoaded', () => {
    // Create shop instance
    shop = new AresNyXShop();
    
    // Make shop globally accessible (for onclick handlers)
    window.shop = shop;
    
    // Add loading state removal
    setTimeout(() => {
        const loading = document.querySelector('.products-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 500);
    
    // Add offline detection
    window.addEventListener('online', () => {
        shop.showToast('Povezan na internet', 'success');
    });
    
    window.addEventListener('offline', () => {
        shop.showToast('Niste povezani na internet', 'warning');
    });
});

// Service Worker Registration (Production)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
                        }
