class ApiClient {
  async sendRequest(baseUrl, apiKey, endpoint, method, requestData) {
    const fullUrl = `${baseUrl}/${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': apiKey
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

const apiClient = new ApiClient();

const paymentConfig = {
  card: {
    baseUrl: 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted',
    apiKey: 'c6490381A6ab0A4b18A9960Af3a9182c40ba'
  },
  sofort: {
    baseUrl: 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted',
    apiKey: 'c6490381A6ab0A4b18A9960Af3a9182c40ba'
  },
  klarna: {
    baseUrl: 'https://sandbox.apexx.global/atomic/v1/api/payment/bnpl',
    apiKey: 'c6490381A6ab0A4b18A9960Af3a9182c40ba'
  }
};

let basket = [];

function updateBasketCount() {
  const cartButton = document.getElementById('cart');
  cartButton.textContent = `Basket (${basket.length})`;
}

function displayPaymentForm() {
  const paymentForm = document.getElementById('payment-form');
  paymentForm.style.display = basket.length > 0 ? 'block' : 'none';
}

async function initiatePayment(paymentType) {
  if (basket.length === 0) {
    alert('Please add items to your basket.');
    return;
  }

  const config = paymentConfig[paymentType];
  if (!config) {
    console.error('Unsupported payment type:', paymentType);
    return;
  }

  const totalAmount = basket.reduce((total, item) => total + item.amount, 0);

  let paymentData = {
    organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
    currency: 'GBP',
    amount: totalAmount,
    capture_now: true,
    dynamic_descriptor: 'Demo Merchant Test Purchase',
    merchant_reference: `ref_${Date.now()}`,
    return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
    webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
    transaction_type: 'first',
    duplicate_check: false,
    locale: 'en_GB',
    card: paymentType === 'card' ? { create_token: true } : undefined,
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
    three_ds: paymentType === 'card' ? { three_ds_required: true, three_ds_version: '2.0' } : undefined
  };

  // Adjust the paymentData based on the paymentType if necessary for SOFORT or Klarna
  if (paymentType === 'sofort') {
    paymentData.currency = 'EUR'; // SOFORT uses EUR
    paymentData.sofort = {
        account_holder_name: 'Test Name',
        redirection_parameters: {
            return_url: 'https://sandbox.apexx.global/atomic/v1/api/return'
        }
    };
    paymentData.customer = {
        first_name: 'AP',
        last_name: 'Test',
        email: 'test@test.com',
        phone: '01234567890',
        date_of_birth: '1994-08-11',
        address: {
            country: 'DE'
        }
    };
    paymentData.delivery_customer = {
        first_name: 'Ppro',
        last_name: 'Test',
        address: {
            address: 'Add 1',
            city: 'City',
            state: 'CA',
            postal_code: '90002',
            country: 'DE'
        }
    };
} else if (paymentType === 'klarna') {
    paymentData.currency = "GBP";
    paymentData.amount = totalAmount;
    paymentData.net_amount = totalAmount;
    paymentData.capture_now = "true";
    paymentData.dynamic_descriptor = "Apexx Test";
    paymentData.merchant_reference = `ref_${Date.now()}`;
    paymentData.locale = "EN";
    paymentData.customer_ip = "127.0.0.1";
    paymentData.user_agent = navigator.userAgent;
    paymentData.webhook_transaction_update = "https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358";
    paymentData.shopper_interaction = "ecommerce";
    paymentData.bnpl = {
        payment_method: "klarna",
        payment_type: "",
        payment_type_data:[
            {
                key_name: "string",
                value: "string"
            }
        ]
    };
    paymentData.redirect_urls = {
        success:"https://sandbox.apexx.global/atomic/v1/api/return",
        failed:"https://sandbox.apexx.global/atomic/v1/api/return",
        cancelled:"https://sandbox.apexx.global.com/atomic/v1/api/return"
    };
    paymentData.items = basket.map(item => ({
        product_id: item.product_id || "defaultID",
        group_id: item.group_id || "defaultGroup",
        item_description: item.name,
        net_unit_price: item.amount,
        gross_unit_price: item.amount, // Assuming no VAT for simplicity, adjust if necessary
        quantity: 1, // Assuming 1 item per product added, adjust if necessary
        vat_percent: 20, // Example VAT rate, adjust if necessary
        product_image_url: item.product_image_url || "https://example.com/default-image.jpg",
        product_url: item.product_url || "https://example.com/default-product",
        additional_information: item.additional_information || "No additional information",
        delivery: "email" // Example delivery method, adjust if necessary
    }));
    paymentData.customer = {
        // Replace with actual customer data or fetch dynamically
        email: "customer@example.com",
        phone: "07777012345",
        date_of_birth: "1990-01-01",
        // Additional customer fields as needed
    };
    paymentData.billing_address = {
        // Replace with actual billing address data or fetch dynamically
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
        address: "123 Main St",
        city: "London",
        postal_code: "SW1A 1AA",
        country: "GB",
        phone: "07777012345"
    };
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
    };
}

  try {
    const responseData = await apiClient.sendRequest(config.baseUrl, config.apiKey, '', 'POST', paymentData);
    console.log(`${paymentType} payment initiated successfully`, responseData);
    displayPaymentForm(); // Or handle the response appropriately for SOFORT and Klarna
  } catch (error) {
    console.error(`${paymentType} payment initiation failed:`, error);
    alert(`Error initiating ${paymentType} payment. Please try again.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-name'),
        amount: parseInt(this.getAttribute('data-amount')),
      };
      basket.push(product);
      updateBasketCount();
    });
  });

  document.getElementById('pay-with-card').addEventListener('click', () => initiatePayment('card'));
  document.getElementById('pay-with-sofort').addEventListener('click', () => initiatePayment('sofort'));
  document.getElementById('pay-with-klarna').addEventListener('click', () => initiatePayment('klarna'));
});
