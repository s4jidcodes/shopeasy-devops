/* ============================================================
   ShopEasy — script.js
   All storefront logic: products, cart, wishlist, search,
   filters, newsletter, toast. Vanilla JS only.
   ============================================================ */

/* ---------- Product catalogue ---------- */
/* img: primary photo · img2: hover alternate angle */
const PRODUCTS = [
  { id:1, name:'Premium Laptop',      vendor:'ShopEasy Tech', cat:'Electronics', price:55000, old:65000, rating:5, reviews:124, tag:'Sale',
    img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80' },
  { id:2, name:'Smartphone Pro',      vendor:'ShopEasy Tech', cat:'Electronics', price:25000, old:28999, rating:5, reviews:96,  tag:'New',
    img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80' },
  { id:3, name:'Wireless Headphones', vendor:'AudioMax',      cat:'Accessories', price:2500,  old:3500,  rating:4, reviews:210, tag:'Sale',
    img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80' },
  { id:4, name:'Smart Watch',         vendor:'FitLife',       cat:'Wearables',   price:4999,  old:5999,  rating:5, reviews:167, tag:'Sale',
    img:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80' },
  { id:5, name:'Mechanical Keyboard', vendor:'KeyCraft',      cat:'Accessories', price:1500,  old:null,  rating:4, reviews:88,  tag:'',
    img:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80' },
  { id:6, name:'Wireless Mouse',      vendor:'KeyCraft',      cat:'Accessories', price:800,   old:1100,  rating:4, reviews:143, tag:'Sale',
    img:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' },
  { id:7, name:'Smart Speaker',       vendor:'AudioMax',      cat:'Electronics', price:3499,  old:4299,  rating:4, reviews:75,  tag:'New',
    img:'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80' },
  { id:8, name:'Fitness Band',        vendor:'FitLife',       cat:'Wearables',   price:1999,  old:null,  rating:4, reviews:119, tag:'',
    img:'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    img2:'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800&q=80' },
];

/* ---------- State ---------- */
let cart = [];          // [{id, qty}]
let wishlist = [];      // [id]
let activeCat = 'All';

/* ---------- Helpers ---------- */
const fmt = n => '₹' + n.toLocaleString('en-IN');
const stars = r => '★'.repeat(r) + '☆'.repeat(5 - r);
const discount = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

/* If a remote image fails, swap in a branded gradient fallback */
function imgFallback(img, label){
  img.onerror = null;
  const d = document.createElement('div');
  d.className = 'img-fallback';
  d.textContent = (label || 'SHOPEASY');
  img.replaceWith(d);
}

/* ============================================================
   PRODUCT GRID
   ============================================================ */
function renderGrid(){
  const list = PRODUCTS.filter(p => activeCat === 'All' || p.cat === activeCat);
  document.getElementById('productGrid').innerHTML = list.map((p, i) => `
    <div class="card" style="animation-delay:${i * 60}ms">
      <div class="card-media">
        ${p.tag ? `<span class="tag ${p.tag.toLowerCase()}">${p.tag}${p.old ? ' · −' + discount(p) + '%' : ''}</span>` : ''}
        <button class="wish ${wishlist.includes(p.id) ? 'active' : ''}" onclick="toggleWish(${p.id}, this)" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="${wishlist.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.9 8.8-8.9a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy"
             onmouseover="this.dataset.s=this.src; this.src='${p.img2}'"
             onmouseout="this.src=this.dataset.s"
             onerror="imgFallback(this,'${p.name.toUpperCase()}')">
        <button class="hover-add" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
      <div class="card-info">
        <p class="vendor">${p.vendor}</p>
        <h3>${p.name}</h3>
        <div class="rating-row"><span class="stars">${stars(p.rating)}</span><span class="rcount">(${p.reviews})</span></div>
        <div class="price-row">
          <span class="now">${fmt(p.price)}</span>
          ${p.old ? `<s>${fmt(p.old)}</s><span class="off">${discount(p)}% OFF</span>` : ''}
        </div>
      </div>
    </div>`).join('');
}

function filterCat(cat, btn){
  activeCat = cat;
  if (btn){
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  } else {
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  }
  renderGrid();
}

/* ============================================================
   WISHLIST
   ============================================================ */
function toggleWish(id, btn){
  const i = wishlist.indexOf(id);
  if (i > -1){ wishlist.splice(i, 1); }
  else {
    wishlist.push(id);
    const p = PRODUCTS.find(p => p.id === id);
    toast(`♥ ${p.name} saved to wishlist`);
  }
  const el = document.getElementById('wishCount');
  el.textContent = wishlist.length;
  el.classList.toggle('hidden', wishlist.length === 0);
  if (btn){
    btn.classList.toggle('active', i === -1);
    btn.querySelector('svg').setAttribute('fill', i === -1 ? 'currentColor' : 'none');
    btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
  }
  renderGrid();
}

/* ============================================================
   CART
   ============================================================ */
function addToCart(id){
  const it = cart.find(i => i.id === id);
  it ? it.qty++ : cart.push({ id, qty: 1 });
  const p = PRODUCTS.find(p => p.id === id);
  toast(`✓ ${p.name} added to your cart`);
  const c = document.getElementById('cartCount');
  c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  renderCart();
}

function changeQty(id, d){
  const it = cart.find(i => i.id === id);
  it.qty += d;
  if (it.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart(){
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const box = document.getElementById('cartItems');

  if (!cart.length){
    box.innerHTML = `<div class="empty"><span class="big">🛍️</span>Your cart is currently empty.<br><small>Discover something you'll love.</small></div>`;
  } else {
    box.innerHTML = cart.map(i => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return `<div class="citem">
        <div class="thumb"><img src="${p.img}" alt="${p.name}" onerror="imgFallback(this,'${p.name.toUpperCase()}')"></div>
        <div class="mid">
          <h4>${p.name}</h4>
          <p class="pr">${fmt(p.price)} each</p>
          <div class="qty">
            <button onclick="changeQty(${i.id},-1)" aria-label="Decrease quantity">−</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${i.id},1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="rt">
          <strong>${fmt(p.price * i.qty)}</strong>
          <button class="rm" onclick="removeItem(${i.id})">Remove</button>
        </div>
      </div>`;
    }).join('');
  }

  const total = cart.reduce((s, i) => s + PRODUCTS.find(p => p.id === i.id).price * i.qty, 0);
  document.getElementById('cartTotal').textContent = fmt(total);
  document.getElementById('checkoutBtn').disabled = !cart.length;
}

function openCart(){
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = '';
}
function checkout(){
  if (!cart.length) return;
  const total = cart.reduce((s, i) => s + PRODUCTS.find(p => p.id === i.id).price * i.qty, 0);
  toast(`🎉 Order placed! ${fmt(total)} — Thank you for shopping with ShopEasy`);
  cart = [];
  renderCart();
  setTimeout(closeCart, 800);
}

/* ============================================================
   SEARCH
   ============================================================ */
function openSearch(){
  document.getElementById('searchOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderSearchResults();
  setTimeout(() => document.getElementById('searchInput').focus(), 120);
}
function closeSearch(){
  document.getElementById('searchOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function renderSearchResults(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const list = q ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
                 : PRODUCTS.slice(0, 4);
  const box = document.getElementById('searchResults');
  if (!list.length){
    box.innerHTML = `<div class="sp-empty">No products found for “${q}”. Try “laptop”, “watch” or “headphones”.</div>`;
    return;
  }
  if (!q) box.innerHTML = `<p style="grid-column:1/-1;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">Popular right now</p>`;
  box.innerHTML = (q ? '' : box.innerHTML) + list.map((p, i) => `
    <button class="sp-item" style="animation-delay:${i * 50}ms" onclick="closeSearch(); addToCart(${p.id})">
      <div class="thumb"><img src="${p.img}" alt="${p.name}" onerror="imgFallback(this,'${p.name.toUpperCase()}')"></div>
      <h4>${p.name}</h4>
      <p class="p">${fmt(p.price)}${p.old ? `<s>${fmt(p.old)}</s>` : ''}</p>
    </button>`).join('');
}

/* ============================================================
   NEWSLETTER
   ============================================================ */
function subscribe(e){
  e.preventDefault();
  const email = document.getElementById('nlEmail').value;
  toast(`💌 Welcome to the club! Your 10% code is on its way to ${email}`);
  document.getElementById('nlEmail').value = '';
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function openMobileMenu(){
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu(){
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ============================================================
   GLOBAL UI: keyboard, scroll reveal, navbar shadow
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ closeCart(); closeSearch(); closeMobileMenu(); }
});

const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visible'); revealIO.unobserve(e.target); } });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ---------- Init ---------- */
renderGrid();
renderCart();
