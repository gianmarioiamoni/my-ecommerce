// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Register from './components/users/Register';
import Login from './components/users/Login';
import EditProductForm from './components/products/EditProductForm';
import NavBar from './components/NavBar';
import ManageCategories from './components/admin/ManageCategories';
import Profile from './components/users/Profile';

import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/orders/Cart';
import Checkout from './pages/orders/Checkout';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import AddNewProduct from './pages/admin/AddNewProduct';
import ProductsEdit from './pages/admin/ProductsEdit';
import ForgotPassword from './pages/users/ForgotPassword';
import ResetPassword from './components/users/ResetPassword';
import ManageAddressesPayments from './pages/users/ManageAddressesPayments';
import OrderHistory from './pages/users/OrderHistory';
import AdminOrderConsole from './pages/admin/AdminOrderConsole';

import { CartProvider } from './contexts/CartContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/users/PrivateRoute';

const App = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <CategoriesProvider>
        <CartProvider>
          <AuthProvider>
            <Router>
              <NavBar />
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" exact element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/" exact element={<ProductList />} />
                <Route path="/success" element={<Success />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route
                  path="/products/new"
                  element={<PrivateRoute element={<AddNewProduct />} roles={['admin']} />}
                />
                <Route
                  path="/products/edit"
                  element={<PrivateRoute element={<ProductsEdit />} roles={['admin']} />}
                />
                <Route
                  path="/products/edit/:id"
                  element={<PrivateRoute element={<EditProductForm />} roles={['admin']} />}
                />
                <Route
                  path="/manage-categories"
                  element={<PrivateRoute element={<ManageCategories />} roles={['admin']} />}
                />
                <Route
                  path="/admin/orders"
                  element={<PrivateRoute element={<AdminOrderConsole />} roles={['admin']} />}
                />
                <Route
                  path="/cart"
                  element={<PrivateRoute element={<Cart />} roles={['user']} />}
                />
                <Route
                  path="/checkout"
                  element={<PrivateRoute element={<Checkout />} roles={['user']} />}
                />
                <Route
                  path="/manage-addresses-payments"
                  element={<PrivateRoute element={<ManageAddressesPayments />} roles={['user']} />}
                />
                <Route
                  path="/order-history"
                  element={<PrivateRoute element={<OrderHistory />} roles={['user']} />}
                />
                <Route
                  path="/profile"
                  element={<PrivateRoute element={<Profile />} roles={['user', 'admin']} />}
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </CartProvider>
      </CategoriesProvider>
    </ThemeProvider>
  );
};

export default App;


