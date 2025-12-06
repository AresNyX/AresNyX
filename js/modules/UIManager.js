// js/modules/UIManager.js

import { ProductData } from './ProductData.js';
import { CartLogic } from './CartLogic.js';

// Globalna inicijalizacija EmailJS (Preuzeto iz starog koda)
try {
    emailjs.init("WKV419-gz6OQWSgRJ"); // Vaš Public Key
} catch (e) {
    console.error("EmailJS biblioteka nije pronađena ili nije inicijalizovana.");
}

export const UIManager = {
    // === STANJE (SADA U UIMANAGERU) ===
    currentProduct: null,
    currentSize: null,
    currentQuantity: 1,
    currentImageIndex: 0,
    checkoutData: {},
    
    // === INICIJALIZACIJA ===
    init() {
        this.attachEventListeners();
    },

    // === TOAST PORUKE I MODAL KONTROLA ===
    showToast(message) { // PREUZETO
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 2000);
    },
    
    closeModal() { // PREUZETO
        document.getElementById('productModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
    },

    toggleCart() { // PREUZETO
         document.getElementById('cartSidebar').classList.toggle('active');
         document.body.classList.toggle('no-scroll');
    },

    toggleSizeTable() { // PREUZETO
        const table = document.getElementById('sizeTable');
        if (!table) return;
        table.style.display = table.style.display === 'none' ? 'block' : 'none';
    },

    // === RENDEROVANJE PROIZVODA I MODAL ===

    renderProducts() { // PREUZETO, sa pozivom ProductData.filteredProducts
        const grid = document.getElementById('productsGrid');
        const displayProducts = ProductData.filteredProducts; 
        const BASE_IMAGE_URL = "https://aresnyx.github.io/AresNyX/slike/"; 

        if (!grid) return;

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        grid.innerHTML = displayProducts.map(product => {
            const imageSrc = BASE_IMAGE_URL + product.images[0]; 
            // Koristi ProductData metodu!
            const badgeClass = ProductData.getBadgeClass(product.badge); 

            const srcset = product.images.map((imgName, index) => {
                const width = (index === 0) ? '800w' : '400w'; 
                return `${BASE_IMAGE_URL}${imgName} ${width}`;
            }).join(', ');
            
            // onclick MORA pozivati globalni objekat AresNyXShop!
            return `
              <div class="product-card" data-id="${product.id}" onclick="AresNyXShop.openProductModal(${product.id})">
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
    },
    
    openProductModal(productId) { // PREUZETO
        this.currentProduct = ProductData.getProductById(productId); // Koristi ProductData getter!
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
                
                // onclick MORA pozivati globalni objekat AresNyXShop!
                return `
                    <button 
                        class="size-option ${isDisabled ? 'disabled' : ''}"
                        data-size="${size}" 
                        onclick="AresNyXShop.selectSize(event, '${size}', ${isDisabled})" 
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
            document.querySelector(`.size-option[data-size="${firstAvailableSize}"]`)?.classList.add('selected');
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

        document.getElementById('sizeTable').style.display = 'none';
        document.getElementById('productModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    },
    
    updateModalImage() { // PREUZETO
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
    },
    
    selectSize(event, size, isDisabled) { // PREUZETO
        if (isDisabled) return;
        this.currentSize = size;
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    },

    changeQuantity(change) { // PREUZETO
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
        document.getElementById('modalQty').textContent = this.currentQuantity;
    },

    prevImage() { // PREUZETO
        if (!this.currentProduct) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProduct.images.length) % this.currentProduct.images.length;
        this.updateModalImage();
    },

    nextImage() { // PREUZETO
        if (!this.currentProduct) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProduct.images.length;
        this.updateModalImage();
    },

    addToCartFromModal(event) { // PREUZETO, sa pozivom CartLogic.addToCart
        if (!this.currentProduct || !this.currentSize) return;
        
        const btn = event.currentTarget;
        if (btn.disabled) return;
        btn.disabled = true;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.background = 'var(--success)';
        
        // POZIVAMO LOGIKU KORPE
        CartLogic.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        
        this.showToast(`${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`);
        
        setTimeout(() => {
            this.closeModal();
            btn.innerHTML = originalText;
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        }, 500); 
    },
    
    // === KONTROLA I RENDEROVANJE KORPE ===
    
    updateCartCount() { // PREUZETO, sada koristi CartLogic.cart
        const totalItems = CartLogic.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        
        cartCount.textContent = totalItems;
        
        cartCount.classList.remove('quick-pulse'); 
        void cartCount.offsetWidth;
        cartCount.classList.add('quick-pulse');
        
        this.updateCartTotals(); 
        this.toggleCartVisibility();
    },
    
    toggleCartVisibility() { // PREUZETO
        const cartFooter = document.getElementById('cartFooter');
        const emptyCart = document.getElementById('emptyCart');
        
        if (CartLogic.cart.length === 0) { // Koristi CartLogic.cart
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'block';
        }
    },

    renderCart() { // PREUZETO, sada koristi CartLogic.cart
        const cartItemsContainer = document.getElementById('cartItems');

        if (!cartItemsContainer) return;

        if (CartLogic.cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart" id="emptyCart" style="text-align: center; padding: 2rem;"><i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i><p>Vaša korpa je prazna</p></div>`;
            this.toggleCartVisibility(); 
            this.updateCartTotals(); 
            return;
        }
        
        cartItemsContainer.innerHTML = ''; 

        CartLogic.cart.forEach((item) => { // Koristi CartLogic.cart
            const itemHtml = `
<div class="cart-item" data-id="${item.productId}" data-size="${item.size}">
    <button class="cart-item-remove" onclick="AresNyXShop.removeCartItem(${item.productId}, '${item.size}')" title="Ukloni proizvod">×</button>
    <img src="${item.image}" alt="${item.name} veličine ${item.size}" class="cart-item-image" loading="lazy">
    <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-size">Veličina: ${item.size}</div>
        <div class="cart-item-controls">
            <div class="cart-item-qty-wrapper">
                <button class="cart-item-qty-btn" onclick="AresNyXShop.updateCartItem(${item.productId}, '${item.size}', -1)">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="cart-item-qty-btn" onclick="AresNyXShop.updateCartItem(${item.productId}, '${item.size}', 1)">+</button>
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
    },

    updateCartPromoMessage(subtotal) { // PREUZETO
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
    },

    updateCartTotals(preview = false) { // PREUZETO, sada koristi CartLogic.cart
        const subtotal = CartLogic.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
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
    },

    // === FILTERI I EVENT LISTENERS ===
    
    attachEventListeners() { // PREUZETO
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Poziva ProductData metodu da zapamti filter
                    ProductData.updateFilterState(size, 'size'); 
                }
            });
        }
    },

    toggleFilterPanel() { // PREUZETO
        const panel = document.getElementById('filterSortPanel');
        if (panel) panel.classList.toggle('active');
    },

    applyAllFilters() { // PREUZETO, poziva ProductData metodu
        this.toggleFilterPanel();

        const materialValue = document.getElementById('materialFilter')?.value || 'all';
        const sortValue = document.getElementById('priceSort')?.value || 'default';
        
        // Poziva ProductData metode da zapamte filtere
        ProductData.updateFilterState(materialValue, 'material');
        ProductData.updateSortState(sortValue);
        
        // Pokreće primenu filtera i renderovanje (u ProductData)
        ProductData.applyFiltersAndSort(); 
    },
    
    // === CHECKOUT I FORME ===
    
    getPaymentMethodText(method) { // PREUZETO
        switch (method) {
            case 'pouzecem': return 'Pouzećem (Plaćanje prilikom preuzimanja)';
            case 'racun': return 'Uplata na račun (E-banking)';
            case 'licno': return 'Lično preuzimanje (dogovor)';
            default: return 'Nepoznato';
        }
    },

    startCheckout() { // PREUZETO, sada koristi CartLogic.cart
        if (CartLogic.cart.length === 0) {
            this.showToast("Vaša korpa je prazna!");
            return;
        }
        this.toggleCart(); 
        this.goToStep(1);
        document.getElementById('checkoutModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    },

    closeCheckoutModal() { // PREUZETO
        document.getElementById('checkoutModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
        this.goToStep(1); 
    },

    goToStep(step) { // PREUZETO
        document.getElementById('checkoutStep1').style.display = step === 1 ? 'block' : 'none';
        document.getElementById('checkoutStep2').style.display = step === 2 ? 'block' : 'none';
        document.getElementById('checkoutStep3').style.display = step === 3 ? 'block' : 'none';
    },

    submitShippingForm(event) { // PREUZETO
        event.preventDefault();

        this.checkoutData = {
            ime: document.getElementById('ime')?.value,
            prezime: document.getElementById('prezime')?.value,
            email: document.getElementById('email')?.value,
            telefon: document.getElementById('telefon')?.value,
            ulica: document.getElementById('ulica')?.value,
            postanskiBroj: document.getElementById('postanskiBroj')?.value,
            grad: document.getElementById('grad')?.value,
            opstina: document.getElementById('opstina')?.value,
            placanje: document.getElementById('placanje')?.value,
            napomena: document.getElementById('napomena')?.value
        };
        
        // Ažuriranje pregleda
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
    },

    renderPreviewOrderItems() { // PREUZETO, koristi CartLogic.cart
        const container = document.getElementById('previewOrderItems');
        if (!container) return;
        container.innerHTML = CartLogic.cart.map(item => `
            <div class="preview-item">
                <span style="font-weight: 700;">${item.quantity}x ${item.name} (${item.size})</span>
                <span style="float: right;">${item.price * item.quantity} RSD</span>
            </div>
        `).join('');
    },

    formatOrderItemsForEmail() { // PREUZETO, koristi CartLogic.cart
        if (CartLogic.cart.length === 0) return '<p>Nema stavki u porudžbini.</p>';

        let html = '<div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; background: #f9f9f9;">';
        CartLogic.cart.forEach(item => {
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
    },
    
    completeOrder() { // PREUZETO, koristi CartLogic i ProductData
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
        
        const subtotal = CartLogic.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_LIMIT ? 0 : baseShipping);
        const discount = subtotal >= DISCOUNT_LIMIT ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal + shipping - discount;

        const submitBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;

        // 🛑 VALIDACIJA ZALIHA (Koristi ProductData i CartLogic) 🛑
        const stockCheck = ProductData.validateStock(CartLogic.cart);

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
            .then(() => {
                console.log('Slanje e-mailova uspešno završeno za Admina i Kupca.');
                
                // ČIŠĆENJE KORPE (Koristi CartLogic)
                CartLogic.cart = [];
                CartLogic.saveCart();
                this.updateCartCount(); // Ažurira prikaz brojača
                this.renderCart(); // Ažurira prikaz korpe
                
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
};
