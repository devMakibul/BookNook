// Function to fetch the CSV data
function fetchCSVData() {
    return fetch('https://docs.google.com/spreadsheets/d/1YGBXPngNh_h85jaFgLPkUievvpG_1jLpampn8qPmMYk/export?format=csv')
        .then(response => response.text())
        .then(data => data.split('\n').map(row => row.split(',')))
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Function to check credentials and redirect if found
function checkCredentials() {
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const customerID = document.getElementById('customer-id').value.trim();

    // Fetch the CSV data
    fetchCSVData().then(csvData => {
        const match = csvData.find(row => row[0] === phoneNumber && row[1] === customerID);

        if (match) {
            // Save the credentials in the browser's cache
            localStorage.setItem('authorizedCredentials', JSON.stringify({ phoneNumber, customerID }));

            // Hide the form and show loading message
            document.getElementById('credentials-form').style.display = 'none';
            document.getElementById('loading-message').style.display = 'block';

            // Redirect to the specific link
            window.location.href = '/p/checkout.html';
        } else {
            // Show an error message or perform any other action
            alert('Invalid credentials. Please try again.');
        }
    });
}

// Check if credentials are available in the cache
const cachedCredentials = localStorage.getItem('authorizedCredentials');
if (cachedCredentials) {
    const { phoneNumber, customerID } = JSON.parse(cachedCredentials);

    // Hide the form and show loading message
    document.getElementById('credentials-form').style.display = 'none';
    document.getElementById('loading-message').style.display = 'block';

    // Redirect to the specific link
    window.location.href = '/p/checkout.html';
} else {
    // Hide the loading message and show the form
    document.getElementById('loading-message').style.display = 'none';
    document.getElementById('credentials-form').style.display = 'block';

    // Search button click event
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', checkCredentials);
}

const phoneNumberInput = document.getElementById("phone-number");
const customerIdInput = document.getElementById("customer-id");
const searchButton = document.getElementById("search-button");
const pleaseWaitMessage = document.getElementById("please-wait-message");

function checkInputs() {
    if (phoneNumberInput.value !== "" && customerIdInput.value !== "") {
        searchButton.style.display = "block";
    } else {
        searchButton.style.display = "none";
    }
}

function performSearch() {
    searchButton.style.display = "none";
    pleaseWaitMessage.style.display = "block";

    // Simulating a search or loading process
    setTimeout(function () {
        // After a delay (simulating a search), reset the form
        phoneNumberInput.value = "";
        customerIdInput.value = "";
        pleaseWaitMessage.style.display = "none";
        searchButton.style.display = "none"; // Keep the button hidden after search
        checkInputs(); // Check inputs again to show the button when inputs are filled
    }, 8000); // Adjust the delay as needed
}

phoneNumberInput.addEventListener("input", checkInputs);
customerIdInput.addEventListener("input", checkInputs);
checkInputs(); // Initially check inputs to show/hide the button