// Function to fetch and display book information
function fetchAndDisplaybookInformation() {
    // Fetch CSV data
    fetch("https://docs.google.com/spreadsheets/d/1CnWO_1k6P6jQgOV26kkHARG2QUDXap9lEown2CxZdQ8/gviz/tq?tqx=out:csv&sheet=Sheet1")
        .then((response) => response.text())
        .then((data) => {
            // Save CSV data in cache
            localStorage.setItem("bookData", data);
            // Shuffle the books randomly
            const shuffledData = shuffleData(data);
            displaybookInformation(shuffledData);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Function to shuffle the book data randomly
function shuffleData(data) {
    const rows = data.split("\n");

    // Remove the header row
    const headerRow = rows.shift();

    // Shuffle the remaining rows randomly
    const shuffledRows = rows.sort(() => Math.random() - 0.5);

    // Combine the header row and shuffled rows
    const shuffledData = [headerRow, ...shuffledRows].join("\n");
    return shuffledData;
}

// Function to display book information

function displaybookInformation(data) {
    // Clear previous book information
    const container = document.getElementById("book-container");
    container.innerHTML = "";

    // Parse CSV data
    const rows = data.split("\n").slice(1);
    const books = rows.map((row) => row.split(","));

    // Get the search term
    const searchTerm = document.getElementById("search-bar").value.trim().toLowerCase();
    let resultsCount = 0; // Variable to track the search results count

    // Create HTML elements dynamically
    books.forEach((book) => {
        const bookBox = document.createElement("div");
        bookBox.className = "book-box";

        const bookIntro = document.createElement("div");
        bookIntro.className = "book-intro";

        const bookThumb = document.createElement("div");
        bookThumb.className = "book-thumb product-thumb";
        bookThumb.innerHTML = `<img style="height: 100% !important;" class="bookThumb" src="${book[8].replace(/"/g, "")}"></img>`;

        bookIntro.appendChild(bookThumb);

        const bookIntroinside = document.createElement("div");
        bookIntroinside.className = "book-introinside";

        const bookName = document.createElement("div");
        bookName.className = "book-name product-name";
        bookName.innerHTML = `<p class="bookname"> ${book[1].replace(/"/g, "")}</p>
                              <p class="authorname">${book[2].replace(/"/g, "")}</p>
                              <p class="bookprice"><span style="font-size:15px">\u20B9${book[4].replace(/"/g, "")}</span>.00</p>`;

        bookIntroinside.appendChild(bookName);
        bookIntro.appendChild(bookIntroinside);
        bookBox.appendChild(bookIntro);

        const bookDetails = document.createElement("div");
        bookDetails.className = "book-details";
        bookDetails.innerHTML = `<p><strong class="company">Total pages:</strong> ${book[3].replace(/"/g, "")}</p>
                                 <p><strong>Product ID:</strong> ${book[0].replace(/"/g, "")}</p>`;
        bookBox.appendChild(bookDetails);

        const cartData = localStorage.getItem("cartItems") || "[]";
        const cartItems = JSON.parse(cartData);
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        const shareButton = document.createElement("button");
        shareButton.innerHTML =
            '<svg class="white-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ShareRoundedIcon" tabindex="-1" title="ShareRounded"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path></svg>';
        shareButton.className = "share-button";
        shareButton.addEventListener("click", function () {
            const productId = book[0].replace(/"/g, "");
            const currentUrl = window.location.href;
            const hasM1Parameter = currentUrl.includes("?m=1");
            let newUrl = currentUrl.split("?")[0];
            if (hasM1Parameter) {
                newUrl += `?id=${productId}&m=1`;
            } else {
                newUrl += `?id=${productId}`;
            }
            if (navigator.share) {
                navigator.share({
                    title: `${book[1].replace(/"/g, "")}`,

                    url: newUrl,
                });
            } else {
                prompt("Copy the link below:", newUrl);
            }
        });

        buttonContainer.appendChild(shareButton);

        const addToCartButton = document.createElement("button");
        addToCartButton.innerHTML = cartItems.some((item) => item.name === book[1].replace(/"/g, "")) ?
            '<svg class="white-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteForeverOutlinedIcon" tabindex="-1" title="DeleteForeverOutlined"><path d="M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path></svg> Remove' :
            '<svg class="white-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddShoppingCartOutlinedIcon" tabindex="-1" title="AddShoppingCartOutlined"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z"></path></svg> Add';

        addToCartButton.className = "add-to-cart-button";
        addToCartButton.addEventListener("click", function () {
            const updatedCartItems = cartItems.filter((item) => item.name !== book[1].replace(/"/g, ""));
            if (
                addToCartButton.innerHTML ===
                '<svg class="white-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddShoppingCartOutlinedIcon" tabindex="-1" title="AddShoppingCartOutlined"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z"></path></svg> Add'
            ) {
                updatedCartItems.push({
                    name: book[1].replace(/"/g, ""),
                    per: book[5].replace(/"/g, ""),
                    company: book[2].replace(/"/g, ""),
                    price: book[4].replace(/"/g, ""),
                });
            }

            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
            displaybookInformation(data);
        });

        buttonContainer.appendChild(addToCartButton);
        bookBox.appendChild(buttonContainer);

        // Check if the book matches the search term
        const matchTerm = book[1].toLowerCase().includes(searchTerm) || book[0].toLowerCase().includes(searchTerm) || book[3].toLowerCase().includes(searchTerm);

        // Show or hide the book box based on the match
        if (searchTerm === "" || (matchTerm && searchTerm !== "")) {
            container.appendChild(bookBox);

            resultsCount++; // Increment the search results count
        }
    });

    // Display the search results count if there are search results
    const searchResults = document.getElementById("search-results");
    searchResults.textContent = ""; // Clear the search results div
    if (searchTerm !== "") {
        const resultsText = document.createElement("span");
        resultsText.textContent = `${resultsCount} Result(s) found`;
        searchResults.appendChild(resultsText);
    }
}

// Reload Data button click event
const reloadDataButton = document.getElementById("reload-data-button");
reloadDataButton.addEventListener("click", function () {
    localStorage.removeItem("bookData");
    localStorage.removeItem("cartItems"); // Clear the cart cache as well
    window.location.href = "https://bookstore.makibul.com";
});

// Search bar input event
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", function () {
    const cachedData = localStorage.getItem("bookData");
    if (cachedData) {
        displaybookInformation(cachedData);
    }
});

// Check if CSV data is present in the cache
const cachedData = localStorage.getItem("bookData");
if (cachedData) {
    displaybookInformation(cachedData);
} else {
    fetchAndDisplaybookInformation();
}

// Check for ID parameter in URL and autofill search bar
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("id");
if (idParam) {
    document.getElementById("search-bar").value = idParam;
    displaybookInformation(cachedData); // Display only the product matching the ID
}