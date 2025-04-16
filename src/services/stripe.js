import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Qmz3MBXUz9a54yiNcPtLFv2Rvat7vQL2aP0zHkI9mNldkYYCF9vC3gcJMiAJFEiY5sw8ek99Y5AUQZ2EcQ4Zuv300soi3TtaE');

export const initiateCheckout = async (orderData) => {
  try {
    const stripe = await stripePromise;
    
    // Create a checkout session on the backend
    const response = await fetch('http://localhost:5000/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    throw new Error('Payment failed: ' + error.message);
  }
};