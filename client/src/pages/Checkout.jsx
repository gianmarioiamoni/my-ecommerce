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

            console.log("handlePaymentSuccess - orderData", orderData);
            const response = await axios.post(`${serverURL}/orders`, orderData);
            console.log("handlePaymentSuccess - response", response);
            if (response.data.status === 'success') {
                console.log("handlePaymentSuccess - response.data", response.data);
            }
            clearCart();
            navigate('/success');
        } catch (error) {
            console.error('Error placing order:', error);
            if (error.response && error.response.data.message === 'Order already captured') {
                alert('This order has already been captured.');
            } else {
                alert('An error occurred while placing the order. Please try again.');
            }
        }
    };

    const getTotal = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    return (
        <div>
            {step === 1 && <ShippingForm nextStep={nextStep} />}
            {step === 2 && <PaymentMethod nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && (
                <ReviewOrder
                    shippingData={shippingData}
                    paymentMethod={paymentMethod}
                    prevStep={prevStep}
                    placeOrder={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default Checkout;

