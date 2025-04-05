document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    function getProductById(id) {
        const products = [
            {
                id: '1',
                name: 'Awesome T-Shirt',
                price: 2500,
                description: 'This is an awesome t-shirt.',
                category: 'Shirts',
                colors: ['Red', 'Blue', 'Green'],
                sizes: ['S', 'M', 'L'],
                images: ['js/images/tshirt.webp', 'js/images/tshirt2.webp']
            },
            {
                id: '2',
                name: 'Cool Jeans',
                price: 500,
                description: 'These are cool jeans.',
                category: 'Pants',
                colors: ['Blue', 'Black'],
                sizes: ['30', '32', '34'],
                images: ['js/images/jeans4.webp', 'js/images/jeans2.webp']
            }
        ];
        return products.find(product => product.id === id);
    }

    function addToCart(item) {
        console.log('Adding to cart:', item);
    }

    function updateCartCount() {
        console.log('Updating cart count');
    }

    function getRecommendedProducts(productId) {
        return [
            {
                id: '3',
                name: 'Classic Boots',
                price: 3000,
                image: 'js/images/boot4.jpeg'
            }
        ];
    }

    function createProductCard(product) {
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h4>${product.name}</h4>
                <p>₹${product.price}</p>
            </div>
        `;
    }

    const product = getProductById(productId);

    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    document.title = `${product.name} - FASHION`;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `₹${product.price}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-sku').textContent = `TS-${product.id}`;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-tags').textContent = product.colors.join(', ');

    const mainProductImage = document.getElementById('main-product-image');
    mainProductImage.src = product.images[0] || 'js/images/placeholder.jpg';
    mainProductImage.alt = product.name;

    const thumbnailContainer = document.getElementById('thumbnail-images');
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="${product.name} - view ${index + 1}">`;

        thumbnail.addEventListener('click', function () {
            mainProductImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        });

        thumbnailContainer.appendChild(thumbnail);
    });

    const colorOptions = document.getElementById('color-options');
    const selectedColorText = document.querySelector('#selected-color span');

    product.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
        colorOption.style.backgroundColor = color.toLowerCase();
        colorOption.setAttribute('data-color', color);

        colorOption.addEventListener('click', function () {
            document.querySelectorAll('.color-option').forEach(option => option.classList.remove('active'));
            colorOption.classList.add('active');
            selectedColorText.textContent = color;
        });

        colorOptions.appendChild(colorOption);
    });

    selectedColorText.textContent = product.colors[0];

    const sizeOptions = document.getElementById('size-options');

    product.sizes.forEach((size, index) => {
        const sizeOption = document.createElement('div');
        sizeOption.className = `size-option ${index === 0 ? 'active' : ''}`;
        sizeOption.textContent = size;
        sizeOption.setAttribute('data-size', size);

        sizeOption.addEventListener('click', function () {
            document.querySelectorAll('.size-option').forEach(option => option.classList.remove('active'));
            sizeOption.classList.add('active');
        });

        sizeOptions.appendChild(sizeOption);
    });

    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', function () {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', function () {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    const addToCartBtn = document.getElementById('add-to-cart');

    addToCartBtn.addEventListener('click', function () {
        const selectedColor = document.querySelector('.color-option.active').getAttribute('data-color');
        const selectedSize = document.querySelector('.size-option.active').getAttribute('data-size');
        const quantity = parseInt(quantityInput.value);

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize,
            quantity: quantity
        });

        updateCartCount();
        alert(`${product.name} has been added to your cart!`);
    });

    const recommendedProductsContainer = document.getElementById('recommended-products');

    if (recommendedProductsContainer) {
        const recommendedProducts = getRecommendedProducts(productId);
        recommendedProducts.forEach(product => {
            recommendedProductsContainer.innerHTML += createProductCard(product);
        });
    }
});
