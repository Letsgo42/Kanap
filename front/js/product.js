const colorSelect = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const cartBtn = document.getElementById("addToCart");

// SELECT PRODUCT ID FROM URL
let params = new URLSearchParams(document.location.search);
let id = params.get("id");
const ressourceURL = (`http://localhost:3000/api/products/${id}`);

// REQUEST DATA FROM API
fetch(ressourceURL)
  .then( (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then( (json) => productDisplay(json) )
  .catch( (error) => console.error(`Fetch problem: ${error}`) );


// SELECT/CREATE DOM ELEMENTS TO DISPLAY PRODUCT INFOS
function productDisplay(product) {
  const itemImg = document.querySelector(".item__img");
  const productName = document.getElementById("title");
  const productDescription = document.getElementById("description");
  const price = document.getElementById("price");
  const kanapImg = document.createElement("img");
  kanapImg.setAttribute("src", product.imageUrl);
  kanapImg.setAttribute("alt", product.altText);
  itemImg.appendChild(kanapImg);
  productName.textContent = product.name;
  price.textContent = product.price;
  productDescription.textContent = product.description;

  colorMenu(product);
}
  

// CREATE DYNAMIC COLOR SELECTION MENU
function colorMenu(product) {
  const colors = product.colors;
  for (const color of colors) {
    const newOption = document.createElement("option");
    newOption.setAttribute("value", color);
    newOption.textContent = `${color}`;
    colorSelect.appendChild(newOption);
  }
}


// CHECK IF COLOR AND QUANTITY SELECTED
function checkSelection() {
  if (colorSelect.value == "")   {
    colorSelect.style.color = "red";
    colorSelect.style.border = "solid 3px red";
    colorSelect.style.fontWeight = "bold";
    colorSelect.addEventListener("change", () => {
      colorSelect.removeAttribute("style");
    })
  }
  else if (Number(quantity.value) === 0 || Number(quantity.value) > 100) {
    let quantitySettings = document.querySelector(".item__content__settings__quantity");
    let quantityErrorMessage = document.createElement("p");
    quantityErrorMessage.textContent = "1 produit minimum, 100 produits maximum";
    quantityErrorMessage.style.color = "orange";
    quantitySettings.appendChild(quantityErrorMessage);
    quantity.style.color = "red";
    quantity.style.border = "solid 3px red";
    quantity.style.fontWeight = "bold";
    quantity.addEventListener("change", () => {
      // if (quantitySettings.childElementCount == 3) {
      quantity.removeAttribute("style");
      quantityErrorMessage.remove();
        //quantitySettings.removeChild(quantityErrorMessage);
    });
    // quantity.removeEventListener("change", removeErrorAttributes); 
  }
  else {
    checkCart();
  }
}


let cartContent = [];

// CONVERT CART LOCAL CONTENT TO JAVASCRIPT ARRAY
function checkCart() {
  let currentContent = localStorage.getItem("cart");
  if (currentContent) {
    cartContent = JSON.parse(currentContent);
  }

  checkProductInCart();
}


// AVOID NEW LINE CREATION IF PRODUCT IS ALREADY IN CART
function checkProductInCart() {
  let cart = {
    id: id,
    color: colorSelect.value,
    quantity: quantity.value
  };

  if (cartContent.length == 0) {
    cartContent.push(cart);
  }
  else {
    for (let i in cartContent) {
      if (cartContent[i].id === cart.id && cartContent[i].color === cart.color) {
        cartContent[i].quantity = (Number(cartContent[i].quantity) + Number(cart.quantity)).toString();
        break;
      }
      else if (i == cartContent.length-1)
       {
        cartContent.push(cart);
      }
    }
  }
  addToCart();
}


// UPDATE CART CONTENT
function addToCart() {
  let jsonCart = JSON.stringify(cartContent);
  localStorage.setItem("cart", jsonCart);

  window.location.href = "../html/cart.html";
}
  
cartBtn.addEventListener("click", checkSelection);
