document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && closeMenu && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Hero slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        // Event listeners for slider controls
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, 5000);
            });
            
            nextBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                clearInterval(slideInterval);
                goToSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');
    
    if (newsletterForm && newsletterSuccess) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            newsletterForm.style.display = 'none';
            newsletterSuccess.style.display = 'block';
        });
    }
    
    // Filter toggles on product page
    const filterTitles = document.querySelectorAll('.filter-title');
    
    filterTitles.forEach(title => {
        title.addEventListener('click', function() {
            const filterOptions = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (filterOptions.style.display === 'none') {
                filterOptions.style.display = 'grid';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                filterOptions.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Update cart count
    updateCartCount();
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = button.getAttribute('data-product-id');
            
            if (productId) {
                // Assuming getProductById, getNewArrivals, and createProductCard are defined elsewhere (e.g., in a separate data.js file)
                // For demonstration purposes, let's define them here with dummy data.
                const product = getProductById(productId);
                
                if (product) {
                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        color: product.colors[0],
                        size: product.sizes[0],
                        quantity: 1
                    });
                    
                    updateCartCount();
                    
                    // Show confirmation message
                    alert(`${product.name} has been added to your cart!`);
                }
            }
        }
    });
    
    // Featured products on homepage
    const featuredProductsGrid = document.querySelector('.featured-products .products-grid');
    
    if (featuredProductsGrid) {
        const newArrivals = getNewArrivals();
        
        newArrivals.slice(0, 4).forEach(product => {
            featuredProductsGrid.innerHTML += createProductCard(product);
        });
    }
});

// Cart functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
    const cart = getCart();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.color === item.color && 
        cartItem.size === item.size
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity of existing item
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartItemQuantity(index, quantity) {
    const cart = getCart();
    cart[index].quantity = quantity;
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem('cart');
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Dummy data and functions for demonstration purposes
function getProductById(id) {
    // Replace with actual data fetching logic
    return { id: id, name: `Product ${id}`, price: '₹25.00', images: ['js/images/coat4.avif'], colors: ['red'], sizes: ['M'] };
}

function getNewArrivals() {
    // Replace with actual data fetching logic
    return [
        { id: 1, name: 'Bag Denim', price: '₹2000', images: ['js/images/bags.jpeg'], colors: ['blue'], sizes: ['S', 'M'] },
        { id: 2, name: 'Sweater', price: '₹300', images: ['js/images/sweater3.jpg'], colors: ['green'], sizes: ['M', 'L'] },
        { id: 3, name: 'Jeans', price: '₹4000', images: ['js/images/sweater2.jpg'], colors: ['red'], sizes: ['S', 'L'] },
        { id: 4, name: 'T-Shirt', price: '₹500', images: ['js/images/tshirt5.jpeg'], colors: ['black'], sizes: ['M', 'XL'] }
    ];
}

function createProductCard(product) {
    // Replace with actual product card creation logic
    return `<div class="product-card"><h3>${product.name}</h3><p>${product.price}</p><img src="${product.images[0]}" alt="${product.name}"></div>`;
}
