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
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}

const apiKey = '473be873A0912A4eedAb26cA2edf67bb4faa';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.paymentButton').forEach(button => {
    button.addEventListener('click', async function() {
      const productName = this.dataset.name; // Using dataset for data attributes
      const amount = this.dataset.amount; // Using dataset for data attributes
      try {
        const responseData = await initiatePayment(amount, productName);
        if (responseData && responseData.url) {
          console.log('Redirecting to:', responseData.url);
          window.location.href = responseData.url;
        } else {
          console.error('No payment URL received in the response data.');
        }
      } catch (error) {
        console.error('Error occurred while initiating payment:', error);
      }
    });
  });
});

const initiatePayment = async (amount, productName) => {
  const paymentData = {
    // ... other paymentData properties
    dynamic_descriptor: `Purchase of ${productName}`,
    merchant_reference: `ref_${Date.now()}`,
    amount: amount,
    // ... other paymentData properties
  };

  return apiClient.sendRequest('', 'POST', paymentData);
};
