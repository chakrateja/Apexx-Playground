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
const paymentData = {
    organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
    currency: 'EUR',
    amount: 1000,
    capture_now: true,
    dynamic_descriptor: 'Demo Merchant Test Purchase',
    merchant_reference: 'ghjhgjhghfgf',
    return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
    webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
    transaction_type: 'first',
    duplicate_check: false,
    locale: 'en_GB',
    card: {
        create_token: true
    },
    billing_address: {
        first_name: 'FIRSTNAME',
        last_name: 'LASTNAME',
        email: 'EMAIL@DOMAIN.COM',
        address: '12',
        city: 'CITY',
        state: 'STATE',
        postal_code: '34',
        country: 'GB',
        phone: 44123456789
    },
    three_ds: {
        three_ds_required: true,
        three_ds_version: '2.0'
    }
};

let paymentInitiated = false; // Flag to track if payment has been initiated

// Function to initiate payment
const redirectToPaymentPage = () => {
    if (!paymentInitiated) {
        apiClient.sendRequest('', 'POST', paymentData)
            .then(responseData => {
                console.log('API Response Data:', responseData);
                if (responseData && responseData.url) {
                    console.log('Redirecting to:', responseData.url);
                    // Send a message to the payment iframe to initiate payment
                    const paymentFrame = document.getElementById('paymentFrame');
                    paymentFrame.contentWindow.postMessage({ type: 'initiatePayment' }, '*');
                    paymentInitiated = true; // Update flag to indicate payment initiated
                }
            })
            .catch(error => {
                console.error('Error occurred while sending API request:', error);
            });
    } else {
        // If payment already initiated, simply reload the page
        location.reload();
    }
};

// Add event listener for the message event to handle messages from the payment iframe
window.addEventListener('message', event => {
    if (event.data && event.data.type === 'redirectToPayment') {
        // Redirect to the payment URL received from the payment iframe
        window.location.href = event.data.url;
    }
});

// Add an event listener to the button to initiate payment
document.getElementById('paymentButton').addEventListener('click', redirectToPaymentPage);

// Add event listener to wait for the iframe to load before initiating payment
document.getElementById('paymentFrame').addEventListener('load', redirectToPaymentPage);
