// SELECT ORDER ID FROM URL THEN DISPLAY IT //
let params = new URLSearchParams(document.location.search);
let id = params.get("order");

const orderId = document.getElementById("orderId");
orderId.textContent = id;


// EMPTY LOCAL STORAGE //
localStorage.clear();