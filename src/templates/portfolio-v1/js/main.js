// Initialize smooth scroll & mobile menu
document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Toggle Mobile Menu
    menuToggle?.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
    });

    // Close Mobile Menu explicitly
    menuClose?.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Intersection Observer for scroll animations (Reveal)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Shopping Cart Logic
    const cartBtn = document.querySelectorAll('.add-to-cart');
    const cartModal = document.querySelector('.cart-modal');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartClose = document.querySelector('.cart-close');
    const cartItemsBox = document.querySelector('.cart-items');
    const cartCheckout = document.querySelector('.cart-checkout');

    let cart = [];

    cartBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productTitle = btn.getAttribute('data-product');
            cart.push(productTitle);
            updateCartModal();
        });
    });

    function updateCartModal() {
        cartItemsBox.innerHTML = '';
        if(cart.length === 0) {
            cartItemsBox.innerHTML = '<div class="cart-item">Your cart is empty.</div>';
            return;
        }
        
        cart.forEach((item, index) => {
            cartItemsBox.innerHTML += `
                <div class="cart-item">
                    <span>${index + 1}. <strong>${item}</strong></span>
                    <button class="cart-remove-btn" data-index="${index}">&times;</button>
                </div>
            `;
        });
        
        // Attach remove event listeners
        document.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                cart.splice(idx, 1);
                updateCartModal();
            });
        });
        
        // Open Modal
        cartOverlay.classList.add('active');
        cartModal.classList.add('active');
    }

    const closeCart = () => {
        cartOverlay.classList.remove('active');
        cartModal.classList.remove('active');
    };

    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    cartCheckout?.addEventListener('click', () => {
        if (cart.length === 0) return;
        const msg = encodeURIComponent(`Hello Nithin, I would like to order the following books:\n\n${cart.join('\n')}`);
        window.open(`https://wa.me/917778876166?text=${msg}`, '_blank');
        cart = []; // Empty cart after checkout intent
        closeCart();
    });

    // Ensure Video plays silently on load
    const bgVideo = document.getElementById('bg-vid');
    if (bgVideo) {
        bgVideo.muted = true;
        bgVideo.play().catch(console.error);
    }
});
