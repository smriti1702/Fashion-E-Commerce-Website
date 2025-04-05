document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
                loadCartItems();
                updateCartCount();
            }
        });
    }
    
    // Cart item quantity and removal event delegation
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            // Handle quantity buttons
            if (e.target.classList.contains('cart-quantity-btn')) {
                const row = e.target.closest('tr');
                const index = row.getAttribute('data-index');
                const quantityInput = row.querySelector('.cart-quantity input');
                const currentQuantity = parseInt(quantityInput.value);
                
                if (e.target.classList.contains('minus') && currentQuantity > 1) {
                    quantityInput.value = currentQuantity - 1;
                    updateCartItemQuantity(index, currentQuantity - 1);
                    loadCartItems();
                } else if (e.target.classList.contains('plus')) {
                    quantityInput.value = currentQuantity + 1;
                    updateCartItemQuantity(index, currentQuantity + 1);
                    loadCartItems();
                }
            }
            
            // Handle remove button
            if (e.target.classList.contains('cart-remove') || e.target.closest('.cart-remove')) {
                const row = e.target.closest('tr');
                const index = row.getAttribute('data-index');
                
                if (confirm('Are you sure you want to remove this item?')) {
                    removeFromCart(index);
                    loadCartItems();
                    updateCartCount();
                }
            }
        });
    }
});

function loadCartItems() {
    const cart = getCart();
    const emptyCartElement = document.getElementById('empty-cart');
    const cartContentElement = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    
    // Show/hide empty cart message
    if (emptyCartElement && cartContentElement) {
        if (cart.length === 0) {
            emptyCartElement.style.display = 'block';
            cartContentElement.style.display = 'none';
            return;
        } else {
            emptyCartElement.style.display = 'none';
            cartContentElement.style.display = 'block';
        }
    }
    
    // Populate cart items
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            
            cartItemsContainer.innerHTML += `
                <tr data-index="${index}">
                    <td>
                        <div class="cart-product">
                            <div class="cart-product-image">
                                <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}">
                            </div>
                            <div class="cart-product-info">
                                <h3>${item.name}</h3>
                                <div class="cart-product-meta">${item.size} / ${item.color}</div>
                            </div>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="cart-quantity">
                            <button class="cart-quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" readonly>
                            <button class="cart-quantity-btn plus">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="cart-remove">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }
    
    // Update cart summary
    updateCartSummary();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const totalElement = document.getElementById('cart-total');
    const shippingMessageElement = document.getElementById('shipping-message');
    
    if (subtotalElement && shippingElement && totalElement) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 10;
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        if (shippingMessageElement) {
            if (shipping === 0) {
                shippingMessageElement.textContent = 'Your order qualifies for free shipping!';
                shippingMessageElement.classList.add('free-shipping');
            } else {
                const amountForFreeShipping = 100 - subtotal;
                shippingMessageElement.textContent = `Add $${amountForFreeShipping.toFixed(2)} more to qualify for free shipping.`;
                shippingMessageElement.classList.remove('free-shipping');
            }
        }
    }
}

function getCart() {
    // Retrieve cart data from local storage or initialize an empty array
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

function clearCart() {
    // Clear the cart data from local storage
    localStorage.removeItem('cart');
}

function updateCartCount() {
    // Get the cart count from local storage and update the cart count element
    const cart = getCart();
    const cartCountElement = document.getElementById('cart-count');

    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function updateCartItemQuantity(index, quantity) {
    // Get the cart from local storage
    const cart = getCart();

    // Update the quantity of the item at the given index
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = quantity;
    }

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(index) {
    // Get the cart from local storage
    const cart = getCart();

    // Remove the item at the given index
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
    }

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}