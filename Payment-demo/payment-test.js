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
      
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Details: ${JSON.stringify(responseData)}`);
        }
        return responseData;
      } else {
        // Response is not JSON
        const responseText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Response not JSON: ${responseText}`);
      }
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}

const apiKey = 'f742b7dcA75c6A406eAb1cbAf01be0047514';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);
const apiClient = new ApiClient('https://sandbox.apexx.global/atomic/v1/api/payment/hosted', 'f742b7dcA75c6A406eAb1cbAf01be0047514');
let paymentInitiated = false;
let basket = [];

const updateBasketCount = () => {
  const cartButton = document.getElementById('cart');
  cartButton.textContent = `Basket (${basket.length})`;
};

const displayPaymentForm = () => {
  const paymentForm = document.getElementById('payment-form');
  paymentForm.style.display = 'block';
};

const hidePaymentForm = () => {
  const paymentForm = document.getElementById('payment-form');
  paymentForm.style.display = 'none';
};

const initiateCardPayment = async (totalAmount) => {
  if (!paymentInitiated) {
    paymentInitiated = true;
    const paymentData = {
      organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
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

    try {
      const responseData = await apiClient.sendRequest('', 'POST', paymentData);
      if (responseData && responseData.url) {
        const paymentIframe = document.getElementById('payment-iframe');
        paymentIframe.src = responseData.url;
        displayPaymentForm();
      } else {
        alert('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Error initiating payment. Please try again.');
    } finally {
      paymentInitiated = false;
    }
  } else {
    console.log('Payment has already been initiated.');
  }
};
const initiateSOFORTPayment = async (totalAmount) => {
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: '1000',
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx SOFORT Test',
    merchant_reference: 'CT34540',
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    sofort: {
      account_holder_name: 'Test Name',
      redirection_parameters: {
        return_url: 'https://sandbox.apexx.global/atomic/v1/api/return'
      } 
    },
    customer: {
      first_name: 'AP',
      last_name: 'Test',
      email: 'test@test.com',
      phone: '01234567890',
      date_of_birth: '1994-08-11',
      address: {
        country: 'DE'
      }
    },
    delivery_customer: {
      first_name: 'Ppro',
      last_name: 'Test',
      address: {
        address: 'Add 1',
        city: 'City',
        state: 'CA',
        postal_code: '90002',
        country: 'DE'
      }
    }
  };

  try {
    const responseData = await apiClient.sendRequest('', 'POST', paymentData);
    if (responseData && responseData.url) {
      window.location.href = responseData.url;
    } else {
      alert('Failed to initiate SOFORT payment');
    }
  } catch (error) {
    console.error('SOFORT payment initiation failed:', error);
    alert('Error initiating SOFORT payment. Please try again.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-name'),
        amount: this.getAttribute('data-amount')
      };
      basket.push(product);
      updateBasketCount();
    });
  });

  document.querySelectorAll('.pay-with-card').forEach(button => {
    button.addEventListener('click', function() {
      if (basket.length > 0) {
        const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
        initiateCardPayment(totalAmount);
      } else {
        alert('Your basket is empty.');
      }
    });
  });

  document.querySelectorAll('.pay-with-sofort').forEach(button => {
    button.addEventListener('click', function() {
      if (basket.length > 0) {
        const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
        initiateSOFORTPayment(totalAmount);
      } else {
        alert('Your basket is empty.');
      }
    });
  });

  const cartButton = document.getElementById('cart');
  cartButton.addEventListener('click', () => {
    if (basket.length > 0) {
      displayPaymentForm();
      // Additional logic for payment form can be added here
    } else {
      alert('Your basket is empty.');
    }
  });
});
