async function fetchFeaturedProducts() {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products?limit=4"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

function renderStars(container, rating, maxStars = 5) {
  container.innerHTML = "";
  for (let i = 1; i <= maxStars; i++) {
    let star = document.createElement("span");
    star.innerHTML = "★";
    star.className = rating >= i ? "star-color" : "empty-color";
    container.appendChild(star);
  }
}

async function displayFeaturedProducts() {
  const products = await fetchFeaturedProducts();
  const container = document.getElementById("featured-products");
  if (!container) return;

  container.innerHTML = `
    <h2 class="text-center text-primary mb-4">Featured Products</h2>
    <div class="d-flex justify-content-around flex-wrap gap-4"></div>
  `;
  const row = container.querySelector("div.d-flex");

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card shadow-sm";
    card.style.width = "18rem";
    card.innerHTML = `
      <img src="${product.images[0]}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text text-success fw-bold">${product.price} EGP</p>
        <div class="mb-2" id="stars-${product._id}"></div>
        <a href="product.html?id=${product._id}" class="btn btn-primary w-100">Show Details</a>
      </div>
    `;
    row.appendChild(card);
    renderStars(
      document.getElementById(`stars-${product._id}`),
      product.ratingsAverage
    );
  });
}

document.addEventListener("DOMContentLoaded", displayFeaturedProducts);

// Optional: Add star styles if not present in your CSS
// .star-color { color: #FFD700; font-size: 1.2em; }
// .empty-color { color: #ccc; font-size: 1.2em; }
