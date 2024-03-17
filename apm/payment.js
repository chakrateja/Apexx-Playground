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
      body: requestData ? JSON.stringify(requestData) : null
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

document.addEventListener('DOMContentLoaded', () => {
  const paymentMethodDetails = document.getElementById('payment-method-details');

  const initiatePayment = async () => {
    const paymentData = {
      organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
      currency: 'GBP',
      amount: 5000, // Example amount in minor units e.g. pence
      capture_now: true,
      dynamic_descriptor: 'Demo Merchant Test Purchase',
      merchant_reference: `ref_${Date.now()}`,
      return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
      webhook_transaction_update: 'https://webhook.site/your-webhook-url',
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
      const responseData = await apiClient.sendRequest('', 'POST', paymentData);
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
  };

  const updatePaymentDisplay = async () => {
    const selectedOption = document.querySelector('input[name="payment-method"]:checked').value;

    if (selectedOption === 'card') {
      const paymentUrl = await initiatePayment();
      if (paymentUrl) {
        paymentMethodDetails.innerHTML = `<iframe src="${paymentUrl}" style="width:100%; height:600px; border:none;"></iframe>`;
      }
    } else if (selectedOption === 'alternative') {
      paymentMethodDetails.innerHTML = '<div>Alternative payment methods will be displayed here.</div>';
      // Add the alternative payment methods here.
    }
  };

  document.getElementById('payment-options-form').addEventListener('change', updatePaymentDisplay);

  // Initial update on page load
  updatePaymentDisplay();
});
