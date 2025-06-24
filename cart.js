// Cart logic for all pages

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  setCart(cart);
}

function removeCartItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  setCart(cart);
}

function updateCartValue(idx, field, delta) {
  const cart = getCart();
  if (!cart[idx]) return;
  if (field === 'portions' || field === 'plates' || field === 'portionsPerPlate') {
    cart[idx][field] = Math.max(1, (cart[idx][field] || 1) + delta);
  }
  setCart(cart);
}

function updateCartInstructions(idx, value) {
  const cart = getCart();
  if (!cart[idx]) return;
  cart[idx].specialInstructions = value;
  setCart(cart);
}

// Optionally, add a function to update cart count in the header
function updateCartCount() {
  const cart = getCart();
  const count = cart.length;
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count > 0 ? count : '';
} 