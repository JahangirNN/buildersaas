/* ===== CORE CONFIG & ELEMENTS ===== */
const navbar      = document.getElementById('navbar');
const burger      = document.getElementById('burger');
const mobOverlay  = document.getElementById('mobOverlay');
const cartModal   = document.getElementById('cartModal');
const cartTrigger = document.getElementById('cartTrigger');
const cartCount   = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalText = document.getElementById('cartTotalText');
const checkoutBtn   = document.getElementById('checkoutBtn');
const closeCart     = document.getElementById('closeCart');
const mobClose      = document.getElementById('mobClose');
const mobLinks      = document.querySelectorAll('.mob-link');

let cart = [];
let lastScrollY = window.scrollY;

/* ===== NAVIGATION LOGIC ===== */
function toggleMenu(forceClose = false) {
  if (forceClose || mobOverlay.classList.contains('open')) {
    burger.classList.remove('open');
    mobOverlay.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    burger.classList.add('open');
    mobOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

burger.addEventListener('click', () => toggleMenu());
mobClose.addEventListener('click', () => toggleMenu(true));
mobLinks.forEach(link => link.addEventListener('click', () => toggleMenu(true)));

/* ===== NAVBAR SCROLL BEHAVIOR ===== */
function handleScroll() {
  const currentY = window.scrollY;
  const isAnyMenuOpen = mobOverlay.classList.contains('open') || cartModal.classList.contains('open');

  // Glassmorphism state
  navbar.classList.toggle('scrolled', currentY > 30);

  // Hide/Show logic (only if menus are closed)
  if (!isAnyMenuOpen) {
    if (currentY > lastScrollY && currentY > 100) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
  }
  lastScrollY = Math.max(0, currentY);
}
window.addEventListener('scroll', handleScroll, { passive: true });

/* ===== CART FUNCTIONALITY ===== */
function toggleCart(open = null) {
  const shouldOpen = open !== null ? open : !cartModal.classList.contains('open');
  if (shouldOpen) {
    cartModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    cartModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

cartTrigger.addEventListener('click', () => toggleCart());
closeCart.addEventListener('click', () => toggleCart(false));

function updateCartUI() {
  // Update counter icon
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.innerText = totalQty;

  // Bounce notification
  cartTrigger.classList.remove('bounce');
  void cartTrigger.offsetWidth; // trigger reflow
  cartTrigger.classList.add('bounce');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty <br> <span>Add some herbal goodness!</span></div>';
    cartTotalText.innerText = '₹0';
    checkoutBtn.style.opacity = '0.5';
    checkoutBtn.style.pointerEvents = 'none';
    return;
  }

  checkoutBtn.style.opacity = '1';
  checkoutBtn.style.pointerEvents = 'all';

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item, index) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-price">₹${item.price}</p>
          <div class="cart-item-qty">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
        <button class="btn-remove" onclick="removeFromCart(${index})" aria-label="Remove item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `;
  }).join('');
  
  cartTotalText.innerText = `₹${total}`;
}

window.changeQty = (index, delta) => {
  cart[index].qty += delta;
  if (cart[index].qty < 1) {
    removeFromCart(index);
  } else {
    updateCartUI();
  }
};

window.removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCartUI();
};

// Global Add to Cart listener
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  e.preventDefault();
  const name  = btn.getAttribute('data-name');
  const price = parseInt(btn.getAttribute('data-price'));
  const img   = btn.getAttribute('data-img');

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }

  updateCartUI();
  toggleCart(true); // Open drawer automatically
});

/* ===== CHECKOUT ===== */
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  
  let msg = "🌿 *New Order from Abrra Nature Products* 🌿\n\n";
  let total = 0;
  cart.forEach(item => {
    msg += `• ${item.name} (${item.qty}x) - ₹${item.price * item.qty}\n`;
    total += item.price * item.qty;
  });
  msg += `\n*Grand Total: ₹${total}*\n\n_Please confirm availability for delivery._`;
  
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/919920355666?text=${encoded}`, '_blank');
});

/* ===== SMOOTH ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      toggleMenu(true);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== SCROLL TEXT ANIMATION ENGINE ===== */

// 1. Word-by-word splitting for .word-reveal elements
document.querySelectorAll('.word-reveal').forEach(el => {
  const html = el.innerHTML;
  // Split text nodes into words, preserve HTML tags like <br/>, <em>, etc.
  const fragment = document.createElement('div');
  fragment.innerHTML = html;
  
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach((word, i) => {
        if (word.trim() === '') {
          frag.appendChild(document.createTextNode(word));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = word;
          span.style.transitionDelay = `${i * 0.06}s`;
          frag.appendChild(span);
        }
      });
      return frag;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      node.childNodes.forEach(child => {
        clone.appendChild(processNode(child));
      });
      return clone;
    }
    
    return node.cloneNode(true);
  }
  
  const processed = document.createDocumentFragment();
  fragment.childNodes.forEach(child => {
    processed.appendChild(processNode(child));
  });
  
  el.innerHTML = '';
  el.appendChild(processed);
});

// 2. IntersectionObserver for all animated elements
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

// Observe all [data-anim], [data-anim-stagger], and .word-reveal elements
document.querySelectorAll('[data-anim], [data-anim-stagger], .word-reveal').forEach(el => {
  animObserver.observe(el);
});
