/**
 * Renders a star rating inside a container.
 * @param {HTMLElement} container - The DOM element to render the stars in.
 * @param {number} rating - The rating value (e.g., 4.8).
 * @param {number} maxStars - The maximum number of stars (default 5).
 * @param {number} pageNumber - refers to page number of the products.
 */

// Global variables for filtering
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    search: '',
    category: '',
    priceRange: '',
    rating: ''
};

async function fetchData(pageNumber = 1) {
    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products?limit=8&page=${pageNumber}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Fetch all products for filtering
async function fetchAllProducts() {
    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products?limit=1000`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        allProducts = data.data;
        populateCategories();
        return data.data;
    } catch (error) {
        console.error("Fetch all products error:", error);
    }
}

// Populate category filter dropdown
function populateCategories() {
    const categories = [...new Set(allProducts.map(product => product.category?.name).filter(Boolean))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Apply filters to products
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Search filter
        if (currentFilters.search && !product.title.toLowerCase().includes(currentFilters.search.toLowerCase())) {
            return false;
        }
        
        // Category filter
        if (currentFilters.category && product.category?.name !== currentFilters.category) {
            return false;
        }
        
        // Price range filter
        if (currentFilters.priceRange) {
            const price = product.price;
            const [min, max] = currentFilters.priceRange.split('-').map(Number);
            
            if (currentFilters.priceRange === '1000+') {
                if (price < 1000) return false;
            } else if (max) {
                if (price < min || price > max) return false;
            }
        }
        
        // Rating filter
        if (currentFilters.rating && product.ratingsAverage < parseFloat(currentFilters.rating)) {
            return false;
        }
        
        return true;
    });
    
    // Update pagination based on filtered results
    updatePagination();
    displayFilteredProducts(1);
}

// Update pagination for filtered results
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / 8);
    const existingPagination = document.querySelector('.pagination-container');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    if (totalPages > 1) {
        createPagesBtns(totalPages, true);
    }
}

// Display filtered products with pagination
function displayFilteredProducts(pageNumber = 1) {
    const startIndex = (pageNumber - 1) * 8;
    const endIndex = startIndex + 8;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    document.getElementById("main").innerHTML = "";
    
    if (pageProducts.length === 0) {
        document.getElementById("main").innerHTML = `
            <div class="container text-center mt-5">
                <div class="alert alert-info">
                    <i class="bi bi-search"></i>
                    <h4>No products found</h4>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            </div>
        `;
        return;
    }
    
    const myDiv = document.getElementById("main");
    const myProducts = document.createElement("div");
    myProducts.className = "d-flex container w-100 my-5 justify-content-around flex-wrap";
    
    pageProducts.forEach(product => {
        const myProduct = document.createElement("div");
        myProduct.className = "oneProduct";
        myProduct.style.width = "300px";
        
        const myPic = document.createElement("div");
        let content = `<img src="${product.images[0]}" alt="product image">`;
        myPic.innerHTML = content;
        myPic.className = "w-100";
        myProduct.appendChild(myPic);
        myProducts.appendChild(myProduct);
        
        const infoDiv = document.createElement("div");
        const proName = document.createElement("p");
        const proPrice = document.createElement("p");
        const numberOfReviews = document.createElement("p");
        const myBtn = document.createElement("button");
        myBtn.style.backgroundColor = "#007bff";
        myBtn.style.color = "#fff";
        const ratingContainer = document.createElement("div");
        
        numberOfReviews.innerHTML = product.ratingsQuantity + " reviews";
        myBtn.textContent = "Show details";
        myBtn.className = "w-100";
        myBtn.style.borderRadius = "16px";
        myBtn.addEventListener("click", ()=>{
            window.location.href = `/product.html?id=${product._id}`
        });
        
        proName.innerHTML = product.title;
        proPrice.innerHTML = product.price + " EGP";
        proPrice.style.marginTop = "-16px"
        proPrice.style.marginBottom = "0px";
        myPic.style.gridRowStart = "1";
        myPic.style.gridRowEnd = "2";
        infoDiv.style.gridRowStart = "2";
        infoDiv.className = "px-3"
        
        renderStars(ratingContainer, product.ratingsAverage)
        ratingContainer.appendChild(numberOfReviews);
        ratingContainer.className = "d-flex";
        
        infoDiv.appendChild(proName);
        infoDiv.appendChild(proPrice);
        infoDiv.appendChild(ratingContainer)
        infoDiv.appendChild(myBtn);
        myProduct.appendChild(infoDiv);
    });
    
    myProducts.style.gap = "30px";
    myDiv.appendChild(myProducts);
    
    const imgs = myProducts.getElementsByTagName("img");
    Array.from(imgs).forEach((img) => {
        img.className = "img-fluid d-block"
        img.style.objectFit = "contain";
    });
}

// Clear all filters
function clearFilters() {
    currentFilters = {
        search: '',
        category: '',
        priceRange: '',
        rating: ''
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceRange').value = '';
    document.getElementById('ratingFilter').value = '';
    
    filteredProducts = [...allProducts];
    updatePagination();
    displayFilteredProducts(1);
}

// Initialize filter event listeners
function initializeFilters() {
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Real-time search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        if (e.target.value.length >= 2 || e.target.value.length === 0) {
            applyFilters();
        }
    });
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        applyFilters();
    });
    
    // Price range filter
    document.getElementById('priceRange').addEventListener('change', (e) => {
        currentFilters.priceRange = e.target.value;
        applyFilters();
    });
    
    // Rating filter
    document.getElementById('ratingFilter').addEventListener('change', (e) => {
        currentFilters.rating = e.target.value;
        applyFilters();
    });
}

function renderStars(container, rating, maxStars = 5) {
    container.innerHTML = ''; // Clear previous content
    for (let i = 1; i <= maxStars; i++) {
        let star = document.createElement('span');
        if (rating >= i) {
        // Full star
        star.innerHTML = '★';
        star.className = "star-color";
    } else if (rating > i - 1 && rating < i) {
        // Partial star (for decimals)
        const percent = (rating - (i - 1)) * 100;
        star.innerHTML = `<span class = "position-relative d-inline-block w-1em">
        <span class = "position-absolute overflow-hidden star-color" style="width:${percent}%;">★</span>
        <span class = "empty-color">★</span>
        </span>`;
    } else {
        // Empty star
        star.innerHTML = '★';
        star.className = "empty-color";
        }
        container.appendChild(star);
    }
}

async function displayProducts(pageNumber = 1) {
    showLoading()
    const result = await fetchData(pageNumber);
    if (!result || !result.data) {
        console.error("No product data found");
    return;
    }
    hideLoading()
    document.getElementById("main").innerHTML = "";
//     var numberOfPages = result.numberOfPages;
// console.log(numberOfPages);

    const products = result.data;
    const myDiv = document.getElementById("main");
    const myProducts = document.createElement("div");
    myProducts.className = "d-flex container w-100 my-5 justify-content-around flex-wrap";
    for (let i = 0; i < products.length; i++) {
        const myProduct = document.createElement("div");
        myProduct.className = "oneProduct";
        myProduct.style.width = "300px";
        const myPic = document.createElement("div");
        let content = `<img src="${products[i].images[0]}" alt="product image">`;
        myPic.innerHTML = content;
        myPic.className = "w-100";
        myProduct.appendChild(myPic);
        myProducts.appendChild(myProduct);
        const infoDiv = document.createElement("div");
        const proName = document.createElement("p");
        const proPrice = document.createElement("p");
        const numberOfReviews = document.createElement("p");
        const myBtn = document.createElement("button");
        myBtn.style.backgroundColor = "#007bff";
        myBtn.style.color = "#fff";
        const ratingContainer = document.createElement("div");
        numberOfReviews.innerHTML = products[i].ratingsQuantity + " reviews";
        myBtn.textContent = "Show details";
        myBtn.className = "w-100";
        myBtn.style.borderRadius = "16px";
        myBtn.addEventListener("click", ()=>{
            window.location.href = `/product.html?id=${products[i]._id}`
        });
        proName.innerHTML = products[i].title;
        proPrice.innerHTML = products[i].price + " EGP";
        proPrice.style.marginTop = "-16px"
        proPrice.style.marginBottom = "0px";
        myPic.style.gridRowStart = "1";
        myPic.style.gridRowEnd = "2";
        infoDiv.style.gridRowStart = "2";
        infoDiv.className = "px-3"
        renderStars(ratingContainer, products[i].ratingsAverage)
        ratingContainer.appendChild(numberOfReviews);
        ratingContainer.className = "d-flex";
        infoDiv.appendChild(proName);
        infoDiv.appendChild(proPrice);
        infoDiv.appendChild(ratingContainer)
        infoDiv.appendChild(myBtn);
        myProduct.appendChild(infoDiv);
    }
    myProducts.style.gap = "30px";
    myDiv.appendChild(myProducts);
    const imgs = myProducts.getElementsByTagName("img");
    Array.from(imgs).forEach((img) => {

        img.className = "img-fluid d-block"
        img.style.objectFit = "contain";
    });
}

let currentActiveBtn = null;
function showLoading() {
    let loadingDiv = document.getElementById("loading-screen");
    if (!loadingDiv) {
        loadingDiv = document.createElement("div");
        loadingDiv.id = "loading-screen";
        loadingDiv.style.width = "100vw";
        loadingDiv.style.height = "100vh";
        loadingDiv.style.display = "flex";
        loadingDiv.innerHTML = `<div class = "fs-2 main-color">
        <span class="spinner-border align-middle" style="width:3rem;height:3rem;"></span>
        Loading...
        </div>`;
        loadingDiv.className = "position-fixed top-0 start-0 align-items-center justify-content-center z-3 load-bg"
        document.body.appendChild(loadingDiv);
    }
    loadingDiv.style.display = "flex";
}

function hideLoading() {
    const loadingDiv = document.getElementById("loading-screen");
    if (loadingDiv) {
        loadingDiv.style.display = "none";
    }
}

// Patch displayProducts to show/hide loading
const originalDisplayProducts = displayProducts;
displayProducts = async function(pageNumber = 1) {
    await originalDisplayProducts(pageNumber);
};

function setActiveButton(btn) {
    if (currentActiveBtn) {
        currentActiveBtn.style.backgroundColor = "";
        currentActiveBtn.style.color = "";
        currentActiveBtn.classList.remove('active');
    }
    btn.style.backgroundColor = "#007bff";
    btn.style.color = "#fff";
    btn.classList.add('active');
    currentActiveBtn = btn;
}

function createPagesBtns(totalPages = 7, isFiltered = false) {
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "pagination-container";
    buttonsDiv.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 30px;`;
    
    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevBtn.className = "page-selector";
    prevBtn.title = "Previous page";
    prevBtn.addEventListener("click", () => {
        const currentPage = getCurrentPage();
        if (currentPage > 1) {
            if (isFiltered) {
                displayFilteredProducts(currentPage - 1);
            } else {
                displayProducts(currentPage - 1);
            }
            updateActiveButton(currentPage - 1);
        }
    });
    buttonsDiv.appendChild(prevBtn);
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = `${i}`;
        btn.className = "page-selector";
        btn.addEventListener("click", () => {
            if (isFiltered) {
                displayFilteredProducts(i);
            } else {
                displayProducts(i);
            }
            setActiveButton(btn);
        });
        if (i === 1) {
            setActiveButton(btn);
        }
        buttonsDiv.appendChild(btn);
    }
    
    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextBtn.className = "page-selector";
    nextBtn.title = "Next page";
    nextBtn.addEventListener("click", () => {
        const currentPage = getCurrentPage();
        if (currentPage < totalPages) {
            if (isFiltered) {
                displayFilteredProducts(currentPage + 1);
            } else {
                displayProducts(currentPage + 1);
            }
            updateActiveButton(currentPage + 1);
        }
    });
    buttonsDiv.appendChild(nextBtn);
    
    document.body.insertBefore(buttonsDiv, document.getElementById("footer"));
}

// Helper function to get current page
function getCurrentPage() {
    const activeBtn = document.querySelector('.page-selector.active');
    if (activeBtn && activeBtn.textContent.match(/^\d+$/)) {
        return parseInt(activeBtn.textContent);
    }
    return 1;
}

// Helper function to update active button
function updateActiveButton(pageNumber) {
    const buttons = document.querySelectorAll('.page-selector');
    buttons.forEach(btn => {
        if (btn.textContent === pageNumber.toString()) {
            setActiveButton(btn);
        }
    });
}

// Initialize the application
async function initializeApp() {
    await fetchAllProducts();
    filteredProducts = [...allProducts];
    initializeFilters();
    displayProducts();
    createPagesBtns();
}

// Start the application
initializeApp();