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
    organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
    currency: 'GBP',
    amount: totalAmount,
    capture_now: true,
    dynamic_descriptor: 'Demo Merchant Test Purchase',
    merchant_reference: 'ref_' + Date.now(),
    return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
    webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
    transaction_type: 'first',
    duplicate_check: false,
    locale: 'en_GB',
    card: {
      create_token: true
    },
    billing_address: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main Street',
      city: 'London',
      state: 'London',
      postal_code: 'SW1A 1AA',
      country: 'GB',
      phone: '441234567890'
    },
    three_ds: {
      three_ds_required: true,
      three_ds_version: '2.0'
    }
  };

  try {
    const responseData = await apiClient.sendRequest(hostedPaymentBaseUrl, 'POST', paymentData);
    // Handle successful payment initiation here
    displayPaymentForm();
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
    amount: totalAmount.toString(),
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
    const responseData = await apiClient.sendRequest(hostedPaymentBaseUrl, 'POST', paymentData);
    // Handle successful SOFORT payment initiation here
  } catch (error) {
    alert('SOFORT payment initiation failed. Please try again.');
  }
}

async function initiateKlarnaPayment(basket) {
  const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
  const paymentData = {
    organisation: "ff439f6eAc78dA4667Ab05aAc89f92e27f76",
    currency: "GBP",
    amount: totalAmount,
    net_amount: totalAmount,
    capture_now: "true",
    dynamic_descriptor: "Apexx Test",
    merchant_reference: "ref_" + Date.now(),
    locale: "EN",
    customer_ip: "127.0.0.1",
    user_agent: navigator.userAgent,
    webhook_transaction_update: "https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358",
    shopper_interaction: "ecommerce",
    bnpl: {
        payment_method: "klarna",
        payment_type: "",
        payment_type_data:[
         {
          key_name: "string",
          value: "string"
         }
        ]
    },
    redirect_urls: {
      success:"https://sandbox.apexx.global/atomic/v1/api/return",
      failed:"https://sandbox.apexx.global/atomic/v1/api/return",
      cancelled:"https://sandbox.apexx.global.com/atomic/v1/api/return"
    },
    items: basket.map(item => ({
        product_id: item.product_id,
        group_id: item.group_id || "default",
        item_description: item.item_description,
        net_unit_price: item.net_unit_price,
        gross_unit_price: item.gross_unit_price || item.net_unit_price,
        quantity: item.quantity,
        vat_percent: item.vat_percent || 0,
        vat_amount: item.vat_amount || 0,
        discount: item.discount || 0,
        product_image_url: item.product_image_url,
        product_url: item.product_url,
        additional_information: item.additional_information || "N
A",
        delivery: item.delivery || "email"
    })),
    customer: {
        email: "customer@example.com",
        phone: "07777012345",
        date_of_birth: "1990-01-01",
    },
    billing_address: {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
        address: "123 Main St",
        city: "London",
        postal_code: "SW1A 1AA",
        country: "GB",
        phone: "07777012345"
    },
    delivery_address: {
        first_name: 'Klarna',
        last_name: 'Test',
        address: 'Add 1',
        city: 'City',
        state: 'Yorkshire',
        postal_code: 'BD1 3LY',
        country: 'GB',
        type: 'company', // Adjusted: Added missing comma and corrected structure
        method: 'delivery' // Adjusted: Added missing comma
    }
  };

  try {
    const responseData = await apiClient.sendRequest(bnplBaseUrl, 'POST', paymentData);
    // Handle successful Klarna payment initiation here
    console.log('Klarna payment initiated successfully', responseData);
  } catch (error) {
    console.error('Klarna payment initiation failed:', error);
    alert('Klarna payment initiation failed. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-name'),
        amount: this.getAttribute('data-amount'),
        product_id: "Product123", // Example ID, adjust as necessary
        group_id: "Group456", // Example group, adjust as necessary
        item_description: "A great product", // Adjust as necessary
        net_unit_price: parseInt(this.getAttribute('data-amount')), // Example, adjust as necessary
        quantity: 1, // Example quantity
        vat_percent: 20, // Example VAT
        product_image_url: "https://example.com/product.jpg", // Example URL, adjust as necessary
        product_url: "https://example.com", // Example URL, adjust as necessary
        additional_information: "Additional info", // Adjust as necessary
        delivery: "email" // Adjust as necessary
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
      alert('Please add items to your basket before using SOFORT.');
    }
  });

  document.getElementById('pay-with-klarna').addEventListener('click', () => {
    if (basket.length > 0) {
      initiateKlarnaPayment(basket);
    } else {
      alert('Please add items to your basket before using Klarna.');
    }
  });
});
