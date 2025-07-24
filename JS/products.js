/**
 * Renders a star rating inside a container.
 * @param {HTMLElement} container - The DOM element to render the stars in.
 * @param {number} rating - The rating value (e.g., 4.8).
 * @param {number} maxStars - The maximum number of stars (default 5).
 */

// Fetch product data from API
async function fetchData() {
    try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Render star rating (supports decimals)
function renderStars(container, rating, maxStars = 5) {
    container.innerHTML = '';
    for (let i = 1; i <= maxStars; i++) {
        const star = document.createElement('span');
        if (rating >= i) {
            star.innerHTML = '★';
            star.style.color = '#de7921';
        } else if (rating > i - 1 && rating < i) {
            const percent = (rating - (i - 1)) * 100;
            star.innerHTML = `<span style="position:relative;display:inline-block;width:1em;">
                <span style="color:#de7921;position:absolute;width:${percent}%;overflow:hidden;">★</span>
                <span style="color:#ccc;">★</span>
            </span>`;
        } else {
            star.innerHTML = '★';
            star.style.color = '#ccc';
        }
        container.appendChild(star);
    }
}

// Display all products
async function displayProducts() {
    const result = await fetchData();
    if (!result || !result.data) {
        console.error("No product data found");
        return;
    }
    const products = result.data;
    const mainContainer = document.createElement("div");
    const productsContainer = document.createElement("div");
    Object.assign(productsContainer.style, {
        width: "100%",
        marginBottom: "50px",
        marginTop: "50px",
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
        justifyContent: "space-around"
    });
    productsContainer.className = "d-flex container";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "oneProduct";
        Object.assign(productCard.style, {
            width: "300px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr auto"
        });

        // Product image
        const imageWrapper = document.createElement("div");
        imageWrapper.style.cssText = `border-top-left-radius: 16px; border-top-right-radius: 16px; width: 100%; grid-row-start: 1; grid-row-end: 2;`;
        imageWrapper.innerHTML = `<img src="${product.images[0]}" alt="product image">`;
        productCard.appendChild(imageWrapper);

        // Product info
        const infoDiv = document.createElement("div");
        Object.assign(infoDiv.style, {
            gridRowStart: "2",
            paddingLeft: "16px",
            paddingRight: "16px"
        });

        const nameP = document.createElement("p");
        nameP.innerHTML = product.title;

        const priceP = document.createElement("p");
        priceP.innerHTML = product.price + " EGP";
        priceP.style.marginTop = "-16px";
        priceP.style.marginBottom = "0px";

        // Rating
        const ratingContainer = document.createElement("div");
        ratingContainer.style.display = "flex";
        renderStars(ratingContainer, product.ratingsAverage);

        const reviewsP = document.createElement("p");
        reviewsP.innerHTML = product.ratingsQuantity + " reviews";
        ratingContainer.appendChild(reviewsP);

        // Button
        const detailsBtn = document.createElement("button");
        detailsBtn.textContent = "Show details";
        detailsBtn.onclick(() =>{
            window.location.href = `/product.html?id=${products[i]._id}`;
        })
        Object.assign(detailsBtn.style, {
            width: "100%",
            borderRadius: "16px"
        });

        // Assemble info
        infoDiv.appendChild(nameP);
        infoDiv.appendChild(priceP);
        infoDiv.appendChild(ratingContainer);
        infoDiv.appendChild(detailsBtn);
        productCard.appendChild(infoDiv);
        productsContainer.appendChild(productCard);
    });

    mainContainer.appendChild(productsContainer);
    document.body.appendChild(mainContainer);

    // Style images
    const imgs = productsContainer.getElementsByTagName("img");
    Array.from(imgs).forEach(img => {
        Object.assign(img.style, {
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain"
        });
    });
}
displayProducts();
