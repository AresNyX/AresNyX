// js/modules/UIManager.js

// Uvoz modula za logiku i podatke
import { ProductData } from './ProductData.js';
import { CartLogic } from './CartLogic.js';
import { showToast, getPaymentMethodText } from './Utilities.js'; // Uvoz pojedinačnih funkcija

export const UIManager = {
    // Stanje (Preuzeto iz constructor() starog koda)
    currentProduct: null,
    currentSize: null,
    currentQuantity: 1,
    currentImageIndex: 0,
    checkoutData: {},
    
    // Sigurnosna putanja definisana unutar modula
    BASE_IMAGE_URL: "https://aresnyx.github.io/AresNyX/slike/",

    init() {
        this.attachEventListeners();
    },

    // =========================================================
    // === METODE ZA RENDER I PRIKAZ ===
    // =========================================================

    /**
     * Renderuje listu proizvoda na stranicu.
     */
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const displayProducts = ProductData.filteredProducts; 

        if (!grid) {
             console.error('HTML element #productsGrid nije pronađen!');
             return;
        }

        if (!displayProducts || displayProducts.length === 0) {
             grid.innerHTML = '<p style="text-align: center; margin-top: 3rem; font-size: 1.2rem; color: #666;">Nema dostupnih proizvoda prema izabranom filteru.</p>';
             return;
        }
        
        // Render logika preuzeta iz starog koda
        grid.innerHTML = displayProducts.map(product => {
            const imageSrc = this.BASE_IMAGE_URL + product.images[0]; 
            const badgeClass = ProductData.getBadgeClass(product.badge);

            const srcset = product.images.map((imgName, index) => {
                const width = (index === 0) ? '800w' : '400w'; 
                return `${this.BASE_IMAGE_URL}${imgName} ${width}`;
            }).join(', ');
            
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

    /**
     * Renderuje stavke unutar korpe sidebara.
     */
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartItems = CartLogic.cart; // Direktno uzima stanje iz CartLogic

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart" id="emptyCart" style="text-align: center; padding: 2rem;"><i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc;"></i><p>Vaša korpa je prazna</p></div>`;
            this.toggleCartVisibility(); 
            return;
        }
        
        cartItemsContainer.innerHTML = ''; 

        cartItems.forEach((item) => {
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
    },
    
    /**
     * Ažurira brojač u headeru i pokreće animaciju.
     */
    updateCartCount() {
        const totalItems = CartLogic.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        
        if (cartCount) {
             cartCount.textContent = totalItems;
        
             // Animacija pulsa
             cartCount.classList.remove('quick-pulse'); 
             void cartCount.offsetWidth;
             cartCount.classList.add('quick-pulse');
        }

        this.toggleCartVisibility();
    },

    /**
     * Ažurira prikaz ukupnih iznosa (poziva CartLogic).
     */
    renderTotals(subtotal, shipping, discount, total, preview = false) {
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
            if (totalElement) {
                 totalElement.textContent = total + ' RSD';

                 // Animacija pulsa na totalu
                 totalElement.classList.remove('quick-pulse'); 
                 void totalElement.offsetWidth; 
                 totalElement.classList.add('quick-pulse');
            }
        }
    },

    // =========================================================
    // === METODE ZA FILTRIRANJE I SLUŠAOCI ===
    // =========================================================
    
    /**
     * Postavlja sve event listenere koji nisu inline u HTML-u.
     */
    attachEventListeners() {
        const sizeFilterOptions = document.getElementById('sizeFilterOptions');
        const filterBtn = document.getElementById('applyFilterBtn');

        // Slušalac za filtere po veličini (na dugmetu)
        if (sizeFilterOptions) {
            sizeFilterOptions.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (btn) {
                    const size = btn.dataset.size;
                    
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    ProductData.updateFilterState(size, 'size'); // Ažurira stanje u ProductData
                    ProductData.applyFiltersAndSort(); // Pokreće filtriranje i render
                }
            });
        }
        
        // Slušalac za dugme "Primeni filtere" u sidebaru
        if (filterBtn) {
             filterBtn.addEventListener('click', () => {
                 this.applyAllFilters();
             });
        }
        
        // Slušalac za formu u checkoutu
        const shippingForm = document.getElementById('shippingForm');
        if (shippingForm) {
            shippingForm.addEventListener('submit', (e) => this.submitShippingForm(e));
        }

        // Slušalac za dugme "Potvrdi Porudžbinu"
        const confirmOrderBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener('click', () => this.completeOrder());
        }
    },
    
    /**
     * Pokreće kompletnu logiku filtera nakon klika na dugme "Primeni filtere".
     * Preuzeto iz stare metode applyAllFilters.
     */
    applyAllFilters() {
        this.toggleFilterPanel();

        const materialValue = document.getElementById('materialFilter').value;
        const sortValue = document.getElementById('priceSort').value;
        
        ProductData.updateFilterState(materialValue, 'material'); 
        ProductData.updateSortState(sortValue);
        
        ProductData.applyFiltersAndSort(); // Pokreće filtriranje
    },

    /**
     * Otvara/zatvara panel za filtere.
     */
    toggleFilterPanel() {
        const panel = document.getElementById('filterSortPanel');
        panel?.classList.toggle('active');
    },

    // =========================================================
    // === METODE ZA MODAL ===
    // =========================================================

    openProductModal(productId) {
        // Preuzimanje proizvoda iz ProductData
        this.currentProduct = ProductData.products.find(p => p.id === productId);
        if (!this.currentProduct) return;

        // Resetovanje stanja
        this.currentSize = null; 
        this.currentQuantity = 1;
        this.currentImageIndex = 0;

        // Popunjavanje DOM-a
        document.getElementById('modalTitle').textContent = this.currentProduct.name;
        document.getElementById('modalMaterial').textContent = this.currentProduct.material;
        document.getElementById('modalPrice').textContent = `${this.currentProduct.price} RSD`;
        document.getElementById('modalQty').textContent = '1';

        this.updateModalImage();

        // Renderovanje veličina (preuzeto iz starog koda)
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
    },
    
    selectSize(event, size, isDisabled) {
        if (isDisabled) return;
        this.currentSize = size;
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    },

    changeQuantity(change) {
        this.currentQuantity = Math.max(1, this.currentQuantity + change);
        document.getElementById('modalQty').textContent = this.currentQuantity;
    },

    prevImage() {
        if (!this.currentProduct) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProduct.images.length) % this.currentProduct.images.length;
        this.updateModalImage();
    },

    nextImage() {
        if (!this.currentProduct) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProduct.images.length;
        this.updateModalImage();
    },

    addToCartFromModal(event) {
        if (!this.currentProduct || !this.currentSize) return;
        
        const btn = event.currentTarget;
        if (btn.disabled) return;
        btn.disabled = true;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Dodato!';
        btn.style.background = 'var(--success)';
        
        // Poziva logiku iz CartLogic
        CartLogic.addToCart(this.currentProduct.id, this.currentSize, this.currentQuantity);
        
        // UIManager će se pobrinuti za vizuelni feedback
        showToast(`${this.currentProduct.name} (${this.currentSize}) je dodat u korpu!`);
        
        setTimeout(() => {
            this.closeModal();
            btn.innerHTML = originalText;
            btn.style.background = 'var(--primary-dark)';
            btn.disabled = false;
        }, 500); 
    },
    
    closeModal() {
        document.getElementById('productModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
    },

    toggleCart() {
         document.getElementById('cartSidebar').classList.toggle('active');
         document.body.classList.toggle('no-scroll');
    },
    
    toggleCartVisibility() {
        const cartFooter = document.getElementById('cartFooter');
        const emptyCart = document.getElementById('emptyCart');
        
        if (CartLogic.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'block';
        }
    },

    toggleSizeTable() { 
        const table = document.getElementById('sizeTable');
        table.style.display = table.style.display === 'none' ? 'block' : 'none';
    },

    // =========================================================
    // === METODE ZA CHECKOUT I FORME (PREUZETO IZ STAROG KODA) ===
    // =========================================================

    startCheckout() {
        if (CartLogic.cart.length === 0) {
            showToast("Vaša korpa je prazna!");
            return;
        }
        this.toggleCart(); 
        this.goToStep(1);
        document.getElementById('checkoutModal').style.display = 'block';
        document.body.classList.add('no-scroll');
    },

    closeCheckoutModal() {
        document.getElementById('checkoutModal').style.display = 'none';
        document.body.classList.remove('no-scroll');
        this.goToStep(1); 
    },

    goToStep(step) {
        document.getElementById('checkoutStep1').style.display = step === 1 ? 'block' : 'none';
        document.getElementById('checkoutStep2').style.display = step === 2 ? 'block' : 'none';
        document.getElementById('checkoutStep3').style.display = step === 3 ? 'block' : 'none';
    },

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

        // Popunjavanje preview podataka (DOM manipulacija)
        document.getElementById('previewIme').innerHTML = `<strong>Ime i Prezime:</strong> ${this.checkoutData.ime} ${this.checkoutData.prezime}`;
        document.getElementById('previewEmail').innerHTML = `<strong>Email:</strong> ${this.checkoutData.email}`;
        document.getElementById('previewTelefon').innerHTML = `<strong>Telefon:</strong> ${this.checkoutData.telefon}`;
        document.getElementById('previewAdresa').innerHTML = `<strong>Adresa:</strong> ${this.checkoutData.ulica}`;
        document.getElementById('previewPostaGrad').innerHTML = `<strong>Mesto:</strong> ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`;
        document.getElementById('previewPlacanje').innerHTML = `<strong>Plaćanje:</strong> ${getPaymentMethodText(this.checkoutData.placanje)}`;
        document.getElementById('previewNapomena').innerHTML = `<strong>Napomena:</strong> ${this.checkoutData.napomena || 'Nema napomene.'}`;

        this.renderPreviewOrderItems();
        CartLogic.updateCartTotals(true); // Pozivanje CartLogic za proračun totala

        this.goToStep(2); 
    },

    renderPreviewOrderItems() {
        const container = document.getElementById('previewOrderItems');
        container.innerHTML = CartLogic.cart.map(item => `
            <div class="preview-item">
                <span style="font-weight: 700;">${item.quantity}x ${item.name} (${item.size})</span>
                <span style="float: right;">${item.price * item.quantity} RSD</span>
            </div>
        `).join('');
    },

    formatOrderItemsForEmail() {
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
    
    // =========================================================
    // === completeOrder() FUNKCIJA (FINALNA) ===
    // =========================================================
    completeOrder() {
        if (!this.checkoutData.email) {
            showToast("Greška: Podaci kupca nisu popunjeni.");
            return;
        }
        
        const ADMIN_MAIL = 'ares.nyx.info@gmail.com'; 
        const SENDER_NAME = 'AresNyX Porudžbina';
        const BRAND_NAME = 'AresNyX'; 
        
        document.getElementById('confirmationEmail').textContent = this.checkoutData.email;
        
        // 1. Dobićemo totalne iznose iz CartLogic
        const { subtotal, shipping, discount, total } = CartLogic.updateCartTotals(false); 
        
        const submitBtn = document.querySelector('#checkoutStep2 .submit-order-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
        submitBtn.disabled = true;

        // 2. 🛑 VALIDACIJA ZALIHA (Korišćenje ProductData) 🛑
        const stockCheck = ProductData.validateStock(CartLogic.cart);

        if (stockCheck.length > 0) {
            const errorDetails = stockCheck.map(item => 
                `(${item.size}) ${item.name} - ${item.reason}`
            ).join('\n');
            
            console.error(`⚠️ Zalihe nisu dovoljne! \n\n${errorDetails}`);
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            showToast("Greška: Nema dovoljno zaliha. Molimo izmenite korpu.");
            
            this.goToStep(1); 
            
            return; 
        }
        
        // 3. Priprema parametara za EmailJS
        const templateParams = {
            sender_name: SENDER_NAME, 
            admin_email: ADMIN_MAIL,   
            
            ime_kupca: this.checkoutData.ime,
            prezime_kupca: this.checkoutData.prezime,
            email_kupca: this.checkoutData.email,
            telefon_kupca: this.checkoutData.telefon,
            
            adresa_dostave: `${this.checkoutData.ulica}, ${this.checkoutData.postanskiBroj} ${this.checkoutData.grad}${this.checkoutData.opstina ? ` (${this.checkoutData.opstina})` : ''}`,
            
            broj_porudzbine: 'ARX-' + Date.now(), 
            nacin_placanja: getPaymentMethodText(this.checkoutData.placanje),
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

        // 4. Slanje EmailJS
        const sendAdminPromise = emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams);
        const sendCustomerPromise = emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, templateParams);


        Promise.all([sendAdminPromise, sendCustomerPromise])
            .then(() => {
                console.log('Slanje e-mailova uspešno završeno za Admina i Kupca.');
                
                CartLogic.cart = []; // Brisanje korpe nakon uspešne porudžbine
                CartLogic.saveCart();
                CartLogic.updateCartState(); // Ažuriranje prikaza
                
                this.goToStep(3);
                
                showToast("Porudžbina uspešno poslata! Proverite Vaš email.");
            })
            .catch((error) => {
                console.error('Greška pri slanju jedne ili obe porudžbine:', error);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showToast("Greška pri slanju porudžbine. Molimo kontaktirajte podršku.");
            
            });
    }
};

