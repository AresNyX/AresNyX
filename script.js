/**
 * Klasa AresNyXShop upravlja celokupnom logikom e-commerce frontenda:
 * učitavanje proizvoda, filteri, sortiranje, korpa, modal i proces plaćanja (checkout).
 */
class AresNyXShop {
    
    // =========================================================
    // === KONSTRUKTOR I INICIJALIZACIJA ===
    // =========================================================
    constructor() {
        // Učitavanje stanja
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.filteredProducts = []; 
        this.currentMaterialFilter = 'all'; 
        this.currentSizeFilter = 'all';     
        this.currentSort = 'default'; 
        
        // Stanja Modala i Checkoputa
        this.currentProduct = null;
        this.currentSize = null;
        this.currentQuantity = 1;
        this.currentImageIndex = 0;
        this.checkoutData = {};
        
        // Konstante
        this.BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/";
        this.FREE_SHIPPING_LIMIT = 4000;
        this.DISCOUNT_LIMIT = 8000;
        this.BASE_SHIPPING = 400;

        this.init(); 
    }

    init() {
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.attachEventListeners();

        // 🚀 KLJUČNO POBOLJŠANJE: Prikazujemo sve proizvode na startu
        this.filteredProducts = [...this.products]; // Inicijalizuje se sa svim proizvodima
        this.renderProducts(); // Renderuje sve proizvode

        // EMAILJS INICIJALIZACIJA SA VAŠIM PUBLIC KLJUČEM
        try {
            // Zamijenite 'WKV419-gz6OQWSgRJ' sa Vašim Public Key-em
            emailjs.init("WKV419-gz6OQWSgRJ"); 
        } catch (e) {
            console.error("EmailJS biblioteka nije pronađena ili nije inicijalizovana:", e);
        }
    } 
    
    // =========================================================
    // === POMOĆNE METODE ZA OBRADU PODATAKA ===
    // =========================================================

    /**
     * Učitava proizvode u memoriju.
     * NAPOMENA: Korigovan category za Light Blue da odgovara 'pamuk' radi doslednosti
     * sa filterima, ako se koristi select/option value="pamuk".
     */
    loadProducts() {
        this.products = [
            { id: 1, name: "Classic Pamuk", material: "100% Organski Pamuk", price: 1300, category: "pamuk", images: ["slika1.webp", "slika1a.webp"], badge: "CLASSIC", sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 } },
            { id: 2, name: "Egipt Pamuk", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika2.webp", "slike2a.webp"], badge: "BESTSELLER", sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: 8 } },
            { id: 3, name: "Elegant", material: "100% Prirodni Pamuk", price: 1600, category: "pamuk", images: ["slika3.webp", "slika3a.webp"], badge: "LUXURY", sizes: { S: 7, M: 0, L: 5, XL: 0, XXL: 3 } },
            { id: 4, name: "Grey Elegant", material: "100% Premium Pamuk", price: 1600, category: "pamuk", images: ["slika4.webp", "slika4a.webp"], badge: "PREMIUM", sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 } },
            { id: 5, name: "Ink Blue", material: "100% Organski Pamuk", price: 1500, category: "pamuk", images: ["slika5.webp", "slika5a.webp"], badge: "LUXURY", sizes: { S: 2, M: 3, L: 0, XL: 0, XXL: 1 } },
            { id: 6, name: "Blue White", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika6.webp", "slika6a.webp"], badge: "TRENDING", sizes: { S: 8, M: 8, L: 8, XL: 8, XXL: 8 } },
            { id: 7, name: "Black & White", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika7.webp", "slika7a.webp"], badge: "LUXURY", sizes: { S: 6, M: 6, L: 6, XL: 6, XXL: 6 } },
            { id: 8, name: "Light Blue", material: "100% Premium Pamuk", price: 1400, category: "pamuk", images: ["slika8.webp", "slika8a.webp"], badge: "NEW", sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 } }, // KORIGOVANO
            { id: 9, name: "Blue", material: "100% Premium Pamuk", price: 1600, category: "pamuk", images: ["slika9.webp", "slika9a.webp"], badge: "PREMIUM", sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 1 } },
            { id: 10, name: "Petrol Blue", material: "100% Arabic Pamuk", price: 1600, category: "pamuk", images: ["slika10.webp", "slika10a.webp"], badge: "LUXURY", sizes: { S: 1, M: 1, L: 1, XL: 1, XXL: 0 } },
            { id: 11, name: "Grey White", material: "100% Organski Pamuk", price: 1500, category: "pamuk", images: ["slika11.webp", "slika11a.webp"], badge: "PREMIUM", sizes: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 } }
        ];
    }

    /**
     * Postavlja CSS klasu za badge na osnovu teksta (za stilizaciju boje).
     */
    getBadgeClass(badgeText) {
        const text = badgeText.toUpperCase();
        if (["PREMIUM", "LUXURY"].includes(text)) {
            return "badge-premium"; 
        } else if (["CLASSIC", "BESTSELLER", "ECO", "TRENDING"].includes(text)) {
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

    /**
     * Ažurira DOM elemente filtera i postavlja filter veličine
     */
    updateSizeFilterUI(newSize) {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        if (newSize !== 'all') {
            document.querySelector(`.size-btn[data-size="${newSize}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.size-btn[data-size="all"]`)?.classList.add('active');
        }
    }

    // =========================================================
    // === METODE ZA FILTRIRANJE, SORTIRANJE I RENDER ===
    // =========================================================

    /**
     * Postavlja sve event listenere.
     */
    attachEventListeners() {
        // Event listener za filter veličine
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    this.currentSizeFilter = size;
                    this.updateSizeFilterUI(size);
                    // Opciono: Automatski primeni filter nakon klika na veličinu,
                    // ali je bolje sačekati dugme 'Primeni filtere'
                }
            });
        }
        
        // Event listener za dugme "Primeni filtere"
        document.getElementById('applyFiltersBtn')?.addEventListener('click', () => this.applyAllFilters());
        
        // Event listener za otvaranje/zatvaranje filter panela
        document.getElementById('filterSortBtn')?.addEventListener('click', () => this.toggleFilterPanel());

        // Dodajte listenere za closeModal i closeCheckoutModal
        document.getElementById('productModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) this.closeModal();
        });
        document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) this.closeCheckoutModal();
        });
    }

    /**
     * Otvara/zatvara panel za filtere.
     */
    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel?.classList.toggle('active');
    }

    /**
     * Pokreće kompletnu logiku filtera nakon klika na dugme "Primeni filtere".
     */
    applyAllFilters() {
        this.toggleFilterPanel();

        const materialSelect = document.getElementById('materialFilter');
        const sortSelect = document.getElementById('priceSort');
        
        // Ažuriranje stanja na osnovu DOM vrednosti
        this.currentMaterialFilter = materialSelect?.value || 'all';
        this.currentSort = sortSelect?.value || 'default';
        
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
            const size = this.currentSizeFilter;
            tempProducts = tempProducts.filter(p => 
                p.sizes && p.sizes[size] > 0
            );
        }
        
        // Ažuriranje filtrirane liste
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

        if (!grid) {
             console.error('HTML element #productsGrid nije pronađen!');
             return;
        }

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = displayProducts.map(product => {
            const imageSrc = this.BASE_IMAGE_URL + product.images[0]; 
            const badgeClass = this.getBadgeClass(product.badge);

            const srcset = product.images.map((imgName, index) => {
                const width = (index === 0) ? '800w' : '400w'; 
                return `${this.BASE_IMAGE_URL}${imgName} ${width}`;
            }).join(', ');
            
            return `
              <div class="product-card" data-id="${product.id}" onclick="shop.openProductModal(${product.id})" tabindex="0">
        
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

        // Prikaz osnovnih podataka
        document.getElementById('modalTitle').textContent = this.currentProduct.name;
        document.getElementById('modalMaterial').textContent = this.currentProduct.material;
        document.getElementById('modalPrice').textContent = `${this.currentProduct.price} RSD`;
        document.getElementById('modalQty').textContent = '1';

        this.updateModalImage();
        this.renderSizeSelector();

        // Prikaz modala
        document.getElementById('sizeTable').style.display = 'none';
        document.getElementById('productModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    }
    
    /**
     * Renderuje dugmad za odabir veličine u modalu
     */
    renderSizeSelector() {
        const sizeSelector = document.getElementById('sizeSelector');
        let firstAvailableSize = null;
        const btn = document.querySelector('.add-to-cart-btn');
        
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
            }).join('');
            
        sizeSelector.innerHTML = sizesHtml;
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        } else {
             btn.disabled = true;
             btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
             btn.style.background = 'var(--danger)';
        }
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        document.getElementById('modalMainImage').src = this.BASE_IMAGE_URL + this.currentProduct.images[this.currentImageIndex];
        
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
        this.currentQuantity = 1; // Resetuj količinu pri promeni veličine
        document.getElementById('modalQty').textContent = 1;
    }

    changeQuantity(change) {
        if (!this.currentSize || !this.currentProduct) return;

        const maxStock = this.currentProduct.sizes[this.currentSize];
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
        this.currentQuantity = Math.min(this.currentQuantity, maxStock); // Ograničenje na zalihe

        document.getElementById('modalQty').textContent = this.currentQuantity;
        
        // Prikaz upozorenja ako je max dostignut
        if (this.currentQuantity === maxStock && change > 0) {
            this.showToast("Dostigli ste maksimalnu dostupnu količinu.");
        }
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
            this.showToast("Molimo odaberite veličinu!");
            return;
        }
        
        const btn = event.currentTarget;
        if (btn.disabled) return;
        btn.disabled = true;

        const originalText = btn.innerHTML;
        
        // Brza vizuelna povratna informacija
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.background = 'var(--success)';
        
        this.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        
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

        const imageURL = this.BASE_IMAGE_URL + product.images[0];

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
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
        this.updateCartCount();
        this.renderCart(); 
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
        const cartItemsContainer = document.getElementById('cartItems');

        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart" id="emptyCart" style="text-align: center; padding: 2rem;"><i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i><p>Vaša korpa je prazna</p></div>`;
            this.toggleCartVisibility(); 
            this.updateCartTotals(); 
            return;
        }
        
        cartItemsContainer.innerHTML = this.cart.map((item) => `
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
            <span class="cart-item-price">${(item.price * item.quantity).toLocaleString('sr-RS')} RSD</span>
        </div>
    </div>
</div>
`).join('');

        this.toggleCartVisibility(); 
        this.updateCartTotals();
    }

    
    updateCartItem(productId, size, change) {
        const item = this.cart.find(i => i.productId === productId && i.size === size);
        if (!item) return;
        
        const product = this.products.find(p => p.id === productId);
        const maxStock = product?.sizes[size] || 0;

        let newQuantity = item.quantity + change;
        
        if (newQuantity > maxStock) {
            newQuantity = maxStock;
            this.showToast("Maksimalna zaliha je dostignuta.");
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
            cartItem.querySelector('.cart-item-price').textContent = (item.price * item.quantity).toLocaleString('sr-RS') + ' RSD';
        }
        
        this.updateCartTotals();
    }

    removeCartItem(productId, size) {
        const index = this.cart.findIndex(i => i.productId === productId && i.size === size);
        if (index > -1) {
            const itemName = this.cart[index].name;
            this.cart.splice(index, 1);
            this.saveCart();
            
            // Efikasno uklanjanje iz DOM-a bez ponovnog renderovanja cele korpe
            document.querySelector(`.cart-item[data-id="${productId}"][data-size="${size}"]`)?.remove();

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

        if (subtotal >= this.DISCOUNT_LIMIT) {
            cartPromo.classList.add('success');
            cartPromo.innerHTML = '✅ Ostvarili ste <strong>Besplatnu dostavu</strong> i <strong>10% Popusta</strong>!';
        } else if (subtotal >= this.FREE_SHIPPING_LIMIT) {
            const nextTarget = (this.DISCOUNT_LIMIT - subtotal).toLocaleString('sr-RS');
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `🔥 Ostvarili ste <strong>BESPLATNU DOSTAVU</strong>! Dodajte još <strong>${nextTarget} RSD</strong> za 10% Popusta!`;
        } else {
            const nextTarget = (this.FREE_SHIPPING_LIMIT - subtotal).toLocaleString('sr-RS');
            cartPromo.classList.remove('success');
            cartPromo.innerHTML = `Dodajte još <strong>${nextTarget} RSD</strong> do Besplatne dostave!`;
        }
    }

    updateCartTotals(preview = false) {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const shipping = subtotal === 0 ? 0 : (subtotal >= this.FREE_SHIPPING_LIMIT ? 0 : this.BASE_SHIPPING);
        const discount = subtotal >= this.DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        
        const total = subtotal + shipping - discount;
        
        const format = (value) => value.toLocaleString('sr-RS') + ' RSD';
        
        if (preview) {
            document.getElementById('previewSubtotal').textContent = format(subtotal);
            document.getElementById('previewShipping').textContent = format(shipping);
            document.getElementById('previewDiscount').textContent = format(discount);
            document.getElementById('previewTotal').textContent = format(total);
        } else {
            document.getElementById('cartSubtotal').textContent = format(subtotal);
            document.getElementById('cartShipping').textContent = format(shipping);
            document.getElementById('cartDiscount').textContent = format(discount);
            
            const totalElement = document.getElementById('cartTotal');
            if (totalElement) {
                totalElement.textContent = format(total);
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
        
        if (confirm("Da li ste sigurni da želite da ispraznite korpu?")) {
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
        
        setTimeout(() => toast.classList.remove('show'), 3000);
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

        // Jednostavnija i robustnija provera forme
        const form = event.target;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        this.checkoutData = {
            ime: form.ime.value,
            prezime: form.prezime.value,
            email: form.email.value,
            telefon: form.telefon.value,
            ulica: form.ulica.value,
            postanskiBroj: form.postanskiBroj.value,
            grad: form.grad.value,
            opstina: form.opstina.value,
            placanje: form.placanje.value,
            napomena: form.napomena.value
        };

        this.renderPreviewData();
        this.updateCartTotals(true);

        this.goToStep(2); 
    }
    
    /**
     * Renderuje sve podatke kupca u pregledu porudžbine (Korak 2).
     */
    renderPreviewData() {
        const data = this.checkoutData;
        document.getElementById('previewIme').innerHTML = `<strong>Ime i Prezime:</strong> ${data.ime} ${data.prezime}`;
        document.getElementById('previewEmail').innerHTML = `<strong>Email:</strong> ${data.email}`;
        document.getElementById('previewTelefon').innerHTML = `<strong>Telefon:</strong> ${data.telefon}`;
        document.getElementById('previewAdresa').innerHTML = `<strong>Adresa:</strong> ${data.ulica}`;
        document.getElementById('previewPostaGrad').innerHTML = `<strong>Mesto:</strong> ${data.postanskiBroj} ${data.grad}${data.opstina ? ` (${data.opstina})` : ''}`;
        document.getElementById('previewPlacanje').innerHTML = `<strong>Plaćanje:</strong> ${this.getPaymentMethodText(data.placanje)}`;
        document.getElementById('previewNapomena').innerHTML = `<strong>Napomena:</strong> ${data.napomena || 'Nema napomene.'}`;

        this.renderPreviewOrderItems();
    }

    renderPreviewOrderItems() {
        const container = document.getElementById('previewOrderItems');
        container.innerHTML = this.cart.map(item => `
            <div class="preview-item">
                <span style="font-weight: 700;">${item.quantity}x ${item.name} (${item.size})</span>
                <span style="float: right;">${(item.price * item.quantity).toLocaleString('sr-RS')} RSD</span>
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
                    <p style="font-size: 14px; margin: 0;">Jedinična cena: ${item.price.toLocaleString('sr-RS')} RSD</p>
                    <p style="font-size: 14px; font-weight: bold; margin: 5px 0 0 0; color: #D4AF37;">Ukupno za stavku: ${total.toLocaleString('sr-RS')} RSD</p>
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
        if (!this.checkoutData.email || this.cart.length === 0) {
            this.showToast("Greška: Podaci kupca ili korpa nisu popunjeni.");
            this.goToStep(1);
            return;
        }
        
        const ADMIN_MAIL = 'ares.nyx.info@gmail.com'; 
        const SENDER_NAME = 'AresNyX Porudžbina';
        const BRAND_NAME = 'AresNyX'; 
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal === 0 ? 0 : (subtotal >= this.FREE_SHIPPING_LIMIT ? 0 : this.BASE_SHIPPING);
        const discount = subtotal >= this.DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + shipping - discount;

        const submitBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        const originalText = submitBtn.innerHTML;
        
        // Disable dugme i vizuelna povratna informacija
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;

        // 🛑 VALIDACIJA ZALIHA 🛑
        const stockCheck = this.validateStock();

        if (stockCheck.length > 0) {
            console.error(`⚠️ Zalihe nisu dovoljne!`, stockCheck);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showToast("Greška: Nema dovoljno zaliha za neke proizvode. Molimo izmenite korpu.");
            this.goToStep(1); 
            return; 
        }
        
        document.getElementById('confirmationEmail').textContent = this.checkoutData.email;
        
        const formatTotal = (val) => val.toLocaleString('sr-RS') + ' RSD';

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
            medjuzbir: formatTotal(subtotal),
            postarina: formatTotal(shipping),
            popust: formatTotal(discount),
            ukupno: formatTotal(total),
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
            .then(() => {
                console.log('Slanje e-mailova uspešno završeno.');
                
                // Čišćenje stanja i UI
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                this.renderCart(); 
                
                this.goToStep(3);
                this.showToast("Porudžbina uspešno poslata! Proverite Vaš email.");
            })
            .catch((error) => {
                console.error('Greška pri slanju porudžbine:', error);
                
                // Vraćanje stanja dugmeta
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.showToast("Greška pri slanju porudžbine. Molimo kontaktirajte podršku.");
            
            });
    }
} 
// =========================================================
// === POKRETANJE NAKON UČITAVANJA DOM-a ===
// =========================================================
let shop;

document.addEventListener('DOMContentLoaded', () => {
    // Proverava da li je EmailJS dostupan, inače ispaljuje grešku u konstruktoru
    if (typeof emailjs === 'undefined') {
        console.error("KRITIČNA GREŠKA: EmailJS biblioteka nije učitana. Proverite HTML script tag.");
        return;
    }
    
    // Inicijalizacija klase
    shop = new AresNyXShop(); 
});




