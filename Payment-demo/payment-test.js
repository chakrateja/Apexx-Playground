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
      
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Details: ${JSON.stringify(responseData)}`);
        }
        return responseData;
      } else {
        // Response is not JSON
        const responseText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}, Response not JSON: ${responseText}`);
      }
    } catch (error) {
      throw new Error(`Error occurred while sending API request: ${error.message}`);
    }
  }
}
const apiKey = 'c6490381A6ab0A4b18A9960Af3a9182c40ba';
const baseUrl = 'https://sandbox.apexx.global/atomic/v1/api/payment/hosted';
const apiClient = new ApiClient(baseUrl, apiKey);
let paymentInitiated = false;
const updateBasketCount = (basket) => {
  const cartButton = document.getElementById('cart');
  cartButton.textContent = `Basket (${basket.length})`;
};
const displayPaymentForm = () => {
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.style.display = 'block';
  } else {
    console.error('Payment form not found');
  }
};
const initiatePayment = (basket) => {
  if (!paymentInitiated) {
      const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
      const paymentData = {
        organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
        currency: 'GBP',
        amount: totalAmount, // Use the calculated total amount
        capture_now: true,
        dynamic_descriptor: 'Demo Merchant Test Purchase',
        merchant_reference: 'ref_' + Date.now(), // Dynamically generate a reference
        return_url: 'https://sandbox.apexx.global/atomic/v1/api/return',
        webhook_transaction_update: 'https://webhook.site/63250144-1263-4a3e-a073-1707374c5296',
        transaction_type: 'first',
        duplicate_check: false,
        locale: 'en_GB',
        card: {
          create_token: true
        },
        billing_address: {
          first_name: 'John', // Placeholder for real customer data
          last_name: 'Doe', // Placeholder for real customer data
          email: 'john.doe@example.com', // Placeholder for real customer data
          address: '123 Main Street', // Placeholder for real customer data
          city: 'London', // Placeholder for real customer data
          state: 'London', // Placeholder for real customer data
          postal_code: 'SW1A 1AA', // Placeholder for real customer data
          country: 'GB', // Placeholder for real customer data
          phone: '441234567890' // Placeholder for real customer data
        },
        three_ds: {
          three_ds_required: true,
          three_ds_version: '2.0'
        }
      };
   apiClient.sendRequest('', 'POST', paymentData)
        .then(responseData => {
          if (responseData && responseData.url) {
            // Load the payment URL into the iframe and display it
            const paymentIframe = document.getElementById('payment-iframe');
            if (paymentIframe) {
              paymentIframe.src = responseData.url;
              paymentIframe.style.display = 'block';
            } else {
              console.error('Payment iframe not found');
            }
            paymentInitiated = true;
          } else {
            alert('Failed to initiate payment');
          }
        })
        .catch(error => {
          console.error('Payment initiation failed:', error);
          alert('Error initiating payment. Please try again.');
        });
    } else {
      console.log('Payment has already been initiated.');
    }
  };
const initiateSofortPayment = (basket) => {
  const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
  const paymentData = {
    organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx SOFORT Test',
    merchant_reference: 'CT34540', // Dynamically generate a reference
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

  apiClient.sendRequest('', 'POST', paymentData)
    .then(responseData => {
      if (responseData && responseData.url) {
        // Redirect the customer to the SOFORT payment URL
        window.open(responseData.url, '_blank');
      } else {
        alert('Failed to initiate SOFORT payment');
      }
    })
    .catch(error => {
      console.error('SOFORT payment initiation failed:', error);
      alert('Error initiating SOFORT payment. Please try again.');
    });
};
const initiateBancontactPayment = (basket) => {
 
const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
const paymentData = {
organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx SOFORT Test',
    merchant_reference: 'CT34540', // Dynamically generate a reference
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    bancontact: {
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

apiClient.sendRequest('', 'POST', paymentData)
.then(responseData => {
if (responseData && responseData.url) {
// Redirect the customer to the Bancontact payment URL
window.location.href = responseData.url;
} else {
alert('Failed to initiate Bancontact payment');
}
})
.catch(error => {
console.error('Bancontact payment initiation failed:', error);
alert('Error initiating Bancontact payment. Please try again.');
});
};
const initiateBancontactPayment = (basket) => {
 
const totalAmount = basket.reduce((total, item) => total + parseInt(item.amount), 0);
const paymentData = {
organisation: 'ff439f6eAc78dA4667Ab05aAc89f92e27f76',
    capture_now: 'true',
    customer_ip: '10.20.0.186',
    recurring_type: 'first',
    amount: totalAmount.toString(), // This should be dynamic based on the basket contents
    currency: 'EUR',
    user_agent: 'string',
    locale: 'en',
    dynamic_descriptor: 'Apexx ideal Test',
    merchant_reference: 'CT34540', // Dynamically generate a reference
    webhook_transaction_update: 'https://webhook.site/db694c36-9e0b-4c45-bbd8-596ea98fe358',
    shopper_interaction: 'ecommerce',
    ideal: {
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

apiClient.sendRequest('', 'POST', paymentData)
.then(responseData => {
if (responseData && responseData.url) {
// Redirect the customer to the Bancontact payment URL
window.location.href = responseData.url;
} else {
alert('Failed to initiate ideal payment');
}
})
.catch(error => {
console.error('ideal payment initiation failed:', error);
alert('Error initiating ideal payment. Please try again.');
});
};
document.addEventListener('DOMContentLoaded', () => {
 const basket = [];

  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        name: this.getAttribute('data-name'),
        amount: this.getAttribute('data-amount')
      };
      basket.push(product);
      updateBasketCount(basket);
    });
  });
  const payWithBancontactButton = document.getElementById('pay-with-bancontact');
if (payWithBancontactButton) {
payWithBancontactButton.addEventListener('click', () => {
if (basket.length > 0) {
initiateBancontactPayment(basket);
} else {
alert('Please add items to your basket before using Bancontact.');
}
});
} else {
console.error('Pay with Bancontact button not found');
}
    const payWithidealButton = document.getElementById('pay-with-ideal');
if (payWithidealButton) {
payWithidealButton.addEventListener('click', () => {
if (basket.length > 0) {
initiateidealPayment(basket);
} else {
alert('Please add items to your basket before using ideal.');
}
});
} else {
console.error('Pay with ideal button not found');
}
   const payWithSofortButton = document.getElementById('pay-with-sofort');
  if (payWithSofortButton) {
    payWithSofortButton.addEventListener('click', () => {
      if (basket.length > 0) {
        initiateSofortPayment(basket);
      } else {
        alert('Please add items to your basket before using SOFORT.');
      }
    });
  } else {
    console.error('Pay with SOFORT button not found');
  }
 const payWithCardButton = document.getElementById('pay-with-card');
  if (payWithCardButton) {
    payWithCardButton.addEventListener('click', () => {
      if (basket.length > 0) {
        displayPaymentForm();
        initiatePayment(basket);
      } else {
        alert('Please add items to your basket before payment.');
      }
    });
  } else {
    console.error('Pay with Card button not found');
  }
  const cartButton = document.getElementById('cart');
  cartButton.addEventListener('click', () => {
    if (basket.length > 0) {
     displayPaymentForm();
      initiatePayment(basket);
   } else {
     alert('Your basket is empty.');
    }
  });
});
