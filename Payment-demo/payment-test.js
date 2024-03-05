// Ensure to use correct API keys and endpoints suited for server-side operations
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

// Replace placeholders with actual data before use
const apiKey = 'YOUR_REAL_API_KEY';
const baseUrl = 'YOUR_REAL_API_ENDPOINT';
const apiClient = new ApiClient(baseUrl, apiKey);

document.addEventListener('DOMContentLoaded', () => {
  // Basket functionality
  const cartButton = document.getElementById('cart');
  const basket = [];

  // Update the basket count
  function updateBasketCount() {
    cartButton.textContent = `Basket (${basket.length})`;
  }

  document.querySelectorAll('.paymentButton').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-name'),
        amount: this.getAttribute('data-amount')
      };
      basket.push(product);
      updateBasketCount();
      console.log('Added to basket:', product);
    });
  });

  cartButton.addEventListener('click', function() {
    if (basket.length > 0) {
      // Proceed to show payment form or page
      initiatePayment(basket);
    } else {
      alert('Your basket is empty.');
    }
  });
});

let paymentInitiated = false;

// Function to handle payment initiation
const initiatePayment = (basket) => {
  if (!paymentInitiated) {
    const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);

    const paymentData = {
      organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
      currency: 'GBP',
      amount: amount,
      capture_now: true,
      dynamic_descriptor: 'Demo Merchant Test Purchase',
      merchant_reference: 'ghjhgjhghfgf',
      return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
      webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
      transaction_type: 'first',
      duplicate_check: false,
      locale: 'en_GB',
      card: {
        create_token: true
      },
      billing_address: {
        first_name: 'FIRSTNAME',
        last_name: 'LASTNAME',
        email: 'EMAIL@DOMAIN.COM',
        address: '12',
        city: 'CITY',
        state: 'STATE',
        postal_code: '34',
        country: 'GB',
        phone: 44123456789
      },
      three_ds: {
        three_ds_required: true,
        three_ds_version: '2.0'
      }      // ... prepare your payment data using the items in the basket ...
      // You will need to aggregate the basket items into a single paymentData object.
      amount: totalAmount.toString(),
      // ... other required payment data fields ...
    };

    apiClient.sendRequest('', 'POST', paymentData)
      .then(responseData => {
        if (responseData && responseData.url) {
          window.location.href = responseData.url;
          paymentInitiated = true;
        } else {
          alert('Failed to initiate payment');
        }
      })
      .catch(error => {
        console.error('Payment initiation failed:', error);
        alert('Error initiating payment. Please try again.');
      });
  } else {
    console.log('Payment has already been initiated.');
  }
};
