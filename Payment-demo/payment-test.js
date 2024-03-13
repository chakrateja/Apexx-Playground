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

const apiKey = 'f742b7dcA75c6A406eAb1cbAf01be0047514';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                name: this.getAttribute('data-name'),
                amount: this.getAttribute('data-amount')
            };
            initiatePayment([product]); // Initiate payment with the selected product
        });
    });
});

const initiatePayment = (basket) => {
    const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
    const paymentData = {
        organisation: '4d1a4e9dAaff5A4b7aAa200A21d072d2e4ca',
        currency: 'GBP',
        amount: totalAmount,
        capture_now: true,
        dynamic_descriptor: 'Demo Merchant Test Purchase',
        merchant_reference: 'ref_' + Date.now(),
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

    apiClient.sendRequest('', 'POST', paymentData)
        .then(responseData => {
            if (responseData && responseData.url) {
                const paymentIframe = document.getElementById('payment-iframe');
                if (paymentIframe) {
                    paymentIframe.src = responseData.url;
                    paymentIframe.style.display = 'block';
                } else {
                    console.error('Payment iframe not found');
                }
            } else {
                alert('Failed to initiate payment');
            }
        })
        .catch(error => {
            console.error('Payment initiation failed:', error);
            alert('Error initiating payment. Please try again.');
        });
});
