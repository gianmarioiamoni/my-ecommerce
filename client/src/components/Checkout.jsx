import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import PaymentMethod from './PaymentMethod';
import ReviewOrder from './ReviewOrder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();

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

    const placeOrder = async () => {
        try {
            const orderData = {
                shippingData,
                paymentMethod,
                // Include the cart items and total amount from context or local state
            };
            await axios.post('http://localhost:5000/orders', orderData);
            // Navigate to a success page or display a success message
            navigate('/success');
        } catch (error) {
            console.error('Error placing order:', error);
        }
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
                    placeOrder={placeOrder}
                />
            )}
        </div>
    );
};

export default Checkout;
