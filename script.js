document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.querySelectorAll('#cartList li');
  const cartCountDisplay = document.getElementById('cartCount');
  cartCountDisplay.textContent = `🌭 ${cartItems.length} hot dog carts currently listed.`;
});
