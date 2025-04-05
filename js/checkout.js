document.addEventListener('DOMContentLoaded', function() {
    // Load cart items in checkout summary
    loadCheckoutItems();
    
    // Step navigation
    const informationForm = document.getElementById('information-form');
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const backToInformationBtn = document.getElementById('back-to-information');
    const backToShippingBtn = document.getElementById('back-to-shipping');
    
    // Information step to shipping step
    if (informationForm) {
        informationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (informationForm.checkValidity()) {
                // Save form data
                saveCheckoutData('information', getFormData(informationForm));
                
                // Go to shipping step
                goToStep('shipping');
            } else {
                // Show validation messages
                informationForm.reportValidity();
            }
        });
    }
    
    // Shipping step to payment step
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Save form data
            saveCheckoutData('shipping', getFormData(shippingForm));
            
            // Update shipping cost based on method
            const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked').value;
            updateShippingCost(shippingMethod === 'express' ? 15 : 10);
            
            // Go to payment step
            goToStep('payment');
        });
    }
    
    // Payment step to confirmation step
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (paymentForm.checkValidity()) {
                // Save form data
                saveCheckoutData('payment', getFormData(paymentForm));
                
                // Process order (in a real app, this would call a payment API)
                processOrder();
                
                // Go to confirmation step
                goToStep('confirmation');
                
                // Clear cart after successful checkout
                clearCart();
                updateCartCount();
            } else {
                // Show validation messages
                paymentForm.reportValidity();
            }
        });
    }
    
    // Back buttons
    if (backToInformationBtn) {
        backToInformationBtn.addEventListener('click', function() {
            goToStep('information');
        });
    }
    
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', function() {
            goToStep('shipping');
        });
    }
});

function loadCheckoutItems() {
    const cart = getCart();
    const checkoutItemsContainer = document.getElementById('checkout-items');
    
    // Redirect to cart if cart is empty
    if (cart.length === 0 && window.location.pathname.includes('checkout.html')) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Populate checkout items
    if (checkoutItemsContainer) {
        checkoutItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            checkoutItemsContainer.innerHTML += `
                <div class="summary-item">
                    <div class="summary-item-image">
                        <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}">
                    </div>
                    <div class="summary-item-info">
                        <h3>${item.name}</h3>
                        <div class="summary-item-meta">${item.size} / ${item.color} / Qty: ${item.quantity}</div>
                        <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
    }
    
    // Update checkout summary
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const cart = getCart();
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (subtotalElement && shippingElement && taxElement && totalElement) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 10;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function updateShippingCost(cost) {
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    
    if (shippingElement && totalElement) {
        const subtotal = parseFloat(document.getElementById('checkout-subtotal').textContent.replace('$', ''));
        const tax = parseFloat(document.getElementById('checkout-tax').textContent.replace('$', ''));
        const total = subtotal + cost + tax;
        
        shippingElement.textContent = `$${cost.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function saveCheckoutData(step, data) {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');
    checkoutData[step] = data;
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
}

function goToStep(step) {
    // Update active step in UI
    document.querySelectorAll('.checkout-step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update steps indicator
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    const stepIndex = ['information', 'shipping', 'payment', 'confirmation'].indexOf(step);
    
    for (let i = 0; i <= stepIndex; i++) {
        document.querySelectorAll('.step')[i].classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function processOrder() {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');
    const orderNumber = 'ORD-' + Math.floor(Math.random() * 10000);
    
    // Update confirmation page with order details
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-name').textContent = `${checkoutData.information.firstName} ${checkoutData.information.lastName}`;
    document.getElementById('order-email').textContent = checkoutData.information.email;
    document.getElementById('order-address').textContent = `${checkoutData.information.address}, ${checkoutData.information.city}, ${checkoutData.information.zipCode}`;
    document.getElementById('order-shipping').textContent = checkoutData.shipping.shippingMethod === 'express' 
        ? 'Express (1-2 business days)' 
        : 'Standard (3-5 business days)';
    
    // In a real app, you would send the order to your backend here
    console.log('Order processed:', {
        orderNumber,
        customer: {
            firstName: checkoutData.information.firstName,
            lastName: checkoutData.information.lastName,
            email: checkoutData.information.email,
            phone: checkoutData.information.phone,
            address: {
                street: checkoutData.information.address,
                apartment: checkoutData.information.apartment,
                city: checkoutData.information.city,
                country: checkoutData.information.country,
                zipCode: checkoutData.information.zipCode
            }
        },
        shipping: {
            method: checkoutData.shipping.shippingMethod
        },
        payment: {
            method: checkoutData.payment.paymentMethod,
            // Don't log sensitive card details in a real app
        },
        items: getCart(),
        totals: {
            subtotal: document.getElementById('checkout-subtotal').textContent,
            shipping: document.getElementById('checkout-shipping').textContent,
            tax: document.getElementById('checkout-tax').textContent,
            total: document.getElementById('checkout-total').textContent
        }
    });
}

// Mock functions for clearCart, updateCartCount, and getCart
// In a real application, these would be defined elsewhere and imported
function clearCart() {
    // Implement your clear cart logic here
    console.log('Cart cleared');
}

function updateCartCount() {
    // Implement your update cart count logic here
    console.log('Cart count updated');
}

function getCart() {
    // Implement your get cart logic here
    // This is a mock implementation that returns an empty array
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Error parsing cart from localStorage", e);
        return [];
    }
}