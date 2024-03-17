class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async sendRequest(endpoint, method, requestData) {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': this.apiKey
      },
      body: JSON.stringify(requestData)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Response: ${responseText}`);
    }
    return await response.json();
  }
}

const apiClient = new ApiClient('https://sandbox.apexx.global/atomic/v1/api/payment/hosted', 'f742b7dcA75c6A406eAb1cbAf01be0047514');

async function initiatePayment() {
  const paymentData = {
    organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
    currency: 'GBP',
    amount: 5000, // Example amount, replace with actual amount needed
    capture_now: true,
    dynamic_descriptor: 'Demo Merchant Test Purchase',
    merchant_reference: `ref_${Date.now()}`,
    return_url: 'https://yourdomain.com/payment-return', // Replace with your actual return URL
    webhook_transaction_update: 'https://webhook.site/your-webhook-url', // Replace with your actual webhook URL
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
    const responseData = await apiClient.sendRequest('payments', 'POST', paymentData); // Adjust 'payments' if your actual endpoint is different
    if (responseData && responseData.url) {
      return responseData.url;
    } else {
      throw new Error('API did not return a URL for the payment form.');
    }
  } catch (error) {
    console.error('Payment initiation failed:', error);
    alert('Error initiating payment. Please try again.');
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const paymentMethodDetails = document.getElementById('payment-method-details');
  const paymentIframe = document.getElementById('payment-iframe');

  document.getElementById('payment-options-form').addEventListener('change', async () => {
    const selectedOption = document.querySelector('input[name="payment-method"]:checked').value;

    if (selectedOption === 'card') {
      const paymentUrl = await initiatePayment();
      if (paymentUrl) {
        paymentIframe.src = paymentUrl;
        paymentMethodDetails.style.display = 'block';
      } else {
        paymentMethodDetails.style.display = 'none';
      }
    } else if (selectedOption === 'alternative') {
      paymentMethodDetails.style.display = 'none';
      // Here, you can implement the logic to display alternative payment methods.
    }
  });

  // Trigger the change event to update the display based on the default selected payment method.
  document.getElementById('payment-options-form').dispatchEvent(new Event('change'));
});
