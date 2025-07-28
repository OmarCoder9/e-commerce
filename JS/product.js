const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // DOM references
  let gameN = document.querySelector('#game-name');
  let gameP = document.querySelector('#game-price');
  let gameImg = document.querySelector('#game-img');
  let gameD = document.querySelector('#game-desc');
  let gameT = document.querySelector('#game-trailer');

  // cart
  let cartGames = JSON.parse(localStorage.getItem('cart-games')) || {};

  // API call
  const apiUrl = `https://ecommerce.routemisr.com/api/v1/products/${productId}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const product = data.data;

      gameN.innerHTML = product.title;
      gameP.innerHTML = product.price + " EGP";
      gameD.innerHTML = product.description;
      gameImg.setAttribute('src', product.imageCover);


      if (product.brand) document.querySelector('#game-developer').innerText = product.brand.name;
      if (product.category) document.querySelector('#game-genre').innerText = product.category.name;
    })
    .catch(err => {
      console.error("Error fetching product:", err);
    });


  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const gameToBeAdded = {
        gameName: gameN.innerText,
        gamePrice: gameP.innerText,
        gameImage: gameImg.getAttribute('src'),
        gameId: productId,
      };
      cartGames[productId] = gameToBeAdded;
      localStorage.setItem('cart-games', JSON.stringify(cartGames));
      document.getElementById('cart-counter').innerHTML = Object.keys(cartGames).length;
      alert("The Game Has Been Added To Cart Successfully!");
    }

    if (e.target.classList.contains('add-to-cart-related')) {
      const gameToBeAdded = {
        gameName: e.target.getAttribute('gamename'),
        gamePrice: e.target.getAttribute('gameprice'),
        gameImage: e.target.getAttribute('gameimage'),
        gameId: e.target.getAttribute('gameid'),
      };
      cartGames[e.target.getAttribute('gameid')] = gameToBeAdded;
      localStorage.setItem('cart-games', JSON.stringify(cartGames));
      document.getElementById('cart-counter').innerHTML = Object.keys(cartGames).length;
      alert("The Product Has Been Added To Cart Successfully!");
    }
  });