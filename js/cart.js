document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Show notification function
    function showNotification(message) {
        const cartNotification = document.getElementById("cart-notification");
        if (cartNotification) {
            cartNotification.innerText = message;
            cartNotification.classList.remove("d-none");

            setTimeout(() => {
                cartNotification.classList.add("d-none");
            }, 1500); // Hide after 1.5 seconds
        }
    }

    function loadCart() {
        cartContainer.innerHTML = "";
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalPriceElement.innerText = "0";
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("d-flex", "justify-content-between", "align-items-center", "border", "p-2", "mb-2");
            cartItem.innerHTML = `
                <div>
                    <img src="${item.image}" class="cart-img" alt="${item.name}">
                    <strong>${item.name}</strong>
                    <p class="text-muted">₹${item.price} each</p>
                </div>
                <div>
                    <button class="btn btn-outline-secondary btn-sm decrease" data-id="${item.id}">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-outline-secondary btn-sm increase" data-id="${item.id}">+</button>
                    <button class="btn btn-danger btn-sm remove" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        updateTotal();
        attachCartEvents();
    }

    function attachCartEvents() {
        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", function () {
                updateQuantity(this.dataset.id, 1);
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", function () {
                updateQuantity(this.dataset.id, -1);
            });
        });

        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", function () {
                removeItem(this.dataset.id);
            });
        });
    }

    function updateQuantity(medicineId, change) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let item = cart.find(med => med.id === parseInt(medicineId));

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(med => med.id !== item.id);
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }

    function removeItem(medicineId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(med => med.id !== parseInt(medicineId));
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }

    function updateTotal() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceElement.innerText = total;
    }

    checkoutBtn.addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            showNotification("⚠️ Your cart is empty! Please add items before checkout.");
        } else {
            localStorage.setItem("cart", JSON.stringify([])); // Empty the cart
            showNotification("✅ Checkout successful! Redirecting to home page...");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect to home page after notification
            }, 1500); // Allow notification to show for 1.5 seconds before redirect
        }
    });

    loadCart();
});
