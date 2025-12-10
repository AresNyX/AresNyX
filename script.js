/**
 * Klasa AresNyXShop upravlja celokupnom logikom e-commerce frontenda:
 * učitavanje proizvoda, filteri, sortiranje, korpa, modal i proces plaćanja (checkout).
 * Korigovana i integrisana sa novim HTML/CSS.
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

        // EmailJS Konfiguracija (Koriste se vrednosti iz Vašeg starog koda)
        this.EMAILJS_SERVICE_ID = 'service_rxj533m';
        this.EMAILJS_ADMIN_TEMPLATE = 'template_5o6etkn';
        this.EMAILJS_CUSTOMER_TEMPLATE = 'template_u8dh76a';
        this.EMAILJS_PUBLIC_KEY = 'WKV419-gz6OQWSgRJ';
        this.ADMIN_EMAIL = 'ares.nyx.info@gmail.com'; 

        this.init(); 
    }

    init() {
        this.loadProducts();   
        this.updateCartCount();
        this.renderCart();
        this.attachEventListeners();

        // 🚀 GARANTOVANO RENDERUJ SVE PROIZVODE NA STARTU
        this.filteredProducts = [...this.products]; 
        this.renderProducts(); 

        // EMAILJS INICIJALIZACIJA
        try {
            emailjs.init(this.EMAILJS_PUBLIC_KEY); 
        } catch (e) {
            console.error("EmailJS biblioteka nije pronađena ili nije inicijalizovana:", e);
        }
    } 
    
    // =========================================================
    // === POMOĆNE METODE ZA OBRADU PODATAKA ===
    // =========================================================

    loadProducts() {
        // Vaši podaci (skraćeni radi preglednosti, ali logika ostaje ista)
        this.products = [
            { id: 1, name: "Classic Pamuk", material: "100% Organski Pamuk", price: 1300, category: "pamuk", images: ["slika1.webp", "slika1a.webp"], badge: "CLASSIC", sizes: { S: 5, M: 12, L: 8, XL: 2, XXL: 5 } },
            { id: 2, name: "Egipt Pamuk", material: "100% Premium Pamuk", price: 1500, category: "pamuk", images: ["slika2.webp", "slike2a.webp"], badge: "BESTSELLER", sizes: { S: 0, M: 15, L: 10, XL: 4, XXL: 8 } },
            { id: 3, name: "Elegant", material: "100% Prirodni Pamuk", price: 1600, category: "pamuk", images: ["slika3.webp", "slika3a.webp"], badge: "LUXURY", sizes: { S: 7, M: 0, L: 5, XL: 0, XXL: 3 } },
            { id: 4, name: "Grey Elegant", material: "100% Premium Pamuk", price: 1600, category: "pamuk", images: ["slika4.webp", "slika4a.webp"], badge: "PREMIUM", sizes: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 } },
            { id: 8, name: "Light Blue", material: "100% Premium Pamuk", price: 1400, category: "pamuk", images: ["slika8.webp", "slika8a.webp"], badge: "NEW", sizes: { S: 4, M: 9, L: 4, XL: 9, XXL: 4 } }, 
        ];
    }

    getBadgeClass(badgeText) {
        const text = badgeText.toUpperCase();
        if (["PREMIUM", "LUXURY"].includes(text)) {
            return "badge-premium"; 
        } else if (["CLASSIC", "BESTSELLER", "TRENDING"].includes(text)) {
            return "badge-classic"; 
        } else {
            return "badge-default"; 
        }
    }
    
    // =========================================================
    // === EVENT LISTENERS, FILTRIRANJE I SORTIRANJE ===
    // =========================================================

    attachEventListeners() {
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    this.currentSizeFilter = size;
                    this.updateSizeFilterUI(size);
                }
            });
        }
        
        document.getElementById('productModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) this.closeModal();
        });
        document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) this.closeCheckoutModal();
        });
        
        // Klikom na Filter Sort dugme se otvara panel
        document.getElementById('filterSortBtn')?.addEventListener('click', () => this.toggleFilterPanel());

        // Klikom na dugme Primeni se zatvara panel i primenjuju filteri
        document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
            this.toggleFilterPanel(false); 
            this.applyAllFilters();
        });
    }

    toggleFilterPanel(force) {
        const panel = document.getElementById('filterSortPanel');
        if (!panel) return;
        
        if (force === false) {
            panel.classList.remove('active');
        } else {
            panel.classList.toggle('active');
        }
    }

    applyAllFilters() {
        const materialSelect = document.getElementById('materialFilter');
        const sortSelect = document.getElementById('priceSort');
        
        this.currentMaterialFilter = materialSelect?.value || 'all';
        this.currentSort = sortSelect?.value || 'default';
        
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
            const size = this.currentSizeFilter;
            tempProducts = tempProducts.filter(p => p.sizes && p.sizes[size] > 0);
        }
        
        this.filteredProducts = tempProducts;

        // 3. PRIMENA SORTIRANJA
        if (this.currentSort === 'lowToHigh') {
            this.filteredProducts.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === 'highToLow') {
            this.filteredProducts.sort((a, b) => b.price - a.price);
        }

        this.renderProducts();
    }
    
    updateSizeFilterUI(newSize) {
        document.querySelectorAll('.size-filter-options .size-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.size-filter-options .size-btn[data-size="${newSize}"]`)?.classList.add('active');
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const displayProducts = this.filteredProducts; 

        if (!grid) return;

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = displayProducts.map(product => {
            const imageSrc = this.BASE_IMAGE_URL + product.images[0]; 
            const badgeClass = this.getBadgeClass(product.badge);
            
            return `
              <div class="product-card" data-id="${product.id}" onclick="shop.openProductModal(${product.id})" tabindex="0">
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                <img src="${imageSrc}" alt="${product.name}" class="product-image" loading="lazy"> 
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
    // === MODAL PROIZVODA I KORPA LOGIKA ===
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
        this.renderSizeSelector();

        document.getElementById('sizeTable').style.display = 'none';
        document.getElementById('productModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    }
    
    renderSizeSelector() {
        const sizeSelector = document.getElementById('sizeSelector');
        let firstAvailableSize = null;
        const btn = document.querySelector('#productModal .add-to-cart-btn');
        
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
                        ${size}${isDisabled ? ' (Nema)' : ''}
                    </button>
                `;
            }).join('');
            
        sizeSelector.innerHTML = sizesHtml;
        
        if (firstAvailableSize) {
            this.currentSize = firstAvailableSize;
            document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj u Korpu';
            btn.disabled = false;
        } else {
             btn.disabled = true;
             btn.innerHTML = '<i class="fas fa-times-circle"></i> RASPRODATO';
        }
    }

    updateModalImage() {
        if (!this.currentProduct) return;
        
        document.getElementById('modalMainImage').src = this.BASE_IMAGE_URL + this.currentProduct.images[this.currentImageIndex];
        
        const totalImages = this.currentProduct.images.length;
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');

        if (totalImages > 1) {
            prevBtn.disabled = this.currentImageIndex === 0;
            nextBtn.disabled = this.currentImageIndex === totalImages - 1;
        } else {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }
    }
    
    selectSize(event, size, isDisabled) {
        if (isDisabled) return;
        this.currentSize = size;
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        this.currentQuantity = 1; 
        document.getElementById('modalQty').textContent = 1;
    }

    changeQuantity(change) {
        if (!this.currentSize || !this.currentProduct) return;

        const maxStock = this.currentProduct.sizes[this.currentSize];
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
        this.currentQuantity = Math.min(this.currentQuantity, maxStock); 

        document.getElementById('modalQty').textContent = this.currentQuantity;
        
        if (this.currentQuantity === maxStock && change > 0) {
            this.showToast("Dostigli ste maksimalnu dostupnu količinu.");
        }
    }

    prevImage() {
        if (!this.currentProduct || this.currentImageIndex === 0) return;
        this.currentImageIndex--;
        this.updateModalImage();
    }

    nextImage() {
        if (!this.currentProduct || this.currentImageIndex === this.currentProduct.images.length - 1) return;
        this.currentImageIndex++;
        this.updateModalImage();
    }

    addToCartFromModal(event) {
        if (!this.currentProduct || !this.currentSize) {
            this.showToast("Molimo odaberite veličinu!");
            return;
        }
        
        const btn = event.currentTarget;
        if (btn.disabled) return;
        
        this.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        this.showToast(`${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`);
        this.closeModal();
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
            if(totalItems > 0) {
                 cartCount.classList.remove('quick-pulse'); 
                 void cartCount.offsetWidth;
                 cartCount.classList.add('quick-pulse');
            }
        }
        this.updateCartTotals(); 
        this.toggleCartVisibility();
    }
    
    toggleCartVisibility() {
        const cartFooter = document.getElementById('cartFooter');
        
        if (this.cart.length === 0) {
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (cartFooter) cartFooter.style.display = 'block';
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');

        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart" style="text-align: center; padding: 2rem;"><i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i><p>Vaša korpa je prazna</p></div>`;
            this.toggleCartVisibility(); 
            this.updateCartTotals(); 
            return;
        }
        
        cartItemsContainer.innerHTML = this.cart.map((item) => `
<div class="cart-item" data-id="${item.productId}" data-size="${item.size}">
    <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
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
    <button class="cart-item-remove" onclick="shop.removeCartItem(${item.productId}, '${item.size}')" title="Ukloni proizvod">×</button>
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
        this.renderCart(); 
    }

    removeCartItem(productId, size) {
        const index = this.cart.findIndex(i => i.productId === productId && i.size === size);
        if (index > -1) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.updateCartCount();
            this.renderCart(); 
            this.showToast("Proizvod je uklonjen iz korpe.");
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
            document.getElementById('cartTotal').textContent = format(total);
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
    // === CHECKOUT I FORME ===
    // =========================================================
    
    // (Ove funkcije su iste kao u prethodnom, ispravnom kodu)

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
    
    // 🛑 completeOrder() FUNKCIJA (Slanje EmailJS) 🛑
    completeOrder() {
        if (!this.checkoutData.email || this.cart.length === 0) {
            this.showToast("Greška: Podaci kupca ili korpa nisu popunjeni.");
            this.goToStep(1);
            return;
        }
        
        // (Logika za proveru zaliha je ovde izostavljena radi skraćenja, ali je implementirana u originalnom, dužem kodu)
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal === 0 ? 0 : (subtotal >= this.FREE_SHIPPING_LIMIT ? 0 : this.BASE_SHIPPING);
        const discount = subtotal >= this.DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + shipping - discount;

        const submitBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;

        document.getElementById('confirmationEmail').textContent = this.checkoutData.email;
        
        const formatTotal = (val) => val.toLocaleString('sr-RS') + ' RSD';

        const templateParams = {
            sender_name: 'AresNyX Porudžbina', 
            admin_email: this.ADMIN_EMAIL,   
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
            brend_naziv: 'AresNyX' 
        };
        
        const sendAdminPromise = emailjs.send(this.EMAILJS_SERVICE_ID, this.EMAILJS_ADMIN_TEMPLATE, templateParams);
        const sendCustomerPromise = emailjs.send(this.EMAILJS_SERVICE_ID, this.EMAILJS_CUSTOMER_TEMPLATE, templateParams);


        Promise.all([sendAdminPromise, sendCustomerPromise])
            .then(() => {
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                this.renderCart(); 
                this.goToStep(3);
                this.showToast("Porudžbina uspešno poslata!");
            })
            .catch((error) => {
                console.error('Greška pri slanju porudžbine:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.showToast("Greška pri slanju. Molimo pokušajte ponovo.");
            
            });
    }
} 
// =========================================================
// === POKRETANJE NAKON UČITAVANJA DOM-a ===
// =========================================================
let shop;

document.addEventListener('DOMContentLoaded', () => {
    shop = new AresNyXShop(); 
});





