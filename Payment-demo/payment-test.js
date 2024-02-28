
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

// This will hold the basket items
let basket = [];

document.addEventListener('DOMContentLoaded', () => {
  // Add to basket button functionality
  document.querySelectorAll('.addToBasketButton').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-product-name'),
        price: parseFloat(this.getAttribute('data-amount')),
        id: this.getAttribute('data-product-id')
      };
      basket.push(product);
      updateBasketDisplay(); // Update your basket display here
    });
  });

  // Checkout button functionality
  document.getElementById('checkoutButton').addEventListener('click', () => {
    const totalAmount = basket.reduce((total, product) => total + product.price, 0);
    initiatePayment(totalAmount);
  });
});

const updateBasketDisplay = () => {
  // Logic to display basket items goes here
  console.log('Basket updated:', basket);
};

let paymentInitiated = false;

const initiatePayment = (amount) => {
  if (!paymentInitiated) {
    // Dynamically create the payment data object with the total amount
    const paymentData = {
      organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
      currency: 'GBP',
      amount: amount * 100, // Assuming amount is in pounds, convert to pence
      capture_now: true,
      dynamic_descriptor: 'Demo Merchant Test Purchase',
      merchant_reference: `ref_${Date.now()}`,
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
        phone: '44123456789'
      },
      three_ds: {
        three_ds_required: true,
        three_ds_version: '2.0'
      }
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
        alert('Error initiating payment. Please try again.');
      });
  }
};

const updateBasketDisplay = () => {
  // Logic to display basket items goes here
  console.log('Basket updated:', basket);
};

// This function can be used to render the basket items in the HTML
function renderBasket() {
  const basketContainer = document.querySelector('.basket-container');
  basketContainer.innerHTML = ''; // Clear the basket container
  basket.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'basket-item';
    itemElement.innerHTML = `
      <p>${item.name}</p>
      <p>Price: £${item.price.toFixed(
<p>Price: £${item.price.toFixed(2)}</p>
      <button onclick="removeFromBasket(${index})">Remove</button>
    `;
    basketContainer.appendChild(itemElement);
  });
  // Display the total price in the basket
  const totalPrice = basket.reduce((total, item) => total + item.price, 0).toFixed(2);
  const totalElement = document.createElement('div');
  totalElement.className = 'total';
  totalElement.innerHTML = `<p>Total: £${totalPrice}</p>`;
  basketContainer.appendChild(totalElement);
  // Show the basket container if it has items
  if (basket.length > 0) {
    basketContainer.classList.remove('hidden');
  }
}

// This function handles the removal of an item from the basket
function removeFromBasket(index) {
  basket.splice(index, 1); // Remove the item from the basket array
  renderBasket(); // Re-render the basket UI
}

// This function will handle the checkout process
function proceedToCheckout() {
  // You can add more checkout functionality here
  // For example, collecting additional user information, or showing a payment form
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm.classList.remove('hidden');
}

// Add event listener to the checkout button
document.getElementById('goToCheckout').addEventListener('click', proceedToCheckout);

// Sample products for demonstration purposes
const sampleProducts = [
  {
    name: 'Product 1',
    price: 50.00,
    imageUrl: 'path_to_product_1_image'
  },
  {
    name: 'Product 2',
    price: 75.00,
    imageUrl: 'path_to_product_2_image'
  },
  {
    name: 'Product 3',
    price: 100.00,
    imageUrl: 'path_to_product_3_image'
  }
];

// On document ready, render the sample products
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(sampleProducts);
});
