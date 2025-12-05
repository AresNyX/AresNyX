// --- SCRIPT.JS ZA E-COMMERCE LOGIKU ---

// 1. Definicija proizvoda
const products = [
    { id: 1, name: "Premium Boxer Shorts | Black", material: "Pamuk", sizeOptions: { S: 5, M: 12, L: 0, XL: 8 }, price: 1999, image: 'slike/proizvod1.webp', badge: 'Novo' },
    { id: 2, name: "Luxury Lounge Shorts | Gray Melange", material: "Bambus", sizeOptions: { S: 10, M: 20, L: 15, XL: 5 }, price: 2999, image: 'slike/proizvod2.webp', badge: 'Akcija' },
    { id: 3, name: "Active Performance Boxer | Blue", material: "Lan", sizeOptions: { S: 8, M: 18, L: 10, XL: 3 }, price: 2499, image: 'slike/proizvod3.webp', badge: null },
    { id: 4, name: "Cotton Classic Briefs | White", material: "Pamuk", sizeOptions: { S: 15, M: 25, L: 20, XL: 10 }, price: 1799, image: 'slike/proizvod4.webp', badge: null },
    { id: 5, name: "Thermal Boxer Shorts | Charcoal", material: "Lan", sizeOptions: { S: 5, M: 12, L: 0, XL: 8 }, price: 3199, image: 'slike/proizvod5.webp', badge: 'Limitirano' },
    { id: 6, name: "Silk Blend Boxer | Gold Edition", material: "Bambus", sizeOptions: { S: 10, M: 20, L: 15, XL: 5 }, price: 4999, image: 'slike/proizvod6.webp', badge: null },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProducts = [...products]; // Za filtriranje i sortiranje
let selectedProduct = null; // Proizvod trenutno prikazan u Modalu

// Elementi DOM-a
const productsGrid = document.getElementById('productsGrid');
const cartCountEl = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const modalOverlay = document.getElementById('modalOverlay');
const filterSortPanel = document.getElementById('filterSortPanel');
const checkoutModal = document.getElementById('checkoutModal');

// --- 2. OSNOVNE FUNKCIJE ---

// Prikaz proizvoda na stranici
function renderProducts(productArray) {
    productsGrid.innerHTML = productArray.map(p => `
        <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            <img src="${p.image}" alt="${p.name}" class="product-image">
            <div class="product-info">
                <div class="product-text">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${p.price.toLocaleString('sr-RS')} RSD</div>
                </div>
            </div>
        </div>
    `).join('');
    // Ako nema proizvoda
    if (productArray.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; font-size: 1.2rem;">Nema proizvoda koji odgovaraju Vašim kriterijumima.</p>';
    }
}

// Ažuriranje broja proizvoda u korpi
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'block' : 'none';
}

// Čuvanje korpe u Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Otvaranje/zatvaranje Modala i Sidebar-a
function toggleElement(element, show) {
    if (show) {
        element.classList.add('active');
        document.body.classList.add('no-scroll');
    } else {
        element.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// --- 3. LOGIKA KORPE ---

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');
    const shippingEl = document.getElementById('shippingCost');
    const promoMessageEl = document.getElementById('cartPromoMessage');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Vaša korpa je prazna.</p>';
        cartSubtotalEl.textContent = '0 RSD';
        shippingEl.textContent = '0 RSD';
        cartTotalEl.textContent = '0 RSD';
        
        promoMessageEl.classList.remove('success');
        promoMessageEl.innerHTML = 'Dodajte proizvode za **besplatnu dostavu** iznad 5000 RSD.';
        document.getElementById('cartFooterActions').style.display = 'none';

        return;
    }

    let subtotal = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemPrice = product.price * item.quantity;
        subtotal += itemPrice;

        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${product.name}</div>
                    <div class="cart-item-size">Veličina: ${item.size}</div>
                    <div class="cart-item-controls">
                        <div class="cart-item-qty-wrapper">
                            <button class="cart-item-qty-btn" onclick="updateCartItemQty(${item.id}, -1)">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <button class="cart-item-qty-btn" onclick="updateCartItemQty(${item.id}, 1)">+</button>
                        </div>
                        <div class="cart-item-price">${itemPrice.toLocaleString('sr-RS')} RSD</div>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${item.id})">x</button>
            </div>
        `;
    }).join('');

    // Kalkulacija dostave
    const freeShippingThreshold = 5000;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 390;
    const total = subtotal + shippingCost;

    // Ažuriranje prikaza
    cartSubtotalEl.textContent = subtotal.toLocaleString('sr-RS') + ' RSD';
    shippingEl.textContent = shippingCost === 0 ? 'BESPLATNO' : shippingCost.toLocaleString('sr-RS') + ' RSD';
    cartTotalEl.textContent = total.toLocaleString('sr-RS') + ' RSD';

    // Ažuriranje promo poruke
    document.getElementById('cartFooterActions').style.display = 'block';

    if (shippingCost === 0) {
        promoMessageEl.classList.add('success');
        promoMessageEl.innerHTML = '🎉 Čestitamo! Imate **BESPLATNU DOSTAVU**!';
    } else {
        const needed = freeShippingThreshold - subtotal;
        promoMessageEl.classList.remove('success');
        promoMessageEl.innerHTML = `Dodajte još **${needed.toLocaleString('sr-RS')} RSD** za besplatnu dostavu.`;
    }
}

// Dodavanje, Ažuriranje i Brisanje stavki
function addToCart(productId, size, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Generiše jedinstveni ID za stavku u korpi (ako imate M u ID 1 i L u ID 1, to su različite stavke)
    const itemId = `${productId}-${size}`; 

    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: itemId, productId, size, quantity });
    }
    
    // Sortiranje korpe (opciono)
    cart.sort((a, b) => a.productId - b.productId);

    saveCart();
    showToast(`${product.name} (veličina ${size}) je dodato u korpu.`);
    toggleElement(cartSidebar, true);
    toggleElement(modalOverlay, false); // Zatvara modal ako je otvoreno
}

function updateCartItemQty(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeCartItem(itemId);
        } else {
            saveCart();
        }
    }
}

function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    if (cart.length === 0) {
        // Ako je korpa prazna, zatvori sidebar
        toggleElement(cartSidebar, false);
    }
}

function clearCart() {
    if (confirm('Da li ste sigurni da želite da ispraznite korpu?')) {
        cart = [];
        saveCart();
        toggleElement(cartSidebar, false);
        showToast('Korpa je ispražnjena.');
    }
}

// --- 4. LOGIKA MODALA (BRZI PREGLED PROIZVODA) ---

function openModal(id) {
    selectedProduct = products.find(p => p.id === id);
    if (!selectedProduct) return;

    // Postavite osnovne detalje
    document.getElementById('modalTitle').textContent = selectedProduct.name;
    document.getElementById('modalDescription').textContent = "Ovo je kratak opis proizvoda. Izuzetno udoban materijal, idealan za svakodnevno nošenje. (Opis se obično vuče iz baze podataka)";
    document.getElementById('modalPrice').textContent = selectedProduct.price.toLocaleString('sr-RS') + ' RSD';
    
    // Postavite glavnu sliku (pretpostavljamo da je samo jedna slika)
    document.getElementById('modalMainImage').src = selectedProduct.image;
    
    // Generisanje opcija za veličinu
    const sizeOptionsContainer = document.getElementById('sizeOptionsContainer');
    sizeOptionsContainer.innerHTML = Object.keys(selectedProduct.sizeOptions).map(size => {
        const stock = selectedProduct.sizeOptions[size];
        const isDisabled = stock === 0 ? 'disabled' : '';
        return `<span class="size-option ${isDisabled}" data-size="${size}">${size}</span>`;
    }).join('');

    // Resetovanje količine
    document.getElementById('modalQuantityDisplay').textContent = 1;
    document.getElementById('modalQuantityDisplay').dataset.qty = 1;

    // Event listeneri za odabir veličine (delegacija)
    sizeOptionsContainer.querySelectorAll('.size-option').forEach(el => {
        el.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            // Ukloni selected klasu sa svih
            sizeOptionsContainer.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            // Dodaj selected klasu na kliknuti element
            this.classList.add('selected');
        });
    });

    // Prikaz Modala
    toggleElement(modalOverlay, true);
}

// Kontrola količine u Modalu
function updateModalQty(change) {
    const display = document.getElementById('modalQuantityDisplay');
    let currentQty = parseInt(display.dataset.qty);
    currentQty += change;
    
    if (currentQty < 1) currentQty = 1;
    
    display.dataset.qty = currentQty;
    display.textContent = currentQty;
}

// Dodavanje iz Modala
function handleModalAddToCart() {
    const selectedSizeEl = document.querySelector('#sizeOptionsContainer .size-option.selected');
    
    if (!selectedSizeEl) {
        showToast('Molimo Vas, odaberite veličinu.');
        return;
    }
    
    const size = selectedSizeEl.dataset.size;
    const quantity = parseInt(document.getElementById('modalQuantityDisplay').dataset.qty);
    
    // Provera zaliha (za svaki slučaj)
    const stock = selectedProduct.sizeOptions[size];
    if (quantity > stock) {
        showToast(`Nažalost, imamo samo ${stock} komada veličine ${size} na stanju.`);
        return;
    }

    addToCart(selectedProduct.id, size, quantity);
}

// --- 5. LOGIKA FILTERA I SORTIRANJA ---

function toggleFilterPanel() {
    filterSortPanel.classList.toggle('active');
}

function applyFiltersAndSort() {
    // 1. Filtriranje
    let filtered = [...products];
    const selectedSizes = Array.from(document.querySelectorAll('.size-btn.active')).map(el => el.dataset.size);
    const selectedMaterial = document.getElementById('materialFilter').value;
    
    if (selectedMaterial !== 'all') {
        filtered = filtered.filter(p => p.material === selectedMaterial);
    }
    
    if (selectedSizes.length > 0) {
        // Filtrira proizvode gde postoji makar jedna odabrana veličina u zalihama > 0
        filtered = filtered.filter(p => 
            selectedSizes.some(size => 
                p.sizeOptions[size] > 0
            )
        );
    }

    // 2. Sortiranje
    const sortBy = document.getElementById('sortOptions').value;
    
    if (sortBy === 'priceAsc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'nameAsc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    currentProducts = filtered;
    renderProducts(currentProducts);
    toggleFilterPanel();
    showToast(`Prikazano ${currentProducts.length} proizvoda.`);
}

// Selektovanje veličina u panelu
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.size-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});

// Resetovanje filtera
function resetFilters() {
    document.querySelectorAll('.size-btn.active').forEach(el => el.classList.remove('active'));
    document.getElementById('materialFilter').value = 'all';
    document.getElementById('sortOptions').value = 'default';
    currentProducts = [...products];
    renderProducts(currentProducts);
    toggleFilterPanel();
    showToast('Filteri su resetovani.');
}


// --- 6. CHECKOUT LOGIKA (Simulacija koraka) ---

let checkoutStep = 1;

function openCheckoutModal() {
    if (cart.length === 0) {
        showToast('Korpa je prazna. Dodajte proizvode pre naplate.');
        return;
    }
    checkoutStep = 1;
    renderCheckoutStep();
    toggleElement(checkoutModal, true);
    toggleElement(cartSidebar, false); // Zatvori korpu
}

function nextCheckoutStep() {
    if (checkoutStep === 1) {
        // Validiraj formu i pripremi podatke
        const form = document.getElementById('shippingForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Sačuvaj podatke (simulacija)
        const shippingData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zip: document.getElementById('zip').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            payment: document.getElementById('paymentMethod').value
        };
        localStorage.setItem('shippingData', JSON.stringify(shippingData));

        checkoutStep = 2; // Prelazak na pregled
        renderCheckoutStep();
    } else if (checkoutStep === 2) {
        // Simuliacija slanja porudžbine
        showToast('✅ Porudžbina je uspešno primljena! Hvala Vam na kupovini.');
        clearCart(); // Isprazni korpu nakon uspešne narudžbine
        toggleElement(checkoutModal, false);
        checkoutStep = 1; // Resetuj korak
    }
}

function renderCheckoutStep() {
    const step1 = document.getElementById('checkoutStep1');
    const step2 = document.getElementById('checkoutStep2');
    const modalTitle = document.querySelector('#checkoutModal h2');

    step1.style.display = 'none';
    step2.style.display = 'none';

    if (checkoutStep === 1) {
        step1.style.display = 'block';
        modalTitle.textContent = '1. Detalji Isporuke';
    } else if (checkoutStep === 2) {
        step2.style.display = 'block';
        modalTitle.textContent = '2. Pregled i Potvrda Porudžbine';
        fillOrderPreview();
    }
}

function fillOrderPreview() {
    const shippingData = JSON.parse(localStorage.getItem('shippingData'));
    if (!shippingData) {
        // Ako nema podataka, vratite se na korak 1
        checkoutStep = 1;
        renderCheckoutStep();
        return;
    }

    const cartSubtotalEl = document.getElementById('cartSubtotal').textContent;
    const shippingCostEl = document.getElementById('shippingCost').textContent;
    const cartTotalEl = document.getElementById('cartTotal').textContent;

    // Popunjavanje podataka o isporuci
    document.getElementById('previewName').textContent = shippingData.name;
    document.getElementById('previewAddress').textContent = `${shippingData.address}, ${shippingData.zip} ${shippingData.city}`;
    document.getElementById('previewEmail').textContent = shippingData.email;
    document.getElementById('previewPhone').textContent = shippingData.phone;
    document.getElementById('previewPayment').textContent = shippingData.payment === 'cod' ? 'Plaćanje po isporuci (Pouzećem)' : 'Online Plaćanje (Visa/Master)';


    // Popunjavanje detalja porudžbine
    const previewItemsContainer = document.getElementById('previewOrderItems');
    previewItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `<div class="preview-item">${product.name} (Veličina: ${item.size}) - ${item.quantity} x ${product.price.toLocaleString('sr-RS')} RSD</div>`;
    }).join('');

    document.getElementById('previewSubtotal').textContent = cartSubtotalEl;
    document.getElementById('previewShipping').textContent = shippingCostEl;
    document.getElementById('previewTotal').textContent = cartTotalEl;
}

// --- 7. TOAST NOTIFIKACIJA ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 2000);
}

// --- 8. INICIJALIZACIJA ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicijalni prikaz proizvoda
    renderProducts(products); 
    // Inicijalni prikaz korpe iz Local Storage-a
    renderCart(); 
    // Ažuriranje brojača korpe
    updateCartCount(); 
    
    // Dodavanje event listenera za dugmad
    document.getElementById('openCartBtn').addEventListener('click', () => toggleElement(cartSidebar, true));
    document.getElementById('closeCartBtn').addEventListener('click', () => toggleElement(cartSidebar, false));
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('openCheckoutBtn').addEventListener('click', openCheckoutModal);
    
    document.getElementById('modalCloseBtn').addEventListener('click', () => toggleElement(modalOverlay, false));
    document.getElementById('modalQtyIncrease').addEventListener('click', () => updateModalQty(1));
    document.getElementById('modalQtyDecrease').addEventListener('click', () => updateModalQty(-1));
    document.getElementById('modalAddToCartBtn').addEventListener('click', handleModalAddToCart);
    document.getElementById('modalContinueShoppingBtn').addEventListener('click', () => toggleElement(modalOverlay, false));

    // Filteri
    document.getElementById('filterSortBtn').addEventListener('click', toggleFilterPanel);
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFiltersAndSort);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

    // Checkout
    document.getElementById('nextStepBtn').addEventListener('click', nextCheckoutStep);
    document.getElementById('submitOrderBtn').addEventListener('click', nextCheckoutStep); // Korak 2 poziva istu funkciju
    document.getElementById('editDataBtn').addEventListener('click', () => { checkoutStep = 1; renderCheckoutStep(); });
    document.getElementById('checkoutCloseBtn').addEventListener('click', () => toggleElement(checkoutModal, false));
});
