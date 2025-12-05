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
        
        this.init();
    }

    init() {
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0);
        
        // Dodaj event listener za cart navigation link
        const cartNavLink = document.getElementById('cartNavLink');
        if (cartNavLink) {
            cartNavLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }
        
        // Dodaj event listenere za size filter buttons
        this.initializeSizeFilters();

        try {
            emailjs.init("WKV419-gz6OQWSgRJ");
        } catch (e) {
            console.error("EmailJS biblioteka nije pronađena.");
        }
    }
    
    initializeSizeFilters() {
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                this.filterProducts(size, 'size');
            });
        });
    }

    loadProducts() {
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";

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
                name: "Premium Pamuk", 
                material: "100% Premium Pamuk", 
                price: 1500, 
                category: "pamuk", 
                images: ["slika2.webp", "slika2a.webp"], 
                badge: "PREMIUM",
                sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: 8 } 
            },
            { 
                id: 3, 
                name: "Elegant", 
                material: "100% Prirodni Pamuk", 
                price: 1800, 
                category: "pamuk", 
                images: ["slika3.webp", "slika3a.webp"], 
                badge: "LUXURY",
                sizes: { S: 7, M: 0, L: 5, XL: 0, XXL: 3 } 
            },
            { 
                id: 4, 
                name: "Night Black", 
                material: "100% Premium Pamuk", 
                price: 1300, 
                category: "pamuk", 
                images: ["slika4.webp", "slika4a.webp"], 
                badge: "POPULAR",
                sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 } 
            },
            { 
                id: 5, 
                name: "Pure White", 
                material: "100% Organski Pamuk", 
                price: 1300, 
                category: "pamuk", 
                images: ["slika5.webp", "slika5a.webp"],
                badge: "CLASSIC",
                sizes: { S: 2, M: 3, L: 0, XL: 0, XXL: 1 } 
            },
            { 
                id: 6, 
                name: "Navy Stripes", 
                material: "100% Premium Pamuk", 
                price: 1400, 
                category: "pamuk", 
                images: ["slika6.webp", "slika6a.webp"], 
                badge: "TRENDING",
                sizes: { S: 8, M: 8, L: 8, XL: 8, XXL: 8 } 
            },
            { 
                id: 7, 
                name: "Dark Grey", 
                material: "100% Premium Pamuk", 
                price: 1300, 
                category: "pamuk", 
                images: ["slika7.webp", "slika7a.webp"], 
                badge: "ESSENTIAL",
                sizes: { S: 6, M: 6, L: 6, XL: 6, XXL: 6 } 
            },
            { 
                id: 8, 
                name: "Blue Stripes", 
                material: "100% Premium Pamuk", 
                price: 1400, 
                category: "pamuk", 
                images: ["slika8.webp", "slika8a.webp"], 
                badge: "NEW",
                sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 } 
            },
            { 
                id: 9, 
                name: "Charcoal Black", 
                material: "100% Premium Pamuk", 
                price: 1350, 
                category: "pamuk", 
                images: ["slika9.webp", "slika9a.webp"],
                badge: "PREMIUM",
                sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 1 } 
            },
            { 
                id: 10, 
                name: "Navy", 
                material: "100% Arabic Pamuk", 
                price: 1600, 
                category: "pamuk", 
                images: ["slika10.webp", "slika10a.webp"],
                badge: "ECO",
                sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 0 } 
            },
            { 
                id: 11, 
                name: "Bamboo Cool", 
                material: "10% Organski Pamuk", 
                price: 1900, 
                category: "pamuk", 
                images: ["slika11.webp", "slika11a.webp"], 
                badge: "BAMBUS",
                sizes: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 } 
            }
        ];
        
        this.products.forEach(p => {
            p.images = p.images.map(imgName => BASE_IMAGE_URL + imgName);
        });

        this.filteredProducts = [...this.products];
        
        // Render products after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.renderProducts());
        } else {
            this.renderProducts();
        }
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        const displayProducts = this.filteredProducts; 

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = displayProducts.map(product => {
            const imageSrc = product.images[0];
            
            return `
              <div class="product-card" data-id="${product.id}" onclick="shop.openProductModal(${product.id})">
        ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
        
        <img src="${imageSrc}" 
             alt="${product.name}" 
             class="product-image"
             loading="lazy"> 

        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-material">${product.material}</p>
            <p class="product-price">${product.price} RSD</p>
        </div>
    </div>
`;
        }).join('');
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        if (!panel) return;
        
        // Toggle display style
        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
        
        panel.classList.toggle('active');
        
        // Update aria-expanded
        const btn = document.querySelector('.filter-sort-btn');
        if (btn) {
            const isExpanded = panel.style.display !== 'none';
            btn.setAttribute('aria-expanded', isExpanded);
        }
    }

    filterProducts(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } else if (filterType === 'size') {
            this.currentSizeFilter = value;
            
            document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
            if (value !== 'all') {
                const targetBtn = document.querySelector(`.size-btn[data-size="${value}"]`);
                if (targetBtn) targetBtn.classList.add('active');
            } else {
                const allBtn = document.querySelector(`.size-btn[data-size="all"]`);
                if (allBtn) allBtn.classList.add('active');
            }
        }
    }

    sortProducts(sortType) {
        this.currentSort = sortType;
    }

    applyAllFilters() {
        this.toggleFilterPanel();
        
        const materialFilter = document.getElementById('materialFilter');
        const sortFilter = document.getElementById('priceSort');
        
        if (materialFilter) this.currentMaterialFilter = materialFilter.value;
        if (sortFilter) this.currentSort = sortFilter.value;
        
        this.applyFiltersAndSort(); 
    }

    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        if (this.currentMaterialFilter !== 'all') {
             tempProducts = tempProducts.filter(p => p.category === this.currentMaterialFilter);
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
                    >
                        ${size}
                    </button>
                `;
            })
            .join('');
            
        sizeSelector.innerHTML = sizesHtml;
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            const firstSizeBtn = document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`);
            if (firstSizeBtn) firstSizeBtn.classList.add('selected');
        } 
        
        const btn = document.querySelector('.add-to-cart-btn');
        if (!firstAvailableSize) {
             btn.disabled = true;
             btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
             btn.style.background = 'var(--danger)';
        } else {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        }

        const sizeTable = document.getElementById('sizeTable');
        if (sizeTable) sizeTable.style.display = 'none';
        
        const modal = document.getElementById('productModal');
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        const mainImage = document.getElementById('modalMainImage');
        if (mainImage) {
            mainImage.src = this.currentProduct.images[this.currentImageIndex];
        }
        
        const totalImages = this.currentProduct.images.length;
        const sliderNav = document.querySelector('.slider-nav');

        if (totalImages > 1 && sliderNav) {
            sliderNav.style.display = 'flex'; 
            
            const isFirst = this.currentImageIndex === 0;
            const isLast = this.currentImageIndex === totalImages - 1;
            
            const prevBtn = document.getElementById('prevImageBtn');
            const nextBtn = document.getElementById('nextImageBtn');
            
            if (prevBtn) prevBtn.disabled = isFirst;
            if (nextBtn) nextBtn.disabled = isLast;
        } else if (sliderNav) {
            sliderNav.style.display = 'none'; 
        }
    }

    selectSize(event, size, isDisabled) {
        if (isDisabled) return;

        this.currentSize = size;
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    }

    changeQuantity(change) {
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
        const qtyDisplay = document.getElementById('modalQty');
        if (qtyDisplay) qtyDisplay.textContent = this.currentQuantity;
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
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.productId === productId && item.size === size);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ 
                productId, 
                size, 
                quantity, 
                name: product.name, 
                price: product.price, 
                image: product.images[0] 
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
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart" id="emptyCart" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i>
                    <p>Vaša korpa je prazna</p>
                </div>`;
            this.toggleCartVisibility(); 
            this.updateCartTotals(); 
            return;
        }

        cartItemsContainer.innerHTML = ''; 

        this.cart.forEach((item, index) => {
            const itemHtml = `
<div class="cart-item" data-id="${item.productId}" data-size="${item.size}">
    <button class="cart-item-remove" onclick="shop.removeCartItem(${index})" title="Ukloni proizvod">×</button>
    <img src="${item.image}" alt="${item.name} veličine ${item.size}" class="cart-item-image" loading="lazy">
    <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-size">Veličina: ${item.size}</div>
        <div class="cart-item-controls">
            <div class="cart-item-qty-wrapper">
                <button class="cart-item-qty-btn" onclick="shop.updateCartItemQuantity(${index}, -1)">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="cart-item-qty-btn" onclick="shop.updateCartItemQuantity(${index}, 1)">+</button>
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

    updateCartItemQuantity(index, change) {
        if (index < 0 || index >= this.cart.length) return;
        
        const item = this.cart[index];
        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeCartItem(index); 
            return;
        }
        
        this.saveCart();
        this.updateCartCount();
        
        const cartItem = document.querySelector(`.cart-item:nth-child(${index + 1})`);
        if(cartItem) {
            const qtyEl = cartItem.querySelector('.cart-item-qty');
            const priceEl = cartItem.querySelector('.cart-item-price');
            if (qtyEl) qtyEl.textContent = item.quantity;
            if (priceEl) priceEl.textContent = (item.price * item.quantity) + ' RSD';
        }
        
        this.updateCartTotals();
        this.showToast(change > 0 ? "Količina povećana" : "Količina smanjena");
    }

    removeCartItem(index) {
        if (index < 0 || index >= this.cart.length) return;
        
        const item = this.cart[index];
        this.cart.splice(index, 1);
        this.saveCart();
        
        this.updateCartCount(); 
        this.showToast(`"${item.name}" je uklonjen iz korpe`);
        
        this.renderCart();
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
            const elements = {
                previewSubtotal: document.getElementById('previewSubtotal'),
                previewShipping: document.getElementById('previewShipping'),
                previewDiscount: document.getElementById('previewDiscount'),
                previewTotal: document.getElementById('previewTotal')
            };
            
            if (elements.previewSubtotal) elements.previewSubtotal.textContent = subtotal + ' RSD';
            if (elements.previewShipping) elements.previewShipping.textContent = shipping + ' RSD';
            if (elements.previewDiscount) elements.previewDiscount.textContent = discount + ' RSD';
            if (elements.previewTotal) elements.previewTotal.textContent = total + ' RSD';
        } else {
            const elements = {
                cartSubtotal: document.getElementById('cartSubtotal'),
                cartShipping: document.getElementById('cartShipping'),
                cartDiscount: document.getElementById('cartDiscount'),
                cartTotal: document.getElementById('cartTotal')
            };
            
            if (elements.cartSubtotal) elements.cartSubtotal.textContent = subtotal + ' RSD';
            if (elements.cartShipping) elements.cartShipping.textContent = shipping + ' RSD';
            if (elements.cartDiscount) elements.cartDiscount.textContent = discount + ' RSD';
            
            if (elements.cartTotal) {
                elements.cartTotal.textContent = total + ' RSD';
                elements.cartTotal.classList.remove('quick-pulse'); 
                void elements.cartTotal.offsetWidth; 
                elements.cartTotal.classList.add('quick-pulse');
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
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (e) {
            console.error('Greška pri čuvanju korpe:', e);
        }
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
        if (modal) modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (!sidebar) {
            console.error('Cart sidebar element ne postoji!');
            return;
        }
        
        // Toggle display i active klasu
        const isHidden = sidebar.style.display === 'none' || !sidebar.style.display;
        
        sidebar.style.display = isHidden ? 'block' : 'none';
        sidebar.classList.toggle('active', isHidden);
        document.body.classList.toggle('no-scroll', isHidden);
        
        // Ako otvaramo korpu, refresh-uj je
        if (isHidden) {
            this.renderCart();
            this.updateCartTotals();
        }
    }

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        if (!table) return;
        
        const isHidden = table.style.display === 'none';
        table.style.display = isHidden ? 'block' : 'none';
        
        // Update aria-expanded
        const toggleBtn = document.querySelector('.size-info');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', !isHidden);
        }
    }
    
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
        
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.style.display = 'block';
        }
        document.body.classList.add('no-scroll');
    }

    closeCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.style.display = 'none';
        }
        document.body.classList.remove('no-scroll');
        this.goToStep(1); 
    }

    goToStep(step) {
        const steps = {
            1: document.getElementById('checkoutStep1'),
            2: document.getElementById('checkoutStep2'),
            3: document.getElementById('checkoutStep3')
        };
        
        Object.values(steps).forEach(stepEl => {
            if (stepEl) stepEl.style.display = 'none';
        });
        
        if (steps[step]) {
            steps[step].style.display = 'block';
        }
        
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            if (stepNum <= step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    submitShippingForm(event) {
        event.preventDefault();

        const fields = {
            ime: document.getElementById('ime'),
            prezime: document.getElementById('prezime'),
            email: document.getElementById('email'),
            telefon: document.getElementById('telefon'),
            ulica: document.getElementById('ulica'),
            postanskiBroj: document.getElementById('postanskiBroj'),
            grad: document.getElementById('grad'),
            opstina: document.getElementById('opstina'),
            placanje: document.getElementById('placanje'),
            napomena: document.getElementById('napomena')
        };

        // Validacija da svi obavezni elementi postoje
        if (!fields.ime || !fields.prezime || !fields.email || !fields.telefon || 
            !fields.ulica || !fields.postanskiBroj || !fields.grad || !fields.placanje) {
            this.showToast("Greška: Molimo popunite sva obavezna polja!");
            return;
        }

        this.checkoutData = {
            ime: fields.ime.value,
            prezime: fields.prezime.value,
            email: fields.email.value,
            telefon: fields.telefon.value,
            ulica: fields.ulica.value,
            postanskiBroj: fields.postanskiBroj.value,
            grad: fields.grad.value,
            opstina: fields.opstina.value,
            placanje: fields.placanje.value,
            napomena: fields.napomena?.value || ''
        };

        // Update preview elements
        const previewElements = {
            previewIme: document.getElementById('previewIme'),
            previewEmail: document.getElementById('previewEmail'),
            previewTelefon: document.getElementById('previewTelefon'),
            previewAdresa: document.getElementById('previewAdresa'),
            previewPostaGrad: document.getElementById('previewPostaGrad'),
            previewPlacanje: document.getElementById('previewPlacanje'),
            previewNapomena: document.getElementById('previewNapomena')
        };

        if (previewElements.previewIme) {
            previewElements.previewIme.innerHTML = `<strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}`;
        }
        if (previewElements.previewEmail) {
            previewElements.previewEmail.innerHTML = `<strong>Email:</strong> ${this.checkoutData.email}`;
        }
        if (previewElements.previewTelefon) {
            previewElements.previewTelefon.innerHTML = `<strong>Telefon:</strong> ${this.checkoutData.telefon}`;
        }
        if (previewElements.previewAdresa) {
            previewElements.previewAdresa.innerHTML = `<strong>Adresa:</strong> ${this.checkoutData.ulica}`;
        }
        if (previewElements.previewPostaGrad) {
            previewElements.previewPostaGrad.innerHTML = `<strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`;
        }
        if (previewElements.previewPlacanje) {
            previewElements.previewPlacanje.innerHTML = `<strong>Plaćanje:</strong> ${this.getPaymentMethodText(this.checkoutData.placanje)}`;
        }
        if (previewElements.previewNapomena) {
            previewElements.previewNapomena.innerHTML = `<strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene.'}`;
        }

        this.renderPreviewOrderItems();
        this.updateCartTotals(true);

        this.goToStep(2);
    }

        // Update preview elements
        const previewElements = {
            previewIme: document.getElementById('previewIme'),
            previewEmail: document.getElementById('previewEmail'),
            previewTelefon: document.getElementById('previewTelefon'),
            previewAdresa: document.getElementById('previewAdresa'),
            previewPostaGrad: document.getElementById('previewPostaGrad'),
            previewPlacanje: document.getElementById('previewPlacanje'),
            previewNapomena: document.getElementById('previewNapomena')
        };

        if (previewElements.previewIme) {
            previewElements.previewIme.innerHTML = `<strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}`;
        }
        if (previewElements.previewEmail) {
            previewElements.previewEmail.innerHTML = `<strong>Email:</strong> ${this.checkoutData.email}`;
        }
        if (previewElements.previewTelefon) {
            previewElements.previewTelefon.innerHTML = `<strong>Telefon:</strong> ${this.checkoutData.telefon}`;
        }
        if (previewElements.previewAdresa) {
            previewElements.previewAdresa.innerHTML = `<strong>Adresa:</strong> ${this.checkoutData.ulica}`;
        }
        if (previewElements.previewPostaGrad) {
            previewElements.previewPostaGrad.innerHTML = `<strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`;
        }
        if (previewElements.previewPlacanje) {
            previewElements.previewPlacanje.innerHTML = `<strong>Plaćanje:</strong> ${this.getPaymentMethodText(this.checkoutData.placanje)}`;
        }
        if (previewElements.previewNapomena) {
            previewElements.previewNapomena.innerHTML = `<strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene.'}`;
        }

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
    
    completeOrder() {
        if (!this.checkoutData || !this.checkoutData.email) {
            this.showToast("Greška: Podaci kupca nisu popunjeni.");
            return;
        }
        
        const ADMIN_MAIL = 'ares.nyx.info@gmail.com'; 
        const SENDER_NAME = 'AresNyX Porudžbina';
        const BRAND_NAME = 'AresNyX'; 
        const FREE_SHIPPING_LIMIT = 4000; 
        const DISCOUNT_LIMIT = 8000;
        const baseShipping = 400; 

        const confirmationEmail = document.getElementById('confirmationEmail');
        if (confirmationEmail) {
            confirmationEmail.textContent = this.checkoutData.email;
        }
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_LIMIT ? 0 : baseShipping);
        const discount = subtotal >= DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + shipping - discount;

        const submitBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;

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

        // Check if emailjs is available
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS nije učitan!');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showToast("Greška: Email servis nije dostupan.");
            return;
        }

        const sendAdminPromise = emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams);
        const sendCustomerPromise = emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, templateParams);

        Promise.all([sendAdminPromise, sendCustomerPromise])
            .then((responses) => {
                console.log('Slanje e-mailova uspešno završeno.', responses);
                
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                this.renderCart(); 
                
                this.goToStep(3);
                
                this.showToast("Porudžbina uspešno poslata! Proverite Vaš email.");
            })
            .catch((error) => {
                console.error('Greška pri slanju:', error);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.showToast("Greška pri slanju porudžbine. Molimo kontaktirajte podršku.");
            });
    }

    validateStock() {
        const unavailableItems = [];

        this.cart.forEach(cartItem => {
            const product = this.products.find(p => p.id === cartItem.productId);

            if (!product) {
                unavailableItems.push({ 
                    name: cartItem.name, 
                    size: cartItem.size, 
                    reason: 'Proizvod više ne postoji u katalogu.' 
                });
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
}

// Initialize shop instance
let shop;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        shop = new AresNyXShop();
    });
} else {
    shop = new AresNyXShop();
            }
