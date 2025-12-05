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
        
        console.log('AresNyXShop konstruktor pozvan');
    }

    init() {
        console.log('Inicijalizacija počinje');
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 

        try {
            emailjs.init("WKV419-gz6OQWSgRJ");
            console.log('EmailJS inicijalizovan');
        } catch (e) {
            console.error("EmailJS biblioteka nije pronađena.");
        }
    }

    loadProducts() {
        console.log('Učitavanje proizvoda...');
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
        console.log(`Učitano ${this.products.length} proizvoda`);
    }

    renderProducts() {
        console.log('Renderovanje proizvoda...');
        const grid = document.getElementById('productsGrid');
        if (!grid) {
            console.error('productsGrid nije pronađen!');
            return;
        }

        if (!this.filteredProducts || this.filteredProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = this.filteredProducts.map(product => {
            const imageSrc = product.images[0];
            
            return `
              <div class="product-card" data-id="${product.id}">
                ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
                
                <img src="${imageSrc}" 
                     alt="${product.name}" 
                     class="product-image"
                     loading="lazy"> 

                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-material">${product.material}</p>
                    <p class="product-price">${product.price} RSD</p>
                    <button class="btn-view" onclick="window.shop.openProductModal(${product.id})">Pogledaj</button>
                </div>
              </div>
            `;
        }).join('');
        
        console.log(`Renderovano ${this.filteredProducts.length} proizvoda`);
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    filterProducts(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } else if (filterType === 'size') {
            this.currentSizeFilter = value;
            
            document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
            if (value !== 'all') {
                const btn = document.querySelector(`.size-btn[data-size="${value}"]`);
                if (btn) btn.classList.add('active');
            } else {
                const btn = document.querySelector(`.size-btn[data-size="all"]`);
                if (btn) btn.classList.add('active');
            }
        }
    }

    sortProducts(sortType) {
        this.currentSort = sortType;
    }

    applyAllFilters() {
        this.toggleFilterPanel();
        
        const materialSelect = document.getElementById('materialFilter');
        const sortSelect = document.getElementById('priceSort');
        
        if (materialSelect) this.currentMaterialFilter = materialSelect.value;
        if (sortSelect) this.currentSort = sortSelect.value;
        
        this.applyFiltersAndSort(); 
    }

    applyFiltersAndSort() {
        console.log('Primena filtera i sortiranja...');
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
        console.log(`Otvaranje modala za proizvod ID: ${productId}`);
        this.currentProduct = this.products.find(p => p.id === productId);
        if (!this.currentProduct) {
            console.error('Proizvod nije pronađen');
            return;
        }

        this.currentSize = null; 
        this.currentQuantity = 1;
        this.currentImageIndex = 0;

        const modalTitle = document.getElementById('modalTitle');
        const modalMaterial = document.getElementById('modalMaterial');
        const modalPrice = document.getElementById('modalPrice');
        const modalQty = document.getElementById('modalQty');
        
        if (modalTitle) modalTitle.textContent = this.currentProduct.name;
        if (modalMaterial) modalMaterial.textContent = this.currentProduct.material;
        if (modalPrice) modalPrice.textContent = `${this.currentProduct.price} RSD`;
        if (modalQty) modalQty.textContent = '1';

        this.updateModalImage();

        const sizeSelector = document.getElementById('sizeSelector');
        let firstAvailableSize = null;

        if (sizeSelector) {
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
                            onclick="window.shop.selectSize(event, '${size}', ${isDisabled})" 
                            ${isDisabled ? 'disabled' : ''}
                        >
                            ${size}
                        </button>
                    `;
                })
                .join('');
                
            sizeSelector.innerHTML = sizesHtml;
        }
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            const sizeOption = document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`);
            if (sizeOption) sizeOption.classList.add('selected');
        } 
        
        const btn = document.querySelector('.add-to-cart-btn');
        if (btn) {
            if (!firstAvailableSize) {
                 btn.disabled = true;
                 btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
                 btn.style.background = 'var(--danger)';
            } else {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
                btn.style.background = 'var(--primary-dark)';
                btn.disabled = false;
            }
        }

        const sizeTable = document.getElementById('sizeTable');
        if (sizeTable) sizeTable.style.display = 'none';
        
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.classList.add('no-scroll');
        }
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        const modalImage = document.getElementById('modalMainImage');
        if (modalImage && this.currentProduct.images[this.currentImageIndex]) {
            modalImage.src = this.currentProduct.images[this.currentImageIndex];
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
        if (isDisabled) {
            return;
        }

        this.currentSize = size;
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('selected');
        }
    }

    changeQuantity(change) {
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
        const modalQty = document.getElementById('modalQty');
        if (modalQty) modalQty.textContent = this.currentQuantity;
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
        console.log('Dodavanje u korpu iz modala...');
        if (!this.currentProduct || !this.currentSize) {
            console.error('Nema proizvoda ili veličine');
            return;
        }
        
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
        console.log(`Dodavanje u korpu: ${productId}, ${size}, ${quantity}`);
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.error('Proizvod nije pronađen');
            return;
        }
        
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
        if (cartCount) {
            cartCount.textContent = totalItems;
            
            cartCount.classList.remove('quick-pulse'); 
            void cartCount.offsetWidth;
            cartCount.classList.add('quick-pulse');
        }
        
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
        console.log('Renderovanje korpe...');
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) {
            console.error('cartItems nije pronađen!');
            return;
        }

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart" id="emptyCart" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i>
                    <p>Vaša korpa je prazna</p>
                </div>
            `;
            this.toggleCartVisibility(); 
            this.updateCartTotals(); 
            return;
        }

        cartItemsContainer.innerHTML = ''; 

        this.cart.forEach((item, index) => {
            const itemHtml = `
                <div class="cart-item" data-id="${item.productId}" data-size="${item.size}">
                    <button class="cart-item-remove" onclick="window.shop.removeCartItem(${index})" title="Ukloni proizvod">×</button>
                    <img src="${item.image}" alt="${item.name} veličine ${item.size}" class="cart-item-image" loading="lazy">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-size">Veličina: ${item.size}</div>
                        <div class="cart-item-controls">
                            <div class="cart-item-qty-wrapper">
                                <button class="cart-item-qty-btn" onclick="window.shop.updateCartItemQuantity(${index}, -1)">-</button>
                                <span class="cart-item-qty">${item.quantity}</span>
                                <button class="cart-item-qty-btn" onclick="window.shop.updateCartItemQuantity(${index}, 1)">+</button>
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
        console.log(`Ažuriranje količine: index=${index}, change=${change}`);
        if (index < 0 || index >= this.cart.length) {
            console.error('Nevažeći indeks');
            return;
        }
        
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
            const qtyElement = cartItem.querySelector('.cart-item-qty');
            const priceElement = cartItem.querySelector('.cart-item-price');
            if (qtyElement) qtyElement.textContent = item.quantity;
            if (priceElement) priceElement.textContent = (item.price * item.quantity) + ' RSD';
        }
        
        this.updateCartTotals();
        this.showToast(change > 0 ? "Količina povećana" : "Količina smanjena");
    }

    removeCartItem(index) {
        console.log(`Uklanjanje iz korpe: index=${index}`);
        if (index < 0 || index >= this.cart.length) {
            console.error('Nevažeći indeks');
            return;
        }
        
        const item = this.cart[index];
        this.cart.splice(index, 1);
        this.saveCart();
        
        this.updateCartCount(); 
        this.showToast(`"${item.name}" je uklonjen iz korpe`);
        
        if (this.cart.length === 0) {
            this.renderCart(); 
        } else {
            this.renderCart();
        }
    }

    updateCartPromoMessage(subtotal) {
        const cartPromo = document.getElementById('cartPromoMessage');
        if (!cartPromo) return;

        const FREE_SHIPPING_LIMIT = 4000;
        const DISCOUNT_LIMIT = 8000;
        
        if (subtotal >= DISCOUNT_LIMIT) {
            cartPromo.className = 'cart-promo-message success';
            cartPromo.innerHTML = '✅ Ostvarili ste <strong>Besplatnu dostavu</strong> i <strong>10% Popusta</strong>!';
        } else if (subtotal >= FREE_SHIPPING_LIMIT) {
            const nextTarget = DISCOUNT_LIMIT - subtotal;
            cartPromo.className = 'cart-promo-message';
            cartPromo.innerHTML = `🔥 Ostvarili ste <strong>BESPLATNU DOSTAVU</strong>! Dodajte još <strong>${nextTarget} RSD</strong> za 10% Popusta!`;
        } else {
            const nextTarget = FREE_SHIPPING_LIMIT - subtotal;
            cartPromo.className = 'cart-promo-message';
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
            const previewSubtotal = document.getElementById('previewSubtotal');
            const previewShipping = document.getElementById('previewShipping');
            const previewDiscount = document.getElementById('previewDiscount');
            const previewTotal = document.getElementById('previewTotal');
            
            if (previewSubtotal) previewSubtotal.textContent = subtotal + ' RSD';
            if (previewShipping) previewShipping.textContent = shipping + ' RSD';
            if (previewDiscount) previewDiscount.textContent = discount + ' RSD';
            if (previewTotal) previewTotal.textContent = total + ' RSD';
        } else {
            const cartSubtotal = document.getElementById('cartSubtotal');
            const cartShipping = document.getElementById('cartShipping');
            const cartDiscount = document.getElementById('cartDiscount');
            const cartTotal = document.getElementById('cartTotal');
            
            if (cartSubtotal) cartSubtotal.textContent = subtotal + ' RSD';
            if (cartShipping) cartShipping.textContent = shipping + ' RSD';
            if (cartDiscount) cartDiscount.textContent = discount + ' RSD';
            
            if (cartTotal) {
                cartTotal.textContent = total + ' RSD';
                cartTotal.classList.remove('quick-pulse'); 
                void cartTotal.offsetWidth; 
                cartTotal.classList.add('quick-pulse');
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
        console.log('Korpa sačuvana u localStorage');
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.error('Toast element nije pronađen');
            return;
        }
        
        toast.textContent = message;
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.classList.remove('no-scroll');
    }

    toggleCart() {
        console.log('Toggle cart pozvan');
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        } else {
            console.error('cartSidebar nije pronađen!');
        }
    }

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        if (table) {
            table.style.display = table.style.display === 'none' ? 'block' : 'none';
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
        console.log('Početak checkout-a');
        if (this.cart.length === 0) {
            this.showToast("Vaša korpa je prazna!");
            return;
        }
        
        this.toggleCart();
        this.goToStep(1);
        
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.style.display = 'block';
            document.body.classList.add('no-scroll');
        }
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
        const step1 = document.getElementById('checkoutStep1');
        const step2 = document.getElementById('checkoutStep2');
        const step3 = document.getElementById('checkoutStep3');
        
        if (step1) step1.style.display = step === 1 ? 'block' : 'none';
        if (step2) step2.style.display = step === 2 ? 'block' : 'none';
        if (step3) step3.style.display = step === 3 ? 'block' : 'none';
    }

    submitShippingForm(event) {
        event.preventDefault();
        console.log('Submit shipping forme');

        this.checkoutData = {
            ime: document.getElementById('ime')?.value || '',
            prezime: document.getElementById('prezime')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefon: document.getElementById('telefon')?.value || '',
            ulica: document.getElementById('ulica')?.value || '',
            postanskiBroj: document.getElementById('postanskiBroj')?.value || '',
            grad: document.getElementById('grad')?.value || '',
            opstina: document.getElementById('opstina')?.value || '',
            placanje: document.getElementById('placanje')?.value || 'pouzecem',
            napomena: document.getElementById('napomena')?.value || ''
        };

        const previewIme = document.getElementById('previewIme');
        const previewEmail = document.getElementById('previewEmail');
        const previewTelefon = document.getElementById('previewTelefon');
        const previewAdresa = document.getElementById('previewAdresa');
        const previewPostaGrad = document.getElementById('previewPostaGrad');
        const previewPlacanje = document.getElementById('previewPlacanje');
        const previewNapomena = document.getElementById('previewNapomena');

        if (previewIme) previewIme.innerHTML = `<strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}`;
        if (previewEmail) previewEmail.innerHTML = `<strong>Email:</strong> ${this.checkoutData.email}`;
        if (previewTelefon) previewTelefon.innerHTML = `<strong>Telefon:</strong> ${this.checkoutData.telefon}`;
        if (previewAdresa) previewAdresa.innerHTML = `<strong>Adresa:</strong> ${this.checkoutData.ulica}`;
        if (previewPostaGrad) previewPostaGrad.innerHTML = `<strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`;
        if (previewPlacanje) previewPlacanje.innerHTML = `<strong>Plaćanje:</strong> ${this.getPaymentMethodText(this.checkoutData.placanje)}`;
        if (previewNapomena) previewNapomena.innerHTML = `<strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene.'}`;

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
        console.log('Kompletiranje porudžbine...');
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

        console.log('Slanje emailova...');
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
}

// GLOBALNA INSTANCA I INICIJALIZACIJA
let shop = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM učitan, pokrećem shop...');
    
    shop = new AresNyXShop();
    shop.init();
    
    // OBAVEZNO: Postavi shop kao globalnu varijablu
    window.shop = shop;
    
    // Renderuj proizvode nakon kratkog kašnjenja
    setTimeout(() => {
        shop.renderProducts();
    }, 100);
    
    console.log('Shop inicijalizovan i postavljen kao window.shop');
    
    // Event listener za cart dugme (alternativni način)
    const cartNavLink = document.querySelector('.cart-nav-link');
    if (cartNavLink) {
        cartNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.shop) {
                window.shop.toggleCart();
            }
        });
    }
});
