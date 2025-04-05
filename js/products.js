// Product data
const products = [
    {
        id: '1',
        name: 'Oversized Cotton T-shirt',
        price: 2999,
        images: [
            'tshirt.webp',
            'tshirt2.webp',
            'tshirt3.jpg',
            'tshirt4.jpg'
        ],
        category: 'T-shirts',
        isNew: true,
        colors: ['White', 'Black', 'Gray'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'A comfortable oversized t-shirt made from 100% organic cotton. Perfect for casual everyday wear.'
    },
    {
        id: '2',
        name: 'Slim Fit Jeans',
        price: 5999,
        images: [
            'images/products/jeans-1.jpg',
            'images/products/jeans-2.jpg',
            'images/products/jeans-3.jpg',
            'images/products/jeans-4.jpg'
        ],
        category: 'Jeans',
        isNew: true,
        colors: ['Blue', 'Black'],
        sizes: ['28', '30', '32', '34', '36'],
        description: 'Classic slim fit jeans with a modern touch. Made from high-quality denim for durability and comfort.'
    },
    {
        id: '3',
        name: 'Leather Crossbody Bag',
        price: 999,
        images: [
            'images/products/bag-1.jpg',
            'images/products/bag-2.jpg',
            'images/products/bag-3.jpg',
            'images/products/bag-4.jpg'
        ],
        category: 'Accessories',
        isNew: false,
        colors: ['Brown', 'Black'],
        sizes: ['One Size'],
        description: 'Elegant leather crossbody bag with adjustable strap. Features multiple compartments for organization.'
    },
    {
        id: '4',
        name: 'Knit Sweater',
        price: 499,
        images: [
            'images/products/sweater-1.jpg',
            'images/products/sweater-2.jpg',
            'images/products/sweater-3.jpg',
            'images/products/sweater-4.jpg'
        ],
        category: 'Sweaters',
        isNew: true,
        colors: ['Cream', 'Navy', 'Burgundy'],
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Cozy knit sweater perfect for layering. Made from a soft wool blend for warmth and comfort.'
    },
    {
        id: '5',
        name: 'Pleated Midi Skirt',
        price: 459,
        images: [
            'images/products/skirt-1.jpg',
            'images/products/skirt-2.jpg',
            'images/products/skirt-3.jpg',
            'images/products/skirt-4.jpg'
        ],
        category: 'Skirts',
        isNew: false,
        colors: ['Black', 'Beige', 'Navy'],
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Elegant pleated midi skirt with elastic waistband. Versatile piece that can be dressed up or down.'
    },
    {
        id: '6',
        name: 'Leather Ankle Boots',
        price: 1299,
        images: [
            'images/products/boots-1.jpg',
            'images/products/boots-2.jpg',
            'images/products/boots-3.jpg',
            'images/products/boots-4.jpg'
        ],
        category: 'Shoes',
        isNew: false,
        colors: ['Black', 'Brown'],
        sizes: ['36', '37', '38', '39', '40', '41'],
        description: 'Classic leather ankle boots with side zipper. Features a comfortable block heel and durable sole.'
    },
    {
        id: '7',
        name: 'Wool Blend Coat',
        price: 2899,
        images: [
            'images/products/coat-1.jpg',
            'images/products/coat-2.jpg',
            'images/products/coat-3.jpg',
            'images/products/coat-4.jpg'
        ],
        category: 'Outerwear',
        isNew: true,
        colors: ['Camel', 'Black', 'Gray'],
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Elegant wool blend coat with notched lapels. Perfect for keeping warm during colder months.'
    },
    {
        id: '8',
        name: 'Silk Blouse',
        price: 799,
        images: [
            'images/products/blouse-1.jpg',
            'images/products/blouse-2.jpg',
            'images/products/blouse-3.jpg',
            'images/products/blouse-4.jpg'
        ],
        category: 'Tops',
        isNew: false,
        colors: ['White', 'Black', 'Navy'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Luxurious silk blouse with a relaxed fit. Versatile piece that can be styled for both casual and formal occasions.'
    },
    {
        id: '9',
        name: 'Straight Leg Trousers',
        price: 699,
        images: [
            'trouser.webp',
            'trouser2.jpeg',
            'trouser3.jpg',
            'trouser4.jpg'
        ],
        category: 'Pants',
        isNew: false,
        colors: ['Black', 'Navy', 'Beige'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Classic straight leg trousers with a high waist. Made from a comfortable stretch fabric for all-day wear.'
    }
];

// Function to get a product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Function to get products by category
function getProductsByCategory(category) {
    if (!category) return products;
    return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

// Function to get new arrivals
function getNewArrivals() {
    return products.filter(product => product.isNew);
}

// Function to get recommended products (excluding the current product)
function getRecommendedProducts(currentProductId) {
    return products
        .filter(product => product.id !== currentProductId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
}

// Function to create a product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0] || 'images/placeholder.jpg'}" alt="${product.name}">
                ${product.isNew ? '<div class="product-tag">New</div>' : ''}
                <div class="product-actions">
                    <button class="btn-icon add-to-wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i> Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-info">
                <a href="product-detail.html?id=${product.id}" class="product-name">${product.name}</a>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        </div>
    `;
}