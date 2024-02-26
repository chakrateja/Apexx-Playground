class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async sendRequest(endpoint, method = 'POST', requestData = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': this.apiKey
      },
    };

    if (requestData) {
      options.body = JSON.stringify(requestData);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      return responseData;
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}

const apiKey = '473be873A0912A4eedAb26cA2edf67bb4faa';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);

// Define sample basket items
const basketItems = [
  { name: 'Product 1', price: 20 },
  { name: 'Product 2', price: 30 },
  { name: 'Product 3', price: 15 }
];

// Function to display basket items
const displayBasketItems = () => {
  const basketItemsContainer = document.getElementById('basketItems');

  // Clear existing items
  basketItemsContainer.innerHTML = '';

  // Add each item to the basket
  basketItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.textContent = `${item.name}: $${item.price}`;
    basketItemsContainer.appendChild(itemElement);
  });
};

// Call the function to display basket items when the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayBasketItems();

  // Add event listener to the "Proceed to Payment" button
  const paymentButton = document.getElementById('paymentButton');
  paymentButton.addEventListener('click', redirectToPaymentPage);
});

let paymentInitiated = false; // Flag to track if payment has been initiated

const redirectToPaymentPage = () => {
  if (!paymentInitiated) {
    apiClient.sendRequest('', 'POST', paymentData)
      .then(responseData => {
        console.log('API Response Data:', responseData);
        if (responseData && responseData.url) {
          console.log('Redirecting to:', responseData.url);
          window.location.href = responseData.url; // Redirecting to the received URL
          paymentInitiated = true; // Update flag to indicate payment initiated
        }
      })
      .catch(error => {
        console.error('Error occurred while sending API request:', error);
      });
  } else {
    // If payment already initiated, simply reload the page
    location.reload();
  }
};

// Force a reload of the page when navigating back
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    location.reload();
  }
});
