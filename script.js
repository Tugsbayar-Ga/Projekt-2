// Produktdata/array av objekt
const products = [
  { id: 1, name: "Sony WH-1000XM5",       category: "Headphones", price: 3490, img: "img/sony.webp" },
  { id: 2, name: "Apple AirPods Pro",      category: "Headphones", price: 2999, img: "img/airpods.webp" },
  { id: 3, name: "Samsung Galaxy Watch 6", category: "Smartwatch", price: 3299, img: "img/watch.webp" },
  { id: 4, name: "Anker 120W GaN Charger", category: "Charging",   price: 599,  img: "img/charger.webp" },
  { id: 5, name: "Logitech MX Master 3S",  category: "Computer",   price: 1299, img: "img/mouse.webp" },
  { id: 6, name: "USB-C Cable Set 3-pack", category: "Cables",     price: 299,  img: "img/cables.webp" }
];

// Varukorg, array av objekt sparad i localStorage
// id, name, price, img, qty
let cart = [];

// LOCALSTORAGE
function saveCart() {
  localStorage.setItem("techshop_cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("techshop_cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}

// VARUKORG/ lägg till, ändra, ta bort
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    // Produkten finns redan/ öka antal
    existing.qty += 1;
  } else {
    // Lägg till nytt objekt i varukorg
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }

  saveCart();
  updateCartUI();

  // Knapp feedback efter händelse
  const btn = document.querySelector(`[onclick="addToCart(${id})"]`);
  if (btn) {
    btn.textContent = "✓ Added";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = "+ Buy";
      btn.classList.remove("added");
    }, 1500);
  }

  showToast("✓ " + product.name + " added to cart!");
}

function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;

  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  showToast("Cart cleared.");
}

// UPPDATERA VARUKORG
function updateCartUI() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const antalEl = document.querySelector(".varukorg-antal");

  // Totalt antal varor
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  if (antalEl) antalEl.textContent = totalQty;

  // Totalpris
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = totalPrice.toLocaleString("sv-SE") + " kr";

  // Bygg varukorgens lista
  if (!itemsEl) return;
  itemsEl.innerHTML = "";

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-msg"><p>🛒</p><p>Your cart is empty.</p></div>`;
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-row-info">
        <p>${item.name}</p>
        <span>${(item.price * item.qty).toLocaleString("sv-SE")} kr</span>
      </div>
      <div class="qty">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>`;
    itemsEl.appendChild(row);
  });
}

// VARUKORG PANEL - öppna/stäng
function oppnaVarukorg() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function stangVarukorg() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  clearCart();
  stangVarukorg();
}

// SÖK OCH FILTER
function filterProducts() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const category = document.getElementById("filter-category").value;

  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const cat  = card.querySelector(".category").textContent;

    const matchSearch   = name.includes(search);
    const matchCategory = category === "" || cat === category;

    if (matchSearch && matchCategory) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// HAMBURGER-MENY
function toggleMobiMeny() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("open");
}

// POPUP
function closePopup() {
  document.getElementById("popup").classList.remove("open");
}

// TOAST
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// INIT - körs när sidan laddas
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartUI();

  // Stäng varukorg med Escape-tangenten
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") stangVarukorg();
  });

  // Visa popup en gång per session
  if (!sessionStorage.getItem("popup_seen")) {
    document.getElementById("popup").classList.add("open");
    sessionStorage.setItem("popup_seen", "true");
  }
});