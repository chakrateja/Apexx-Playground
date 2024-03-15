class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async sendRequest(endpoint, method, data) {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': this.apiKey
      },
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error('Error occurred while sending API request:', error);
      throw error;
    }
  }
}

// Update these constants with the correct values
const apiKey = 'your-api-key';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);

document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('payment-form');
  const paymentIframe = document.getElementById('payment-iframe');

  document.getElementById('pay-with-card').addEventListener('click', async () => {
    // Your existing payment data logic here
    paymentForm.style.display = 'block';
    // paymentIframe.src should be set based on the response of the card payment request
  });

  document.getElementById('pay-with-sofort').addEventListener('click', async () => {
    const sofortData = {
      // Include all the SOFORT payment data required by your API
    };

    try {
      const responseData = await apiClient.sendRequest('', 'POST', sofortData);
      if (responseData && responseData.url) {
        window.location.href = responseData.url; // Redirect to SOFORT payment page
      } else {
        console.error('Failed to initiate SOFORT payment');
      }
    } catch (error) {
      console.error('Error initiating SOFORT payment:', error);
    }
  });
});
