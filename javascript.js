// ============================================
// ===== TYPING ANIMATION FOR SEARCH BAR =====
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('coffeeSearch');
    if (!searchInput) return;
    
    // Coffee related words for typing animation
    const words = [
        'Search coffee...',
        'Type Here Coffee Name'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    let typingTimeout;
    
    function typeEffect() {
        if (!searchInput) return;
        
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Deleting text
            searchInput.placeholder = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing text
            searchInput.placeholder = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Add blinking cursor effect
        searchInput.classList.add('typing-active');
        
        // If word is complete
        if (!isDeleting && charIndex === currentWord.length) {
            isWaiting = true;
            setTimeout(() => {
                isDeleting = true;
                isWaiting = false;
                typeEffect();
            }, 2000);
            return;
        }
        
        // If deletion is complete
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        // Speed control
        let typingSpeed = isDeleting ? 50 : 100;
        if (isWaiting) typingSpeed = 2000;
        
        typingTimeout = setTimeout(typeEffect, typingSpeed);
    }
    
    setTimeout(typeEffect, 1000);
    
    searchInput.addEventListener('focus', function() {
        clearTimeout(typingTimeout);
        this.placeholder = 'Type to search...';
        this.classList.remove('typing-active');
    });
    
    searchInput.addEventListener('blur', function() {
        if (this.value === '') {
            wordIndex = 0;
            charIndex = 0;
            isDeleting = false;
            isWaiting = false;
            setTimeout(typeEffect, 500);
        }
    });
    
    // ===== Search Functionality for Coffee Selection Page =====
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const coffeeItems = document.querySelectorAll('.coffee-item, .trend-item');
        let visibleCount = 0;
        
        coffeeItems.forEach(item => {
            // Get text content from various possible structures
            let title = '';
            if (item.querySelector('h3')) {
                title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            } else if (item.querySelector('.trend-description p, .trend-description h3')) {
                title = item.querySelector('.trend-description p, .trend-description h3')?.textContent.toLowerCase() || '';
            }
            
            const desc = item.querySelector('.coffee-desc, .text-trend')?.textContent.toLowerCase() || '';
            const tastingNotes = item.querySelector('.coffee-info p:first-child, .text-trend p:nth-child(2)')?.textContent.toLowerCase() || '';
            const brewingMethod = item.querySelector('.coffee-info p:last-child, .text-trend p:nth-child(3)')?.textContent.toLowerCase() || '';
            
            // Combine all searchable text
            const searchableText = title + ' ' + desc + ' ' + tastingNotes + ' ' + brewingMethod;
            
            if (searchTerm === '' || searchableText.includes(searchTerm)) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message for coffee selection page
        if (document.querySelector('.coffee-grid')) {
            const coffeeGrid = document.querySelector('.coffee-grid');
            let noResultsMsg = document.querySelector('.no-results-message');
            
            if (visibleCount === 0 && searchTerm !== '') {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.innerHTML = `<p>No coffee found matching "${searchTerm}"</p>`;
                    coffeeGrid.appendChild(noResultsMsg);
                }
            } else {
                if (noResultsMsg) noResultsMsg.remove();
            }
        }
        
        // Show no results message for trend page (second HTML)
        if (document.querySelector('.trend')) {
            const trendGrid = document.querySelector('.trend');
            let noResultsMsg = document.querySelector('.no-results-message');
            
            if (visibleCount === 0 && searchTerm !== '') {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.style.gridColumn = '1 / -1';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.style.padding = '40px';
                    noResultsMsg.innerHTML = `<p>No coffee found matching "${searchTerm}"</p>`;
                    trendGrid.appendChild(noResultsMsg);
                }
            } else {
                if (noResultsMsg) noResultsMsg.remove();
            }
        }
    });
});

// ============================================
// ===== MOBILE MENU TOGGLE =====
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// ============================================
// ===== CART FUNCTIONS =====
// ============================================

// Get cart from localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('coffeeCart')) || [];
    } catch (e) {
        console.error('Error reading cart:', e);
        return [];
    }
}

// Save cart to localStorage
function saveCart(cart) {
    try {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// Format price
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

// Calculate subtotal
function calculateSubtotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink) {
        // Remove existing count span if any
        const existingSpan = cartLink.querySelector('.cart-count');
        if (existingSpan) existingSpan.remove();
        
        // Add new count span if items > 0
        if (totalItems > 0) {
            const countSpan = document.createElement('span');
            countSpan.className = 'cart-count';
            countSpan.style.cssText = `
                background: #A47551;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
                margin-left: 5px;
                display: inline-block;
            `;
            countSpan.textContent = totalItems;
            cartLink.appendChild(countSpan);
        }
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotif = document.querySelector('.cart-notification');
    if (existingNotif) existingNotif.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles if not already present
    if (!document.querySelector('#cart-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-animation-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// ===== ADD TO CART FUNCTIONALITY =====
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons for both HTML structures
    document.querySelectorAll('.add-cart-btn, .coffee-btn, .add-to-cart-btn, .equip-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the coffee item container
            const coffeeItem = this.closest('.coffee-item, .trend-item, .equipment-card');
            if (!coffeeItem) return;
            
            // Get coffee details
            let name, price, image;
            
            // Check if it's the trend-item structure (second HTML) or coffee-item structure (first HTML)
            if (coffeeItem.classList.contains('trend-item')) {
                // Second HTML structure
                name = coffeeItem.querySelector('.trend-description p, .trend-description h3')?.textContent || 'Coffee';
                const priceElement = coffeeItem.querySelector('.trend-price b');
                price = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
                image = coffeeItem.querySelector('img')?.src || '';
            } else {
                // First HTML structure
                name = coffeeItem.querySelector('h3')?.textContent || 'Coffee';
                const priceText = coffeeItem.querySelector('.coffee-price')?.textContent ||
                coffeeItem.querySelector('.equip-price')?.textContent  || '$0';
                price = parseFloat(priceText.replace('$', '')) || 0;
                image = coffeeItem.querySelector('img')?.src || '';
            }
            
            // Skip if no valid price
            if (price === 0) {
                showNotification('Error: Invalid price', 'error');
                return;
            }
            
            // Create cart item object
            const cartItem = {
                id: Date.now() + Math.random(),
                name: name,
                price: price,
                image: image,
                quantity: 1
            };
            
            // Get existing cart
            let cart = getCart();
            
            // Check if item already exists
            const existingItem = cart.find(item => item.name === cartItem.name);
            
            if (existingItem) {
                existingItem.quantity++;
                showNotification(`${name} quantity updated to ${existingItem.quantity}!`);
            } else {
                cart.push(cartItem);
                showNotification(`${name} added to cart!`);
            }
            
            // Save cart
            saveCart(cart);
            
            // Update cart count
            updateCartCount();
        });
    });
    
    // Initialize cart count on page load
    updateCartCount();
});

// ============================================
// ===== CART PAGE FUNCTIONS =====
// ============================================

// Display cart items (for cart.html)
function displayCart() {
    const cart = getCart();
    const tbody = document.getElementById('cartItems');
    
    if (!tbody) return; // Not on cart page
    
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <h3>Your cart is empty</h3>
                    <p><a href="coffeeselection1.html" style="color: #A47551; text-decoration: none;">Continue shopping</a></p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        // Ensure image path is valid
        const imageSrc = item.image || 'images/placeholder.jpg';
        
        html += `
        <tr>
            <td>
                <div class="product">
                    <img src="${imageSrc}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='images/placeholder.jpg'">
                    <div>
                        <h4 style="margin: 0;">${item.name}</h4>
                        <button class="remove-item-btn" data-id="${item.id}" style="color: #ff4444; background: none; border: none; cursor: pointer; font-size: 12px; padding: 5px 0;">Remove</button>
                    </div>
                </div>
            </td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <div class="qty" style="display: flex; align-items: center; gap: 10px;">
                    <button class="decrease-qty" data-id="${item.id}" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">-</button>
                    <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">+</button>
                </div>
            </td>
            <td>${formatPrice(item.price * item.quantity)}</td>
        </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Update quantity
function updateQuantity(itemId, newQuantity) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.splice(itemIndex, 1);
            showNotification('Item removed from cart');
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
        saveCart(cart);
        displayCart();
        updateTotals();
        updateCartCount();
    }
}

// Remove item
function removeItem(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    displayCart();
    updateTotals();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Update totals on cart page
function updateTotals() {
    // Check if we're on cart page
    if (!document.getElementById('subtotal')) return;
    
    const cart = getCart();
    const subtotal = calculateSubtotal(cart);
    
    // Get shipping cost
    const shippingRadio = document.querySelector('input[name="ship"]:checked');
    const shipping = shippingRadio ? parseFloat(shippingRadio.value) : 5;
    
    // Apply coupon if exists
    let discount = 0;
    const couponCode = document.getElementById('couponCode')?.value;
    if (couponCode && couponCode.toUpperCase() === 'COFFEE10') {
        discount = subtotal * 0.1;
    }
    
    const total = subtotal + shipping - discount;
    
    // Update display
    const subtotalSpan = document.getElementById('subtotal');
    const grandTotalSpan = document.getElementById('grandTotal');
    
    if (subtotalSpan) subtotalSpan.textContent = formatPrice(subtotal);
    if (grandTotalSpan) grandTotalSpan.textContent = formatPrice(total);
}

// Apply coupon
function applyCoupon() {
    const couponCode = document.getElementById('couponCode')?.value;
    if (couponCode && couponCode.toUpperCase() === 'COFFEE10') {
        showNotification('Coupon applied: 10% off!');
    } else if (couponCode) {
        showNotification('Invalid coupon code', 'error');
    }
    updateTotals();
}

// Update cart (refresh)
function updateCart() {
    displayCart();
    updateTotals();
}

// Checkout
function checkout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Show success popup
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.style.display = 'flex';
    }
    
    // Clear cart
    localStorage.removeItem('coffeeCart');
    
    // Update display
    setTimeout(() => {
        displayCart();
        updateTotals();
        updateCartCount();
    }, 100);
}

// Close popup
function closePopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on cart page
    if (document.getElementById('cartItems')) {
        displayCart();
        updateTotals();
        
        // Add event listener for apply coupon button
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', function(e) {
                e.preventDefault();
                applyCoupon();
            });
        }
        
        // Add event listeners for shipping radio
        document.querySelectorAll('input[name="ship"]').forEach(radio => {
            radio.addEventListener('change', updateTotals);
        });
    }
    
    // Initialize cart count
    updateCartCount();
});

// ============================================
// ===== FINAL FIX: Simple and clean solution =====
// ============================================

// Override displayCart function to attach event listeners
const originalDisplayCart = displayCart;
displayCart = function() {
    originalDisplayCart();
    
    // Small delay to ensure DOM is updated
    setTimeout(function() {
        console.log('Attaching cart events...');
        
        // Remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            // Remove old listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                console.log('Remove clicked:', id);
                
                if (id) {
                    // Direct remove
                    let cart = getCart();
                    cart = cart.filter(item => item.id !== id);
                    saveCart(cart);
                    
                    // Update everything
                    originalDisplayCart();
                    updateTotals();
                    updateCartCount();
                    showNotification('Item removed from cart');
                }
            });
        });
        
        // Decrease quantity buttons
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                console.log('Decrease:', id);
                
                let cart = getCart();
                const index = cart.findIndex(item => item.id === id);
                if (index !== -1) {
                    const newQty = cart[index].quantity - 1;
                    if (newQty <= 0) {
                        cart.splice(index, 1);
                        showNotification('Item removed from cart');
                    } else {
                        cart[index].quantity = newQty;
                    }
                    saveCart(cart);
                    originalDisplayCart();
                    updateTotals();
                    updateCartCount();
                }
            });
        });
        
        // Increase quantity buttons
        document.querySelectorAll('.increase-qty').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                console.log('Increase:', id);
                
                let cart = getCart();
                const index = cart.findIndex(item => item.id === id);
                if (index !== -1) {
                    cart[index].quantity++;
                    saveCart(cart);
                    originalDisplayCart();
                    updateTotals();
                    updateCartCount();
                }
            });
        });
    }, 50);
};

// Also run on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cartItems')) {
        setTimeout(function() {
            displayCart();
        }, 100);
    }
});

// Test function
window.testCartNow = function() {
    console.log('Cart:', getCart());
    console.log('Remove buttons:', document.querySelectorAll('.remove-item-btn').length);
    console.log('Update cart function exists:', typeof updateCart === 'function');
};

// Make functions available globally for HTML onclick attributes
window.removeItem = removeItem;
window.updateQuantity = updateQuantity;
window.updateCart = updateCart;
window.checkout = checkout;
window.closePopup = closePopup;
window.applyCoupon = applyCoupon;
window.getCart = getCart;
window.saveCart = saveCart;
window.formatPrice = formatPrice;

// ============================================
// ===== DISCOUNT POPUP FOR INDEX.HTML =====
// ============================================

// Show popup after 3 seconds on index page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on index page (has modal element)
    const modal = document.getElementById('signupModal');
    if (!modal) return; // Not on index page
    
    // Show popup after 3 seconds
    setTimeout(function() {
        modal.style.display = 'flex';
    }, 3000);
    
    // Close button functionality
    const closeBtn = document.querySelector('.signup-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Sign up button functionality
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            const email = document.getElementById('emailInput').value;
            
            // Simple email validation
            if (!email || !email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Hide form section
            document.getElementById('form-section').style.display = 'none';
            
            // Show discount section
            document.getElementById('discount-section').style.display = 'block';
        });
    }
    
    // Copy button functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const discountCode = document.getElementById('discountCode').textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(discountCode).then(function() {
                alert('Discount code copied to clipboard!');
            }).catch(function() {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = discountCode;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('Discount code copied to clipboard!');
            });
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});


// ===== EVENT REGISTER MODAL =====

const eventModal = document.getElementById("registerModal");
const registerBtns = document.querySelectorAll(".register-btn");
const eventCloseBtn = document.querySelector(".event-close-btn");
const eventTitle = document.getElementById("eventTitle");
const registerForm = document.getElementById("registerForm");
const eventSuccessMsg = document.querySelector(".success-msg");

// open modal
registerBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    eventModal.style.display = "flex";
    eventTitle.innerText = btn.dataset.event;
  });
});

// close modal
eventCloseBtn.addEventListener("click", () => {
  eventModal.style.display = "none";
});

// submit form
registerForm.addEventListener("submit", function(e){
  e.preventDefault();
  registerForm.style.display = "none";
  eventSuccessMsg.style.display = "block";
});


// ===== SUBSCRIPTION MODAL =====

const subModal = document.getElementById("subscriptionModal");
const subBtns = document.querySelectorAll(".subscribe-btn");
const subClose = document.querySelector(".subscription-close");

subBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    subModal.style.display="flex";
  });
});

subClose.addEventListener("click",()=>{
  subModal.style.display="none";
});


