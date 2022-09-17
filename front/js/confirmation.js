// SELECT ORDER ID FROM URL
let params = new URLSearchParams(document.location.search);
let id = params.get("order");

const orderId = document.getElementById("orderId");
orderId.textContent = id;