// DON'T DISPLAY FORM IF EMPTY CART
function checkEmptyCart() {
  if (cartContent.length == 0) {
    let cartPrice = document.querySelector(".cart__price");
    let catrOrder = document.querySelector(".cart__order");
    cartPrice.style.display = "none";
    catrOrder.style.display = "none";
  }
}


// CONVERT CART LOCAL CONTENT TO JAVASCRIPT ARRAY
let cartContent = [];
let currentContent = localStorage.getItem("cart");
if (currentContent) {
  cartContent = JSON.parse(currentContent);
}
checkEmptyCart();


// REQUEST PRODUCTS DATA FROM API //
const ressourceURL = "http://localhost:3000/api/products/";
const getProducts = fetch(ressourceURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  });

getProducts.then((products) => displayCart(products))
.catch((error) => console.error(`Fetch problem: ${error}`));


// DISPLAY PRODUCTS IN CART //
function displayCart(products) {
  for (let product of products) {
    for (let i in cartContent) {
      if (product._id === cartContent[i].id) { 
        let article = document.createElement("article"); 
        let imgDiv = document.createElement("div");
        let img = document.createElement("img");
        let itemContent = document.createElement("div");
        let itemContentDescription = document.createElement("div");
        let productName = document.createElement("h2");
        let productColor = document.createElement("p");
        let productPrice = document.createElement("p");
        let itemSettings = document.createElement("div");
        let itemSettingsQuantity = document.createElement("div");
        let quantity = document.createElement("p");
        let inputQuantity = document.createElement("input");
        let itemSettingsDelete = document.createElement("div");
        const deleteBtn = document.createElement("p");
        const cartItems = document.getElementById("cart__items");

        article.classList.add("cart__item");
        article.setAttribute("data-id", `${cartContent[i].id}`);
        article.setAttribute("data-color", `${cartContent[i].color}`);
        imgDiv.classList.add("cart__item__img");
        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);
        itemContent.classList.add("cart__item__content");
        itemContentDescription.classList.add("cart__item__content__description");
        productName.textContent = `${product.name}`;
        productColor.textContent = `${cartContent[i].color}`;
        productPrice.textContent = `${product.price}€`;
        itemSettings.classList.add("cart__item__content__settings");
        itemSettingsQuantity.classList.add("cart__item__content__settings__quantity");
        quantity.textContent = "Qté : ";
        inputQuantity.classList.add("itemQuantity");
        inputQuantity.setAttribute("type", "number");
        inputQuantity.setAttribute("name", "itemQuantity");
        inputQuantity.setAttribute("min", "1");
        inputQuantity.setAttribute("max", "100");
        inputQuantity.setAttribute("value", `${cartContent[i].quantity}`);
        itemSettingsDelete.classList.add("cart__item__content__settings__delete");
        deleteBtn.classList.add("deleteItem");
        deleteBtn.textContent = "Supprimer";

        imgDiv.appendChild(img);
        itemContentDescription.appendChild(productName);
        itemContentDescription.appendChild(productColor);
        itemContentDescription.appendChild(productPrice);
        itemSettingsQuantity.appendChild(quantity);
        itemSettingsQuantity.appendChild(inputQuantity);
        itemSettingsDelete.appendChild(deleteBtn);
        itemSettings.appendChild(itemSettingsQuantity);
        itemSettings.appendChild(itemSettingsDelete);
        itemContent.appendChild(itemContentDescription);
        itemContent.appendChild(itemSettings);
        article.appendChild(imgDiv);
        article.appendChild(itemContent);
        cartItems.appendChild(article);

        displayTotal();

        deleteBtn.addEventListener("click", deleteItem);
        inputQuantity.addEventListener("change", changeQuantity);
      }
    }
  }
}


// NEW REQUEST FOR PRICES DATA //
function displayTotal() {
  getProducts.then( (products) => display(products) )
    .catch( (error) => console.error(`Fetch problem displayTotal: ${error}`) );
  }


// DISPLAY TOTAL QUANTITY AND PRICE //
function display(products) {
  let totalQuantity = document.getElementById("totalQuantity");
  let totalPrice = document.getElementById("totalPrice");
  totalQuantity.textContent = 0;
  totalPrice.textContent = 0;
  for (let product of products) {
    for (let i in cartContent) {
      if (product._id == cartContent[i].id) {
      totalQuantity.textContent = Number(totalQuantity.textContent) + parseInt(`${cartContent[i].quantity}`);
      totalPrice.textContent = Number(totalPrice.textContent) + ((product.price) * parseInt(`${cartContent[i].quantity}`));
      }
    }
  }
  let jsonCart = JSON.stringify(cartContent);
  localStorage.setItem("cart", jsonCart);
}


// DELETE ARTICLE //
function deleteItem(e) {
  const parent = e.target.closest("article.cart__item");
  parent.remove();

  for (let i in cartContent) {
    let parentId = parent.getAttribute("data-id");
    if (parentId == `${cartContent[i].id}`) {
      cartContent.splice(i, 1);
      let jsonCart = JSON.stringify(cartContent);
      localStorage.setItem("cart", jsonCart);
      displayTotal();
      checkEmptyCart();
    }
  }
}


// CHANGING QUANTITY CHANGES TOTAL //
function changeQuantity(e) {
  let parent = e.target.closest("article.cart__item");
  let parentId = parent.getAttribute("data-id");
  let parentColor = parent.getAttribute("data-color");

  for (let i in cartContent) {
    if (parentId == `${cartContent[i].id}` && parentColor == `${cartContent[i].color}`) {
      cartContent[i].quantity = e.target.value;
      displayTotal();
    }
  }
}


// SELECT FROM DOM ELEMENTS //
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
const order = document.getElementById("order");

let firstNameError = document.getElementById("firstNameErrorMsg");
let lastNameError = document.getElementById("lastNameErrorMsg");
let addressError = document.getElementById("addressErrorMsg");
let cityError = document.getElementById("cityErrorMsg");
let emailError = document.getElementById("emailErrorMsg");

const formQuestion = document.querySelectorAll(".cart__order__form__question > input");
formQuestion.forEach(question => 
  question.addEventListener("change", checkUserForm)
);


// TEST INPUT VALIDITY //
function checkUserForm() {
  //const firstRegx = /[^A-Za-z-]/gi;
  //const lastCityRegx = /[^A-Za-z\s-]/gi;
  //const nameCityRegx = /^[a-z ,.'-]{2,}$/i;
  const nameCityRegx = /^[\p{L} ,.'-]{2,}$/ui;
  const addressRegx = /^[\p{L}\d ,'.\/-]{2,}$/ui;
  const emailRegx = /^\w+(?:[\.-]?\w+)*@\w+(?:[\.-]?\w+)*(?:\.\w{2,3})+$/i;
  const firstTest = nameCityRegx.test(firstName.value);
  const lastTest = nameCityRegx.test(lastName.value);
  const addressTest = addressRegx.test(address.value);
  const cityTest = nameCityRegx.test(city.value);
  const emailTest = emailRegx.test(email.value)
    
  if (firstTest == false) {
    throwError("first");
  } else {firstNameError.textContent = "";}
  if (lastTest == false) {
    throwError("last");
  } else {lastNameError.textContent = "";}
  if (addressTest == false) {
    throwError("address");
  } else {addressError.textContent = "";}
  if (cityTest == false) {
    throwError("city");
  } else {cityError.textContent = "";}
  if (emailTest == false) {
    throwError("email");
  } else {emailError.textContent = "";}

  if (firstTest == true && lastTest == true && addressTest == true && cityTest == true && emailTest == true) {
    order.addEventListener("click", buildBody);
  }
  order.addEventListener("click", (e) => e.preventDefault());
}


// DISPLAY ERROR MESSAGE IF INVALID INPUT //
function throwError(string) {
  const invalidMessage = "Champ invalide !";

  if (string.includes("first")) {
    firstNameError.textContent = `${invalidMessage}`;
  } else if (string.includes("last")) {
    lastNameError.textContent = `${invalidMessage}`;
  } else if (string.includes("address")) {
    addressError.textContent = `${invalidMessage}`;
  } else if (string.includes("city")) {
    cityError.textContent = `${invalidMessage}`;
  } else if (string.includes("email")) {
    emailError.textContent = `${invalidMessage}`;
  }
}


// BUILD CONTACT OBJECT //
function buildBody() {
  let products = [];
  for (let i in cartContent) {
    products.push(cartContent[i].id);
  };
  
  let bodyObject = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products
  }
   postOrder(bodyObject);
}


// POST REQUEST //
function postOrder(bodyObject) {
  let postRequest = new Request("http://localhost:3000/api/products/order");

    fetch(postRequest, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(bodyObject)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((responses) => confirmOrder(responses))
    .catch((error) => console.error(`POST problem: ${error}`));
  }


// DISPLAY ORDER ID ON CONFIRMATION PAGE //
function confirmOrder(responses) {
  let orderId = responses.orderId;
  window.location.href = `../html/confirmation.html?order=${orderId}`;
}
