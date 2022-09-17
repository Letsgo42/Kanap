const ressourceURL = "http://localhost:3000/api/products/";

// Request data and handle response from api
fetch(ressourceURL)
  .then( (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then( (products) => productsDisplay(products) )
  .catch( (error) => console.error(`Fetch problem: ${error}`) );

// Select/create a DOM element for each product and display it
function productsDisplay(products) {
  const items = document.getElementById("items");
  
  products.forEach(product => {
    const link = document.createElement("a");
    const article = document.createElement("article");
    const img = document.createElement("img");
    const productName = document.createElement("h3");
    const productDescription = document.createElement("p");

    link.setAttribute("href", `../html/product.html?id=${product._id}`);
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);
    
    productName.classList.add("productName");
    productName.textContent = product.name;
    productDescription.classList.add("productDescription");
    productDescription.textContent = product.description;

    link.appendChild(article);
    article.appendChild(img);
    article.appendChild(productName);
    article.appendChild(productDescription);
    items.appendChild(link);
  });  
}
