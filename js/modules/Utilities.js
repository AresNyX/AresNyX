// js/modules/Utilities.js

// Prebačena iz starog koda
export function showToast(message) {
    const toast = document.getElementById('toast'); 
    
    if (!toast) {
        console.warn("Element za Toast notifikaciju (ID='toast') nije pronađen.");
        return;
    }
    
    toast.textContent = message;
    toast.classList.remove('show');
    // Prinudno reflow-ovanje da bi se animacija ponovila
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Prebačena iz starog koda
export function getPaymentMethodText(method) {
    switch (method) {
        case 'pouzecem': return 'Pouzećem (Plaćanje prilikom preuzimanja)';
        case 'racun': return 'Uplata na račun (E-banking)';
        case 'licno': return 'Lično preuzimanje (dogovor)';
        default: return 'Nepoznato';
    }
}

// Funkcija za formatiranje cene
export function formatPrice(price) {
    // Važno: Koristi se svuda u renderovanju korpe/modala
    return `${price} RSD`; 
}

