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
  const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
  const apiClient = new ApiClient(baseUrl, apiKey);
  let basket = []; // Initialize an empty basket
document.addEventListener('DOMContentLoaded', function() {
  // Initial setup can go here
});

// Function to handle product selection
function handleProductSelection(product) {
  document.getElementById('payment-form-container').style.display = 'block';
}

// Function to initiate payment
function initiatePayment(event) {
  event.preventDefault();
  
  // Gather payment details from form
  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;
  
  // Construct payment data object
  const paymentData = {
    cardNumber: cardNumber,
    expiryDate: expiryDate,
    cvv: cvv,
    amount: 2499 // The amount in minor units (pence)
  };

  // Log payment data for demonstration purposes
  console.log('Payment data:', paymentData);

  // Call the sendRequest method from your ApiClient
  apiClient.sendRequest('your_payment_endpoint', 'POST', paymentData)
    .then(responseData => {
      // Handle the response data, such as redirecting to a success page
      console.log('Payment successful:', responseData);
    })
    .catch(error => {
      // Handle any errors that occur during the payment process
      console.error('Payment failed:', error);
    });
}
