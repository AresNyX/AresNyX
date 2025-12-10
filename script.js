Class AresNyXShop {
    
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
        this.checkoutData = {};
        
        this.init(); 
    }

    init() {
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.updateCartPromoMessage(0); 
        this.attachEventListeners();

        // EMAILJS INICIJALIZACIJA SA VAŠIM PUBLIC KLJUČEM
        try {
            // Proveriti da li je emailjs.js skripta učitana
            if (typeof emailjs !== 'undefined') {
                emailjs.init("WKV419-gz6OQWSgRJ"); // Vaš Public Key
            } else {
                 console.error("EmailJS biblioteka nije pronađena. Proverite da li je skripta ispravno učitana u HTML-u.");
            }
        } catch (e) {
            console.error("Greška pri inicijalizaciji EmailJS:", e);
        }
    } 
    
    // =========================================================
    // === POMOĆNE METODE ZA OBRADU PODATAKA ===
    // =========================================================

    /**
     * Učitava proizvode u memoriju.
     */
    loadProducts() {
        // ... (Ovaj deo koda je nepromenjen, ostaje isti kao Vaš) ...
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
    }
    // ... (Ostatak loadProducts metoda je nepromenjen) ...

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
        // ... (Kod je isti, radi filtriranje) ...
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    this.currentSizeFilter = size;
                    this.applyFiltersAndSort(); // Dodato za real-time filtriranje sa desktop bara
                }
            });
        }
        
        // Dodavanje globalnog event listenera za zatvaranje modala klikom na overlay
        document.getElementById('productModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.closeModal();
            }
        });
        document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'checkoutModal') {
                this.closeCheckoutModal();
            }
        });
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

                // NAPOMENA: Uklonjen nepostojeći 'title' i ispravljen tekst kod disabled dugmeta
                return `
                    <button 
                        class="size-option ${isDisabled ? 'disabled' : ''}"
                        data-size="${size}" 
                        onclick="shop.selectSize(event, '${size}', ${isDisabled})" 
                        ${isDisabled ? 'disabled' : ''}
                    >
                        ${size}${isDisabled ? '' : ''}
                    </button>
                `;
            })
            .join('');
            
        sizeSelector.innerHTML = sizesHtml;
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
        } 
        
        const btn = document.querySelector('.add-to-cart-btn');
        // KORIŠĆENJE FONT AWESOME IKONA (Potrebno je da ih imate u <head>)
        if (!firstAvailableSize) {
             btn.disabled = true;
             btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
             btn.style.backgroundColor = 'var(--danger)'; // Direktna manipulacija CSS varijablom
        } else {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
            btn.style.backgroundColor = 'var(--primary-dark)';
            btn.disabled = false;
        }

        document.getElementById('sizeTable').style.display = 'none';
        
        // ⭐ KRITIČNA PROMENA: Koristimo CSS klasu `modal-overlay` koja je responsivna ⭐
        document.getElementById('productModal').style.display = 'flex'; 
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
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        
        // Ažuriranje količine pri promeni veličine
        this.currentQuantity = 1;
        document.getElementById('modalQty').textContent = this.currentQuantity;
    }

    changeQuantity(change) {
        // Dodatna provera za maksimalnu količinu
        const maxStock = this.currentProduct?.sizes[this.currentSize] || 0;
        
        let newQty = this.currentQuantity + change;
        
        if (newQty > maxStock) {
            newQty = maxStock;
            this.showToast(`Maksimalna količina za veličinu ${this.currentSize} je ${maxStock}`);
        }
        
        this.currentQuantity = Math.max(1, newQty);
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
        const originalBg = btn.style.backgroundColor; // Čuvamo originalnu boju
        
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.backgroundColor = 'var(--success)';
        
        this.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        
        this.updateCartCount();
        this.renderCart(); 
        
        this.showToast(`${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`);
        
        setTimeout(() => {
            this.closeModal();
            btn.innerHTML = originalText;
            btn.style.backgroundColor = originalBg; // Vraćamo originalnu boju
            btn.disabled = false;
        }, 500); 
    }

    addToCart(productId, size, quantity) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.productId === productId && item.size === size);

        if (existingItem) {
            // Dodatna provera: Ažurirana količina ne sme preći maksimum na zalihama
            const maxStock = product.sizes[size] || 0;
            existingItem.quantity = Math.min(maxStock, existingItem.quantity + quantity);
            if (existingItem.quantity < quantity + existingItem.quantity) {
                 this.showToast(`Maksimalna količina za veličinu ${size} je ${maxStock}.`);
            }
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
        
        // Prikazuje brojač samo ako ima stavki
        cartCount.style.display = totalItems > 0 ? 'block' : 'none'; 
        
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
        const cartItems = document.getElementById('cartItems'); // Da proverimo da li je prazna

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
            cartItemsContainer.innerHTML = `<div class="empty-cart" id="emptyCart"><span class="empty-cart-icon">🛍️</span><p>Vaša korpa je prazna</p></div>`;
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
        const maxStock = product.sizes[size] || 0;
        
        const newQty = item.quantity + change;

        if (newQty < 1) {
            this.removeCartItem(productId, size); 
            return;
        }
        
        if (newQty > maxStock) {
            this.showToast(`Maksimalna količina za veličinu ${size} je ${maxStock}.`);
            return;
        }

        item.quantity = newQty;
        
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
        } else if (subtotal > 0) {
            const nextTarget = FREE_SHIPPING_LIMIT - subtotal;
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `Dodajte još <strong>${nextTarget} RSD</strong> do Besplatne dostave!`;
        } else {
             cartPromo.classList.remove('success');
             cartPromo.innerHTML = `Minimalna porudžbina 1.000 RSD! Dostava 400 RSD.`;
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

            // Animacija ukupnog iznosa
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
        
        // Koristimo confirm za jednostavnu potvrdu, ali JS kod je dobar
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
        if (!toast) return; // Sigurnosna provera
        
        toast.textContent = message;
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    closeModal() {
        // ⭐ KRITIČNA PROMENA: Vraćamo display na 'none' za overlay ⭐
        document.getElementById('productModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    toggleCart() {
         document.getElementById('cartSidebar').classList.toggle('active');
         document.body.classList.toggle('no-scroll');
    }

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        table.style.display = table.style.display === 'none' ? 'table' : 'none'; // Promenjeno na 'table'
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
        // ⭐ KRITIČNA PROMENA: Vraćamo display na 'flex' za overlay ⭐
        document.getElementById('checkoutModal').style.display = 'flex'; 
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
            postanskiBro


