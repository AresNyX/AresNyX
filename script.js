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
        
        this.init(); 
    }

    aggressivelyCloseAllModals() {
        const modalIds = ['productModal', 'checkoutModal'];
        modalIds.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'none';
            }
        });
        document.getElementById('cartSidebar')?.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.body.style.overflow = '';
        this.goToStep(1); 
    }

    init() {
        this.loadProducts();   
        // KRITIČNO: Pokreće inicijalno renderovanje proizvoda
        this.applyFiltersAndSort(); 
        
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 
        this.attachEventListeners(); 
        
        this.aggressivelyCloseAllModals(); 

        try {
            emailjs.init("WKV419-gz6OQWSgRJ"); 
        } catch (e) {
            console.error("EmailJS biblioteka nije pronađena ili nije inicijalizovana.");
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
                images: ["slika2.webp", "slike2a.webp"], 
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
    }

    getBadgeClass(badgeText) {
        const text = badgeText.toUpperCase();
        if (text === "PREMIUM" || text === "LUXURY") {
            return "badge-premium"; 
        } else if (text === "CLASSIC" || text === "BESTSELLER" || text === "ECO" || text === "TRENDING") {
            return "badge-classic"; 
        } else {
            return "badge-default"; 
        }
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
                 if (availableStock > 0) {
                     cartItem.quantity = availableStock;
                 }
                unavailableItems.push({ 
                    name: cartItem.name, 
                    size: cartItem.size, 
                    reason: `Traženo: ${cartItem.quantity}, Dostupno: ${availableStock}.` 
                });
            }
        });
        
        // Ukloni stavke sa 0 stocka iz korpe
        this.cart = this.cart.filter(item => {
            const product = this.products.find(p => p.id === item.productId);
            // Provera da li proizvod postoji i da li ima zaliha te veličine
            return product && (product.sizes[item.size] === undefined || product.sizes[item.size] > 0);
        });


        this.saveCart();
        this.renderCart(); 
        
        return unavailableItems;
    }

    // =========================================================
    // === METODE ZA FILTRIRANJE, SORTIRANJE I RENDER ===
    // =========================================================

    attachEventListeners() {
        // Nema ih mnogo jer su većinom inline ili se pozivaju iz JS
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel.classList.toggle('active');
    }

    filterProducts(value, filterType) {
        if (filterType === 'material') {
            this.currentMaterialFilter = value;
        } else if (filterType === 'size') {
            this.currentSizeFilter = value;
            
            // Logika za aktivnu klasu za filter veličine
            document.querySelectorAll('#sizeFilterOptions .size-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.size-btn[data-size="${value}"]`)?.classList.add('active');
        }
    }

    sortProducts(sortType) {
        this.currentSort = sortType;
    }

    applyAllFilters() {
        this.toggleFilterPanel();

        const materialValue = document.getElementById('materialFilter').value;
        const sortValue = document.getElementById('priceSort').value;
        
        this.currentMaterialFilter = materialValue;
        this.currentSort = sortValue;
        
        this.applyFiltersAndSort(); 
    }

    applyFiltersAndSort() {
        let tempProducts = [...this.products];

        // 1. PRIMENA FILTERA PO MATERIJALU
        if (this.currentMaterialFilter !== 'all') {
             tempProducts = tempProducts.filter(p => p.category === this.currentMaterialFilter);
        }

        // 2. PRIMENA FILTERA PO VELIČINI
        if (this.currentSizeFilter !== 'all') {
            // PROVERA: Filtriraj proizvode gde je tražena veličina dostupna (stock > 0)
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

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const displayProducts = this.filteredProducts; 
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/"; 

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
                        ${size} </button>
                `;
            })
            .join('');

            
        sizeSelector.innerHTML = sizesHtml;
        
        const btn = document.querySelector('#productModal .add-to-cart-btn');

        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            document.querySelector(`#sizeSelector .size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
             
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        } else {
             btn.disabled = true;
             btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
             btn.style.background = 'var(--danger)';
        }
        
        document.getElementById('sizeTable').style.display = 'none';
        document.getElementById('productModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
        document.getElementById('modalMainImage').src = BASE_IMAGE_URL + this.currentProduct.images[this.currentImageIndex];
        
        const totalImages = this.currentProduct.images.length;
        const sliderNav = document.querySelector('.slider-nav');

        if (totalImages > 1) {
            sliderNav.style.display = 'flex'; 
            
            const isFirst = this.currentImageIndex === 0;
            const isLast = this.currentImageIndex === totalImages - 1;
            
            document.getElementById('prevImageBtn').disabled = isFirst;
            document.getElementById('nextImageBtn').disabled = isLast;
        } else {
            sliderNav.style.display = 'none'; 
        }
    }
    
    selectSize(event, size, isDisabled) {
        if (isDisabled) return;
        this.currentSize = size;
        this.currentQuantity = 1; 
        document.getElementById('modalQty').textContent = '1';

        document.querySelectorAll('#sizeSelector .size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        
        const btn = document.querySelector('#productModal .add-to-cart-btn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
        btn.style.background = 'var(--primary-dark)';
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
        if (!this.currentProduct || !this.currentSize) {
            this.showToast("Molimo izaberite veličinu.");
            return;
        }
        
        const availableStock = this.currentProduct.sizes[this.currentSize] || 0;
        
        if (this.currentQuantity > availableStock) {
            this.showToast(`Greška: Dostupno je samo ${availableStock} komada za veličinu ${this.currentSize}.`);
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
        
        // Provera zaliha
        const product = this.products.find(p => p.id === productId);
        const availableStock = product?.sizes[size] || 0;
        
        if (change > 0 && item.quantity + change > availableStock) {
            this.showToast(`Dostupno je samo ${availableStock} komada za veličinu ${size}.`);
            return;
        }


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
        } else if (subtotal > 0 && subtotal < FREE_SHIPPING_LIMIT) {
            const nextTarget = FREE_SHIPPING_LIMIT - subtotal;
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `Dodajte još <strong>${nextTarget} RSD</strong> do Besplatne dostave!`;
        } else {
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `Dodajte proizvode da biste videli promo ponude!`;
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
        if (!toast) return;

        toast.textContent = message;
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    closeModal() {
        document.getElementById('productModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    toggleCart() {
         document.getElementById('cartSidebar').classList.toggle('active');
         document.body.classList.toggle('no-scroll');
    }

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        table.style.display = table.style.display === 'none' ? 'block' : 'none';
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
        document.body.classList.add('no-scroll');
    }

    closeCheckoutModal() {
        document.getElementById('checkoutModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
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
            
            this.showToast("Greška: Nema dovoljno zaliha. Korpa je ažurirana. Molimo proverite korpu.");
            
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
// === POKRETANJE NAKON UČITAVANJA DOM-a + KONTAKT FUNKCIJE ===
// =========================================================
let shop;

document.addEventListener('DOMContentLoaded', () => {
    shop = new AresNyXShop(); 
});

// Funkcija za pozivanje (telefon)
function pozoviNas() {
    const phoneNumber = '+381648700220'; 
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.location.href = `tel:${phoneNumber}`;
    } else {
        if (confirm(`Želite da pozovete broj: +381 64 8700220?\n\nNa desktopu možete kopirati broj.`)) {
            navigator.clipboard.writeText('+381 64 8700220')
                .then(() => {
                    alert('Broj telefona je kopiran u clipboard!');
                })
                .catch(() => {
                    prompt('Kopirajte broj telefona:', '+381 64 8700220');
                });
        }
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_click', {
            'contact_type': 'phone',
            'phone_number': '+381648700220'
        });
    }
}

// Funkcija za slanje email-a
function posaljiEmail() {
    const email = 'ares.nyx.info@gmail.com';
    const subject = 'Upit sa AresNyX sajta';
    const body = 'Poštovani AresNyX tim,\n\n';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const newTab = window.open(mailtoLink, '_blank');
    
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        window.location.href = mailtoLink;
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_click', {
            'contact_type': 'email',
            'email_address': email
        });
    }
}

// Opciono: Dodaj keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    // Omogući klik sa Enter/Space
    const clickableContacts = document.querySelectorAll('.contact-phone-clickable, .contact-email-clickable');
    
    clickableContacts.forEach(item => {
        item.setAttribute('tabindex', '0'); // Čini focusable
        item.setAttribute('role', 'button'); // ARIA role
        item.setAttribute('aria-label', item.classList.contains('contact-phone-clickable') 
            ? 'Pozovite nas na telefon +381 64 8700220' 
            : 'Pošaljite nam email na ares.nyx.info@gmail.com');
        
        // Enter/Space podrška
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.classList.contains('contact-phone-clickable')) {
                    pozoviNas();
                } else {
                    posaljiEmail();
                }
            }
        });
    });
    
    // Tooltip za desktop
    if (window.innerWidth > 768) {
        clickableContacts.forEach(item => {
            item.setAttribute('title', item.classList.contains('contact-phone-clickable') 
                ? 'Kliknite da pozovete' 
                : 'Kliknite da pošaljete email');
        });
    }
});



