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
    myProducts.className = "d-flex container";
    myProducts.justifyContent = "space-around";
    // myProducts.style.marginLeft = "100px"
    for (let i = 0; i < products.length; i++) {
        const myProduct = document.createElement("div");
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
        myProduct.style.display = "grid"
        myProduct.style.gridTemplateColumns = "1fr"
        myProduct.style.gridTemplateRows = "1fr auto";
        proName.innerHTML = products[i].title;
        proPrice.innerHTML = products[i].price + "$";
        // console.log(products[i].price + "$");
        myPic.style.gridRowStart = "1";
        myPic.style.gridRowEnd = "2";
        infoDiv.style.gridRowStart = "2";
        // infoDiv.style.paddingLeft = "45px";
        infoDiv.style.display = "flex";
        infoDiv.style.justifyContent = "space-around"
        infoDiv.appendChild(proName);
        infoDiv.appendChild(proPrice);
        myProduct.appendChild(infoDiv);
    }
    // myProducts.style.width = "100%";
    myProducts.style.display = "flex";
    myProducts.style.flexWrap = "wrap";
    myProducts.style.gap = "30px";
    // myProducts.style.margin = "50px";
    myDiv.appendChild(myProducts);
    document.body.appendChild(myDiv);
    const imgs = myProducts.getElementsByTagName("img");
    Array.from(imgs).forEach((img) => {
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.objectFit = "contain";
        // Add a div under each image

    
    });
}
displayProducts();




/*
    myProducts.childNodes.forEach((myProduct, idx) => {
        myProduct.style.display = "grid";
        myProduct.style.gridTemplateRows = "1fr auto";
        myProduct.style.gridTemplateColumns = "1fr";
        myProduct.style.alignItems = "center";
        const infoDiv = document.createElement("div");
        infoDiv.textContent = products[idx].title || "Product Info";
        infoDiv.style.textAlign = "center";
        infoDiv.style.marginTop = "8px";
        infoDiv.style.fontSize = "14px";
        infoDiv.style.color = "#333";
        myProduct.appendChild(infoDiv);
    });
*/
/*
const infoDiv = document.createElement("div");
        infoDiv.textContent = "Product Info"; // You can customize this
        infoDiv.style.textAlign = "center";
        infoDiv.style.marginTop = "8px";
        infoDiv.style.fontSize = "14px";
        infoDiv.style.color = "#333";
        infoDiv.style.zIndex = "99999";
        img.parentNode.style.display = "flex";
        img.parentNode.style.flexDirection = "column";
        img.parentNode.style.alignItems = "center";
        img.parentNode.appendChild(infoDiv);
*/
// document.body.appendChild(myProducts);

// function displayProducts(d) {
//     const myProducts = document.createElement("div");
//     myProducts.className = "d-flex";
//     for (let i = 0; i < d.length; i++) {
//         const myProduct = document.createElement("div");
//         myProduct.style.width = "20%";
//         const myPic = document.createElement("div")
//         let content = `<img src="${d.images[i]}" alt="product image">`;
//         myPic.innerHTML = content;
//         myPic.style.width = "100%";
//         myProduct.appendChild(myPic);
//         myProducts.appendChild(myProduct);

//     }
//     document.body.appendChild(myProducts);
// }
// displayProducts(d);








// function displayNames(d) {
//   let container = "";
//   for (let index = 0; index < d.length; index++) {
//     container += `
//     <div>${d[index].name}</div>
//     `;
//   }
//   document.body.innerHTML = container;
// }
//for (let index = 0; index < d.length; index++) {
        // let myPic = 

    //}