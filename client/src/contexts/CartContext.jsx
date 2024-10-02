import React, { createContext, useReducer, useEffect } from 'react';

import { trackEvent } from '../services/eventsServices';


const CartContext = createContext();

/**
 * The reducer for the cart state. Handles the following actions:
 * - ADD_TO_CART
 * - REMOVE_FROM_CART
 * - UPDATE_QUANTITY
 * - CLEAR_CART
 *
 * @param {Object} state - The current state of the cart
 * @param {Object} action - The action to be handled
 * @returns {Object} - The new state of the cart
 */
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            // If the product is already in the cart, increase its quantity
            // Otherwise add it to the cart with a quantity of 1
            const existingProduct = state.cart.find(item => item._id === action.product._id);
            if (existingProduct) {
                // track event
                trackEvent('add_to_cart_existing', action.product._id, action.user.id);
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item._id === action.product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            } else {
                // track event
                trackEvent('add_to_cart_new', action.product._id, action.user.id);
                return {
                    ...state,
                    cart: [...state.cart, { ...action.product, quantity: 1, maxQuantityError: false }]
                };
            }
        case 'REMOVE_FROM_CART':
            // track event
            trackEvent('remove_from_cart', action.productId, action.user.id);
            return {
                ...state,
                cart: state.cart.filter(product => product._id !== action.productId)
            };
        case 'UPDATE_QUANTITY':
            // track event
            trackEvent('update_quantity', action.id, action.quantity, action.user.id);
            return {
                ...state,
                cart: state.cart.map(item =>
                    item._id === action.id
                        ? { ...item, quantity: action.quantity }
                        : item
                )
            };
        case 'CLEAR_CART':
            return {
                cart: [],
                hasErrors: false
            };
        default:
            return state;
    }
};

const CartProvider = ({ children }) => {
    const initialState = {
        cart: [],
        hasErrors: false
    };

    const [state, dispatch] = useReducer(cartReducer, initialState, () => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? { ...initialState, cart: JSON.parse(localData) } : initialState;
        } catch (error) {
            console.error('Failed to parse cart data:', error);
            return initialState;
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    const addToCart = (product, user) => {
        dispatch({ type: 'ADD_TO_CART', product, user });
    };

    const removeFromCart = (productId, user) => {
        dispatch({ type: 'REMOVE_FROM_CART', productId, user });
    };

    const updateQuantity = (id, quantity, user) => {
        dispatch({ type: 'UPDATE_QUANTITY', id, quantity, user });
    };

    const checkQuantities = () => {
        const updatedCart = state.cart.map(item => {
            const isExceeding = item.quantity > item.availableQuantity;
            return {
                ...item,
                maxQuantityError: isExceeding,
            };
        });
        const hasErrors = updatedCart.some(item => item.maxQuantityError);
    
        return new Promise((resolve) => {
            resolve(hasErrors);
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getTotal = () => {
        return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart: state.cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotal,
            checkQuantities,
            hasErrors: state.hasErrors
        }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartContext, CartProvider };




    

