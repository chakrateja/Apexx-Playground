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
let basket = []; // Initialize an empty basket

document.addEventListener('DOMContentLoaded', () => {
  updateBasketCounter(); // Initial update

  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.getAttribute('data-name');
      const price = this.getAttribute('data-amount');
      const productId = this.getAttribute('data-id');
      addToBasket(productName, price, productId);
      updateBasketCounter();
    });
  });
});

function addToBasket(productName, price, productId) {
  basket.push({ productName, price, productId });
  console.log(`${productName} added to basket!`);
}

function updateBasketCounter() {
  const counterElement = document.getElementById('basket-counter');
  if (counterElement) {
    counterElement.textContent = basket.length.toString();
  }
}

function initiateCheckout() {
  if (basket.length > 0) {
    const paymentData = basket.map(item => ({
      product_id: item.productId,
      price: item.price
    }));

    // Here we would send the payment data to the API
    apiClient.sendRequest('checkout', 'POST', paymentData)
      .then(responseData => {
        if (responseData && responseData.url) {
          window.location.href = responseData.url; // Redirect to the payment form
        } else {
          console.error('No payment URL received in the response data.');
        }
      })
      .catch(error => {
        console.error('Error occurred while initiating payment:', error);
      });
  } else {
    console.log('Basket is empty.');
  }
}

// Mock function, replace with your actual checkout button or process trigger
function checkoutButtonClicked() {
  initiateCheckout();
}

// Mock function, replace with your actual checkout button or process trigger
function checkoutButtonClicked() {
  initiateCheckout();
}
