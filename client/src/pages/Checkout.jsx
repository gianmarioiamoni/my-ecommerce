import React, { useState, useContext } from 'react';
import ShippingForm from '../components/ShippingForm';
import PaymentMethod from '../components/PaymentMethod';
import ReviewOrder from '../components/ReviewOrder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const { cart, clearCart } = useContext(CartContext);

    const nextStep = (data) => {
        if (step === 1) {
            setShippingData(data);
        } else if (step === 2) {
            setPaymentMethod(data);
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };


    const handlePaymentSuccess = async (details) => {
        try {
            const orderData = {
                shippingData,
                paymentMethod,
                cartItems: cart,
                totalAmount: getTotal(),
                paymentDetails: details
            };
            // Make a request to capture the order
            const captureResponse = await axios.post(`${serverURL}/orders/capture`, { orderID: details.id });
            if (captureResponse.data.status === 'COMPLETED') {
                // Place the order
                await axios.post(`${serverURL}/orders/capture`, orderData);
                clearCart();
                navigate('/success');
            } else {
                throw new Error('Payment was not completed.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const getTotal = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    return (
        <div>
            {step === 1 && <ShippingForm nextStep={nextStep} />}
            {step === 2 && (
                <PaymentMethod
                    nextStep={nextStep}
                    prevStep={prevStep}
                    getTotal={getTotal}
                    handlePaymentSuccess={handlePaymentSuccess}
                />
            )}
            {step === 3 && (
                <ReviewOrder
                    shippingData={shippingData}
                    paymentMethod={paymentMethod}
                    prevStep={prevStep}
                    placeOrder={handlePaymentSuccess}
                />
            )}
            {step === 3 && paymentMethod === 'PayPal' && (
                <div id="paypal-button-container"></div>
            )}
        </div>
    );
};

export default Checkout;
