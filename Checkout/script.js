// Function to fetch CSV-2 data
function fetchCSVData() {
    return fetch('https://docs.google.com/spreadsheets/d/1YGBXPngNh_h85jaFgLPkUievvpG_1jLpampn8qPmMYk/export?format=csv')
        .then(response => response.text())
        .then(data => {
            // Parse CSV data
            const rows = data.split('\n').slice(1);
            return rows.map(row => row.split(','));
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to get cart items (CSV-1 data) from cache
function getCartItems() {
    const cartData = localStorage.getItem('cartItems') || '[]';
    return JSON.parse(cartData);
}

function autofillForm() {
    // Get the phone number from the cache
    const cachedCredentials = localStorage.getItem('authorizedCredentials');
    if (cachedCredentials) {
        const { phoneNumber } = JSON.parse(cachedCredentials);
        document.getElementById('phone-number').value = phoneNumber;
    }

    function showMainContent() {
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }

    // Fetch CSV-2 data
    fetchCSVData().then(csvData => {
        // Get the phone number from the cache
        const cachedCredentials = localStorage.getItem('authorizedCredentials');
        if (cachedCredentials) {
            const { phoneNumber } = JSON.parse(cachedCredentials);

            // Find the matching row in CSV-2
            const match = csvData.find(row => row[0] === phoneNumber);
            if (match) {
                const customerName = match[2];
                document.getElementById('customer-name-display').innerHTML = `Customer Name: <span>${customerName}</span>`;
            }
        }

        // Get the cart items from the cache (CSV-1 data)
        const cartItems = getCartItems();
        const ordersField = document.getElementById('orders');
        ordersField.innerHTML = ''; // Clear existing content
        cartItems.forEach((item, index) => {
            const orderNumber = index + 1;
            const productClassName = `ordered-product`; // Create a class name for ordered product
            const productHTML = `<div class="${productClassName}">
<strong>${orderNumber}. ${item.name}</strong><br>
         <div class="ordered-product-details"><em>Author: ${item.company}</em><br>
         <em>Quantity: ${item.quantity} ${item.per}</em></div></div>
      `;
            ordersField.innerHTML += productHTML;
        });

        // Trigger form validity check
        checkFormValidity();

        showMainContent();

    });
}


// Function to check the form validity
function checkFormValidity() {
    const requiredFields = document.querySelectorAll('#checkout-form input[required], #checkout-form textarea[required]');
    const orderNowButton = document.getElementById('order-now-button');
    const remarksField = document.getElementById('remarks');

    let allFieldsFilled = true;
    requiredFields.forEach(field => {
        if (!field.value) {
            allFieldsFilled = false;
        }
    });

    orderNowButton.disabled = !allFieldsFilled && remarksField.value === '';
}



// Function to generate a random 5-digit number
function generateRandomNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Function to get the current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

// Function to generate the WhatsApp message link
function generateWhatsAppLink() {
    const phoneNumber = '918876710720';
    const currentDate = new Date();
    const orderNumber = currentDate.getFullYear() + '' + (currentDate.getMonth() + 1) + '' + currentDate.getDate() + '' + generateRandomNumber();
    const orders = document.getElementById('orders').textContent;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const remarks = document.getElementById('remarks').value;
    const message = `Date and time: *${getCurrentDateTime()}*\nOrder Number: *${orderNumber}*\n\n\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\n*Orders:*\n${orders}\n\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\n\n*Delivery address:*\n${deliveryAddress}\n\n*Remarks:*\n${remarks}\n\n\*Thank you*`;
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
}

// Function to handle the order now button click
function handleOrderNow() {
    const link = generateWhatsAppLink();
    window.open(link, '_blank');
}

// Autofill the form fields on page load
window.addEventListener('DOMContentLoaded', autofillForm);

// Attach event listeners
document.querySelectorAll('#checkout-form input[required], #checkout-form textarea[required]').forEach(field => {
    field.addEventListener('input', checkFormValidity);
});

document.getElementById('remarks').addEventListener('input', checkFormValidity);

document.getElementById('order-now-button').addEventListener('click', handleOrderNow);