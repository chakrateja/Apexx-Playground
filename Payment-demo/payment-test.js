
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
  // Assuming there's an element with id="basket-counter" to display the count
  const counterElement = document.getElementById('basket-counter');
  if (counterElement) {
    counterElement.textContent = basket.length.toString();
  }
}

function initiateCheckout() {
  if (basket.length > 0) {
    console.log('Initiating payment for:', basket);
    // Example of compiling basket into payment data format
    const paymentData = basket.map(item => ({
      product_id: item.productId,
      price: item.price
    }));
    console.log('Compiled payment data:', paymentData);

    // Example payment initiation (mock)
    console.log('Mock sending payment data...', paymentData);
    setTimeout(() => {
      console.log('Payment successful!');
      basket = []; // Clear the basket after successful payment
      updateBasketCounter(); // Update the basket counter
    }, 1000); // Mock async operation like an API call
  } else {
    console.log('Basket is empty.');
  }
}
