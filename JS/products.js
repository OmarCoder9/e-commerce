/**
 * Renders a star rating inside a container.
 * @param {HTMLElement} container - The DOM element to render the stars in.
 * @param {number} rating - The rating value (e.g., 4.8).
 * @param {number} maxStars - The maximum number of stars (default 5).
 * @param {number} pageNumber - refers to page number of the products.
 */

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

function renderStars(container, rating, maxStars = 5) {
    container.innerHTML = ''; // Clear previous content
    for (let i = 1; i <= maxStars; i++) {
        let star = document.createElement('span');
        if (rating >= i) {
        // Full star
        star.innerHTML = '★';
        star.style.color = '#de7921';
        } else if (rating > i - 1 && rating < i) {
        // Partial star (for decimals)
        const percent = (rating - (i - 1)) * 100;
        star.innerHTML = `<span class = "position-relative d-inline-block w-1em">
            <span style="color:#de7921;position:absolute;width:${percent}%;overflow:hidden;">★</span>
            <span style="color:#ccc;">★</span>
        </span>`;
        } else {
        // Empty star
        star.innerHTML = '★';
        star.style.color = '#ccc';
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
    const products = result.data;
    const myDiv = document.getElementById("main");
    const myProducts = document.createElement("div");
    myProducts.style.width = "100%";
    myProducts.style.marginBottom = "50px";
    myProducts.style.marginTop = "50px";
    myProducts.className = "d-flex container";
    myProducts.justifyContent = "space-around";
    for (let i = 0; i < products.length; i++) {
        const myProduct = document.createElement("div");
        myProduct.className = "oneProduct";
        myProduct.style.width = "300px";
        const myPic = document.createElement("div");
        let content = `<img src="${products[i].images[0]}" alt="product image">`;
        myPic.innerHTML = content;
        myPic.style.width = "100%";
        myProduct.appendChild(myPic);
        myProducts.appendChild(myProduct);
        const infoDiv = document.createElement("div");
        const proName = document.createElement("p");
        const proPrice = document.createElement("p");
        const numberOfReviews = document.createElement("p");
        const myBtn = document.createElement("button");
        const ratingContainer = document.createElement("div");
        numberOfReviews.innerHTML = products[i].ratingsQuantity + " reviews";
        myBtn.textContent = "Show details";
        myBtn.style.width = "100%"
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
        infoDiv.style.paddingLeft = "16px";
        infoDiv.style.paddingRight = "16px";
        renderStars(ratingContainer, products[i].ratingsAverage)
        ratingContainer.appendChild(numberOfReviews);
        ratingContainer.style.display = "flex";
        infoDiv.appendChild(proName);
        infoDiv.appendChild(proPrice);
        infoDiv.appendChild(ratingContainer)
        infoDiv.appendChild(myBtn);
        myProduct.appendChild(infoDiv);
    }
    myProducts.style.display = "flex";
    myProducts.style.flexWrap = "wrap";
    myProducts.style.gap = "30px";
    myDiv.appendChild(myProducts);
    const imgs = myProducts.getElementsByTagName("img");
    Array.from(imgs).forEach((img) => {
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.objectFit = "contain";
    });
}
displayProducts();
let currentActiveBtn = null;
function showLoading() {
    let loadingDiv = document.getElementById("loading-screen");
    if (!loadingDiv) {
        loadingDiv = document.createElement("div");
        loadingDiv.id = "loading-screen";
        loadingDiv.style.position = "fixed";
        loadingDiv.style.top = "0";
        loadingDiv.style.left = "0";
        loadingDiv.style.width = "100vw";
        loadingDiv.style.height = "100vh";
        loadingDiv.style.background = "rgba(255,255,255,0.8)";
        loadingDiv.style.display = "flex";
        loadingDiv.style.alignItems = "center";
        loadingDiv.style.justifyContent = "center";
        loadingDiv.style.zIndex = "9999";
        loadingDiv.innerHTML = `<div style="font-size:2rem;color:#007bff;">
            <span class="spinner-border" style="width:3rem;height:3rem;vertical-align:middle;"></span>
            Loading...
        </div>`;
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
    }
    btn.style.backgroundColor = "#007bff";
    btn.style.color = "#fff";
    currentActiveBtn = btn;
}
function createPaginationButtons(totalPages = 7) {
    const paginationDiv = document.createElement("div");
    paginationDiv.style.display = "flex";
    paginationDiv.style.justifyContent = "center";
    paginationDiv.style.gap = "10px";
    paginationDiv.style.marginBottom = "30px";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = `${i}`;
        btn.style.padding = "8px 16px";
        btn.style.borderRadius = "8px";
        btn.style.border = "1px solid #ccc";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            displayProducts(i);
            setActiveButton(btn);
        });
        if (i === 1) {
            setActiveButton(btn);
        }
        paginationDiv.appendChild(btn);
    }
    document.body.insertBefore(paginationDiv, document.getElementById("footer"));
}

createPaginationButtons();