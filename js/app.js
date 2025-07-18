document.addEventListener("DOMContentLoaded", function () {
    const medicineList = document.getElementById("medicine-list");
    const searchBox = document.getElementById("search");

    function renderMedicines(filter = "") {
        medicineList.innerHTML = "";
        medicines
            .filter(med => med.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(med => {
                const medCard = document.createElement("div");
                medCard.classList.add("col-md-4", "mb-4");
                medCard.innerHTML = `
                    <div class="card h-100 shadow">
                        <img src="${med.image}" class="card-img-top medicine-img" alt="${med.name}">
                        <div class="card-body">
                            <h5 class="card-title">${med.name}</h5>
                            <p class="card-text">${med.use}</p>
                            <p class="card-text text-success"><strong>₹${med.price}</strong></p>
                            <button class="btn btn-primary add-to-cart" data-id="${med.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
                medicineList.appendChild(medCard);
            });

        attachCartEvents();
    }

    function attachCartEvents() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", function () {
                const medicineId = parseInt(this.dataset.id);
                addToCart(medicineId);
            });
        });
    }

    function addToCart(medicineId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let item = cart.find(med => med.id === medicineId);
        if (item) {
            item.quantity += 1;
        } else {
            let medicine = medicines.find(med => med.id === medicineId);
            cart.push({ ...medicine, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showNotification(); // Show notification
    }
    
    function showNotification() {
        let notification = document.getElementById("cart-notification");
        notification.classList.remove("d-none");
        
        setTimeout(() => {
            notification.classList.add("d-none");
        }, 1500); // Hide after 1.5 seconds
    }
    
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    searchBox.addEventListener("input", function () {
        renderMedicines(this.value);
    });

    renderMedicines();
    updateCartCount();
});
