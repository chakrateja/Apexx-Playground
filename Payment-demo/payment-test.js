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
  const baseUrl = 'https://pm-apexx.github.io/Apexx-Playground/';
  const apiClient = new ApiClient(baseUrl, apiKey);
  
  let paymentInitiated = false;
  
  const updateBasketCount = (basket) => {
    const cartButton = document.getElementById('cart');
    cartButton.textContent = `Basket (${basket.length})`;
  };
  
  const displayPaymentForm = () => {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
      paymentForm.style.display = 'block';
    } else {
      console.error('Payment form not found');
    }
  };
  
  const initiatePayment = (basket) => {
    if (!paymentInitiated) {
        const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
        const paymentData = {
          organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
          currency: 'GBP',
          amount: totalAmount, // Use the calculated total amount
          capture_now: true,
          dynamic_descriptor: 'Demo Merchant Test Purchase',
          merchant_reference: 'ref_' + Date.now(), // Dynamically generate a reference
          return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
          webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
          transaction_type: 'first',
          duplicate_check: false,
          locale: 'en_GB',
          card: {
            create_token: true
          },
          billing_address: {
            first_name: 'John', // Placeholder for real customer data
            last_name: 'Doe', // Placeholder for real customer data
            email: 'john.doe@example.com', // Placeholder for real customer data
            address: '123 Main Street', // Placeholder for real customer data
            city: 'London', // Placeholder for real customer data
            state: 'London', // Placeholder for real customer data
            postal_code: 'SW1A 1AA', // Placeholder for real customer data
            country: 'GB', // Placeholder for real customer data
            phone: '441234567890' // Placeholder for real customer data
          },
          three_ds: {
            three_ds_required: true,
            three_ds_version: '2.0'
          }
        };
     apiClient.sendRequest('', 'POST', paymentData)
          .then(responseData => {
            if (responseData && responseData.url) {
              // Load the payment URL into the iframe and display it
              const paymentIframe = document.getElementById('payment-iframe');
              if (paymentIframe) {
                paymentIframe.src = responseData.url;
                paymentIframe.style.display = 'block';
              } else {
                console.error('Payment iframe not found');
              }
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
  
  document.addEventListener('DOMContentLoaded', () => {
    const basket = [];
  
    document.querySelectorAll('.add-to-basket').forEach(button => {
      button.addEventListener('click', function() {
        const product = {
          name: this.getAttribute('data-name'),
          amount: this.getAttribute('data-amount')
        };
        basket.push(product);
        updateBasketCount(basket);
      });
    });
  
    const cartButton = document.getElementById('cart');
    cartButton.addEventListener('click', () => {
      if (basket.length > 0) {
        displayPaymentForm();
        initiatePayment(basket);
      } else {
        alert('Your basket is empty.');
      }
    });
  });
