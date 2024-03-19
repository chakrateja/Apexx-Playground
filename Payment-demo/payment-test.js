class ApiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async sendRequest(fullUrl, method, requestData) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': this.apiKey
      },
      body: JSON.stringify(requestData)
    };

    try {
      const response = await fetch(fullUrl, options);
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Response: ${responseText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error occurred while sending API request:', error);
      throw error;
    }
  }
}

// Separate base URLs for different payment methods if needed
const hostedPaymentBaseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const bnplBaseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/bnpl';
const apiKey = 'c6490381A6ab0A4b18A9960Af3a9182c40ba';
const apiClient = new ApiClient(apiKey);

let basket = [];

function updateBasketCount() {
  const cartButton = document.getElementById('cart');
  cartButton.textContent = `Basket (${basket.length})`;
}

function displayPaymentForm() {
  const paymentForm = document.getElementById('payment-form');
  paymentForm.style.display = basket.length > 0 ? 'block' : 'none';
}

async function initiatePayment(basket) {
  const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
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
  const fullUrl = `https://sandbox.apexx.global/atomic/v1/api/payment/hosted`; // Update this endpoint as necessary
  try {
    const responseData = await apiClient.sendRequest(fullUrl, 'POST', paymentData);
    // Handle successful payment initiation here
  } catch (error) {
    alert('Payment initiation failed. Please try again.');
  }
}

async function initiateSofortPayment(basket) {
  const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx SOFORT Test',
    merchant_reference: 'CT34540', // Dynamically generate a reference
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
  const fullUrl = `https://sandbox.apexx.global/atomic/v1/api/payment/hosted`; // Update this endpoint as necessary
  try {
    const responseData = await apiClient.sendRequest(fullUrl, 'POST', paymentData);
    // Handle successful payment initiation here
  } catch (error) {
    alert('SOFORT payment initiation failed. Please try again.');
  }
}

async function initiateKlarnaPayment(basket) {
  const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
  const paymentData = {
    "organisation": "ff439f6eAc78dA4667Ab05aAc89f92e27f76",
    "currency": "GBP",
    "amount": totalAmount,
    "net_amount": totalAmount,
    "capture_now": "true",
    "dynamic_descriptor": "Apexx Test",
    "merchant_reference": "ref_" + Date.now(),
    "locale": "EN",
    "customer_ip": "127.0.0.1",
    "user_agent": navigator.userAgent,
    "webhook_transaction_update": "https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358",
    "shopper_interaction": "ecommerce",
    "bnpl": {
        "payment_method": "klarna",
        "payment_type": "", // Specify payment type if necessary
        "payment_type_data":[
         {
          "key_name": "string",
          "value": "string"
      }
  ]
    },
    "redirect_urls": {
      "success":"https://sandbox.apexx.global/atomic/v1/api/return",
      "failed":"https://sandbox.apexx.global/atomic/v1/api/return",
      "cancelled":"https://sandbox.apexx.global.com/atomic/v1/api/return"
    },
    "items": basket.map(item => ({
        "product_id": item.product_id,
        "group_id": item.group_id || "default", // Provide a default or specific value
        "item_description": item.item_description,
        "net_unit_price": item.net_unit_price,
        "gross_unit_price": item.gross_unit_price || item.net_unit_price, // Assuming no VAT for simplicity
        "quantity": item.quantity,
        "vat_percent": item.vat_percent || 0,
        "vat_amount": item.vat_amount || 0,
        "discount": item.discount || 0,
        "product_image_url": item.product_image_url,
        "product_url": item.product_url,
        "additional_information": item.additional_information || "N/A",
        "delivery": item.delivery || "email"
    })),
    "customer": {
        // Replace with actual customer data or fetch dynamically
        "email": "customer@example.com",
        "phone": "07777012345",
        "date_of_birth": "1990-01-01",
        // Additional customer fields as needed
    },
    "billing_address": {
        // Replace with actual billing address data or fetch dynamically
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@example.com",
        "address": "123 Main St",
        "city": "London",
        "postal_code": "SW1A 1AA",
        "country": "GB",
        "phone": "07777012345"
    },
    "delivery_address": {
        // Optional, specify if different from billing address
    }
    };
  const fullUrl = "https://sandbox.apexx.global/atomic/v1/api/payment/bnpl"; // Use BNPL base URL for Klarna
  try {
    const responseData = await apiClient.sendRequest(fullUrl, 'POST', paymentData);
    // Handle successful payment initiation here
  } catch (error) {
    alert('Klarna payment initiation failed. Please try again.');
  }
}

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

  document.getElementById('pay-with-card').addEventListener('click', () => {
    if (basket.length > 0) {
      initiatePayment(basket);
    } else {
      alert('Please add items to your basket.');
    }
  });

  document.getElementById('pay-with-sofort').addEventListener('click', () => {
    if (basket.length > 0) {
      initiateSofortPayment(basket);
    } else {
      alert('Please add items to your basket.');
    }
  });

  document.getElementById('pay-with-klarna').addEventListener('click', () => {
    if (basket.length > 0) {
      initiateKlarnaPayment(basket);
    } else {
      alert('Please add items to your basket.');
    }
  });
});
