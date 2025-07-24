/**
 * Renders a star rating inside a container.
 * @param {HTMLElement} container - The DOM element to render the stars in.
 * @param {number} rating - The rating value (e.g., 4.8).
 * @param {number} maxStars - The maximum number of stars (default 5).
 */

async function fetchData() {
    try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
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
        star.innerHTML = `<span style="position:relative;display:inline-block;width:1em;">
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
async function displayProducts() {
    const result = await fetchData();
    if (!result || !result.data) {
        console.error("No product data found");
    return;
    }
    const products = result.data;
    const myDiv = document.createElement("div");
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
        myPic.style.cssText = `
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        `
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
        myProduct.style.display = "grid"
        myProduct.style.gridTemplateColumns = "1fr"
        myProduct.style.gridTemplateRows = "1fr auto";
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
    document.body.appendChild(myDiv);
    const imgs = myProducts.getElementsByTagName("img");
    Array.from(imgs).forEach((img) => {
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.objectFit = "contain";
    });
}
displayProducts();