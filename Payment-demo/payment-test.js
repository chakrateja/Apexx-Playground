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

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Details: ${JSON.stringify(responseData)}`);
        }
        return responseData;
      } else {
        const responseText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Response not JSON: ${responseText}`);
      }
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}

const apiClient = new ApiClient('https://sandbox.apexx.global/atomic/v1/api/payment/hosted', 'f742b7dcA75c6A406eAb1cbAf01be0047514');

document.addEventListener('DOMContentLoaded', () => {
  const initiatePayment = async () => {
    // Assuming basket has predefined items or total amount for demo purposes
    const paymentData = {
      organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
      currency: 'GBP',
      amount: 1000, // Assuming a demo amount
      capture_now: true,
      dynamic_descriptor: 'Demo Merchant Test Purchase',
      merchant_reference: 'ref_' + Date.now(),
      return_url: 'https://sandbox.apexx.global/atomic/v1/api/return', // Update with your return URL
      webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358', // Update with your webhook URL
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
      const responseData = await apiClient.sendRequest('payments', 'POST', paymentData); // Adjust if your actual endpoint is different
      if (responseData && responseData.url) {
        const paymentIframe = document.getElementById('payment-iframe');
        paymentIframe.src = responseData.url;
        document.getElementById('payment-form').style.display = 'block';
      } else {
        alert('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Error initiating payment. Please try again.');
    }
  };

  const paymentOptionsForm = document.getElementById('payment-options-form');
  paymentOptionsForm.addEventListener('change', async () => {
    const selectedOption = document.querySelector('input[name="payment-method"]:checked').value;
    if (selectedOption === 'card') {
      await initiatePayment();
    } else {
      // Logic for alternative payment methods
      console.log('Alternative payment method selected');
    }
  });

  // Manually trigger the change event to ensure the default state is processed
  paymentOptionsForm.dispatchEvent(new Event('change'));
});

