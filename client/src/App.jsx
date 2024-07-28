import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Register from './components/users/Register';
import Login from './components/users/Login';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import ProductForm from './components/products/ProductForm';
import EditProductForm from './components/products/EditProductForm';
import NavBar from './components/NavBar';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import ProductsEdit from './pages/ProductsEdit';

import { CartProvider } from './contexts/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" exact element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit" element={<ProductsEdit />} />
          <Route path="/products/edit/:id" element={<EditProductForm />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/" exact element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
