import paypal from '@paypal/checkout-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret);


// Environment setup: Sandbox or Live
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// Uncomment the following line for live environment
// let environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

let client = new paypal.core.PayPalHttpClient(environment);

export default client;
