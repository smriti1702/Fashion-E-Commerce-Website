document.addEventListener('DOMContentLoaded', function () {
    const products = [
        { id: 1, name: 'T-Shirt', category: 'Shirts', sizes: ['S', 'M'], colors: ['red', 'blue'], price: 600, image: 'js/images/tshirt.webp' },
        { id: 2, name: 'Jeans', category: 'Pants', sizes: ['M', 'L'], colors: ['black'], price: 1200, image: 'js/images/jeans4.webp' },
        { id: 3, name: 'T-Shirt', category: 'Shirts', sizes: ['S', 'L'], colors: ['green'], price: 400, image: 'js/images/tshirt2.webp' },
        { id: 4, name: 'Boots', category: 'Shoes', sizes: ['8', '9'], colors: ['white'], price: 800,  image: 'js/images/boot4.jpeg'},
        { id: 5, name: 'T-Shirt', category: 'Shirts', sizes: ['M', 'XL'], colors: ['red', 'yellow'], price: 2020, image: 'js/images/tshirt5.jpeg' },
    ];
    

    function getProductsByCategory(category) {
        return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    function getNewArrivals() {
        return products.slice(0, 3);
    }

    function createProductCard(product) {
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: ₹${product.price}</p>
            </div>
        `;
    }
    

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const collection = urlParams.get('collection');

    const productsTitle = document.getElementById('products-title');
    const productsDescription = document.getElementById('products-description');

    if (category) {
        productsTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        productsDescription.textContent = `Browse our collection of ${category.toLowerCase()}`;

        const categoryCheckbox = document.querySelector(`input[name="category"][value="${category.toLowerCase()}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    } else if (collection) {
        productsTitle.textContent = collection.charAt(0).toUpperCase() + collection.slice(1) + ' Collection';
        productsDescription.textContent = `Explore our ${collection.toLowerCase()} collection`;
    }

    const productsGrid = document.getElementById('products-grid');

    if (productsGrid) {
        let filteredProducts = [];

        if (category) {
            filteredProducts = getProductsByCategory(category);
        } else if (collection === 'new') {
            filteredProducts = getNewArrivals();
        } else {
            filteredProducts = products;
        }

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products found. Try adjusting your filters.</p>';
        } else {
            filteredProducts.forEach(product => {
                productsGrid.innerHTML += createProductCard(product);
            });
        }
    }

    const filterInputs = document.querySelectorAll('.filter-option input');
    const clearFiltersBtn = document.getElementById('clear-filters');

    if (filterInputs.length > 0 && productsGrid) {
        filterInputs.forEach(input => {
            input.addEventListener('change', applyFilters);
        });

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function () {
                filterInputs.forEach(input => {
                    input.checked = false;
                });
                applyFilters();
            });
        }
    }

    function applyFilters() {
        const selectedFilters = {
            category: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(input => input.value),
            size: Array.from(document.querySelectorAll('input[name="size"]:checked')).map(input => input.value),
            color: Array.from(document.querySelectorAll('input[name="color"]:checked')).map(input => input.value),
            price: Array.from(document.querySelectorAll('input[name="price"]:checked')).map(input => input.value)
        };

        let filteredProducts = products;

        if (selectedFilters.category.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                selectedFilters.category.includes(product.category.toLowerCase())
            );
        }

        if (selectedFilters.size.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                product.sizes.some(size => selectedFilters.size.includes(size.toLowerCase()))
            );
        }

        if (selectedFilters.color.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                product.colors.some(color => selectedFilters.color.includes(color.toLowerCase()))
            );
        }

        if (selectedFilters.price.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                return selectedFilters.price.some(range => {
                    if (range === 'under-50') return product.price < 50;
                    if (range === '50-100') return product.price >= 50 && product.price <= 100;
                    if (range === '100-200') return product.price > 100 && product.price <= 200;
                    if (range === 'over-200') return product.price > 200;
                    return false;
                });
            });
        }

        productsGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products found. Try adjusting your filters.</p>';
        } else {
            filteredProducts.forEach(product => {
                productsGrid.innerHTML += createProductCard(product);
            });
        }
    }
});
