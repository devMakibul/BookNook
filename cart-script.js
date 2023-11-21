const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const proceedButton = document.getElementById('proceed-button');

// Retrieve cart items from the cache
const cartData = localStorage.getItem('cartItems');
let cartItems = JSON.parse(cartData) || [];

// Display cart items on the Cart page
function displayCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        const emptyCart = document.createElement('div');
        emptyCart.className = 'empty-cart';
        emptyCart.textContent = 'Your cart is empty.';
        cartItemsContainer.appendChild(emptyCart);
    } else {
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';

            const productName = document.createElement('span');
            productName.className = 'product-name';
            productName.innerHTML = `${item.name}<br>`;

            const companyName = document.createElement('span');
            companyName.className = 'company-name';
            companyName.innerHTML = `${item.company}<br>`;

            const priceLabel = document.createElement('span');
            priceLabel.className = 'price-label';
            priceLabel.innerHTML = `<span style="font-size:20px">\u20B9${item.price}</span> / ${item.per}<br>`;

            const quantityDropdown = document.createElement('select');
            quantityDropdown.className = 'dropdown-menu';
            quantityDropdown.addEventListener('change', function () {
                item.quantity = parseInt(this.value);
                updateCart();
            });

            const selectOption = document.createElement('option');
            selectOption.value = '';
            selectOption.disabled = true;
            selectOption.selected = true;
            selectOption.textContent = 'Select Quantity';

            quantityDropdown.appendChild(selectOption);

            for (let i = 1; i <= 100; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.innerHTML = `${i} ${item.per}`;
                quantityDropdown.appendChild(option);
            }

            quantityDropdown.value = item.quantity !== undefined ? item.quantity : '';

            cartItemDiv.appendChild(productName);
            cartItemDiv.appendChild(companyName);
            cartItemDiv.appendChild(priceLabel);
            cartItemDiv.appendChild(quantityDropdown);

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function () {
                cartItems = cartItems.filter(i => i.name !== item.name);
                updateCart();
            });
            cartItemDiv.appendChild(removeButton);

            cartItemsContainer.appendChild(cartItemDiv);
        });
    }

    calculateTotalPrice();
    checkProceedButtonValidity();
}

// Function to update the cart
function updateCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
    checkProceedButtonValidity();
}

// Function to calculate and display the total price
function calculateTotalPrice() {
    const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    cartTotal.textContent = `Total Price: \u20B9${totalPrice.toFixed(2)}`;
}

// Function to check the validity of the proceed button
function checkProceedButtonValidity() {
    proceedButton.disabled = cartItems.length === 0 || cartItems.some(item => item.quantity === undefined || item.quantity <= 0);
}

// Initialize the cart and proceed button
displayCartItems();

// Attach event listener to the proceed button
proceedButton.addEventListener('click', function () {
    // Redirect to the specific URL
    window.location.href = 'login.html';
});