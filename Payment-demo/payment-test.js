
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
        'X-APIKEY': this.apiKey,
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

// Basket to store added products
let basket = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.addToBasketButton').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.getAttribute('data-product-name'); // Dynamic product name
      const amount = this.getAttribute('data-amount'); // Dynamic product price
      const productId = this.getAttribute('data-product-id'); // Product ID if needed
      addToBasket(amount, productName, productId);
    });
  });

  // Checkout button event listener
  document.getElementById('checkoutButton').addEventListener('click', function() {
    if (basket.length > 0) {
      initiatePaymentForBasket();
    } else {
      console.log('Your basket is empty.');
    }
  });
});

const addToBasket = (amount, productName, productId) => {
  basket.push({ amount, productName, productId });
  console.log('Added to basket:', productName);
};

const initiatePaymentForBasket = () => {
  let totalAmount = basket.reduce((total, product) => total + parseInt(product.amount), 0);
  
  // Construct paymentData for all items in the basket
  const paymentData = {
    organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
    currency: 'GBP',
    amount: totalAmount, // Total amount for all items in the basket
    // Other payment details remain the same
    // Add your additional payment data here
  };

  apiClient.sendRequest('', 'POST', paymentData)
    .then(responseData => {
      console.log('API Response Data:', responseData);
      if (responseData && responseData.url) {
        console.log('Redirecting to:', responseData.url);
        window.location.href = responseData.url;
      } else {
        console.error('No payment URL received in the response data.');
      }
    })
    .catch(error => {
      console.error('Error occurred while initiating payment:', error);
    });
};
