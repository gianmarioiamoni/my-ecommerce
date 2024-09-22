// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import it from './locales/it.json';

import Register from './components/users/Register';
import Login from './components/users/Login';
import EditProductForm from './components/products/EditProductForm';
import NavBar from './components/NavBar';
import ManageCategories from './components/admin/ManageCategories';
import Profile from './components/users/Profile';

import HomePage from './pages/Home';
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
import WishlistPage from './pages/wishList/WishListPage';
import SalesReportsPage from './pages/statistics/SalesReportsPage';
import UserBehaviorDashboard from './pages/events/UserBehaviorDashboard';

import { CartProvider } from './contexts/CartContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/users/PrivateRoute';

import { WishlistProvider } from './contexts/WishListContext';


// i18next initialization
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
  },
  lng: 'en', // default language 
  fallbackLng: 'en', // fallback language
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default to prevent xss attack
  },
});

/**
 * The main App component.
 * This component renders the entire application, including the navigation bar,
 * the routes, and the contexts.
 * @returns {JSX.Element} The App component.
 */
const App = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <CategoriesProvider>
        <CartProvider>
          <AuthProvider>
            <WishlistProvider>
              <Router>
                <NavBar />
                <Routes>
                  <Route path="/register" element={<Register />} />
                  {/* The Register component renders the registration form */}
                  <Route path="/login" element={<Login />} />
                  {/* The Login component renders the login form */}
                  <Route path="/products" exact element={<ProductList />} />
                  {/* The ProductList component renders the list of products */}
                  <Route path="/products/:id" element={<ProductDetails />} />
                  {/* The ProductDetails component renders the details of a product */}
                  <Route path="/" exact element={<HomePage />} />
                  {/* The HomePage component renders the homepage */}
                  <Route path="/success" element={<Success />} />
                  {/* The Success component renders the success message */}
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  {/* The ForgotPassword component renders the forgot password form */}
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  {/* The ResetPassword component renders the reset password form */}

                  {/* Admin routes */}
                  <Route
                    path="/products/new"
                    element={<PrivateRoute element={<AddNewProduct />} roles={['admin']} />}
                  />
                  {/* The AddNewProduct component renders the form to add a new product */}
                  <Route
                    path="/products/edit"
                    element={<PrivateRoute element={<ProductsEdit />} roles={['admin']} />}
                  />
                  {/* The ProductsEdit component renders the form to edit a product */}
                  <Route
                    path="/products/edit/:id"
                    element={<PrivateRoute element={<EditProductForm />} roles={['admin']} />}
                  />
                  {/* The EditProductForm component renders the form to edit a product */}
                  <Route
                    path="/manage-categories"
                    element={<PrivateRoute element={<ManageCategories />} roles={['admin']} />}
                  />
                  {/* The ManageCategories component renders the form to manage categories */}
                  <Route
                    path="/admin/orders"
                    element={<PrivateRoute element={<AdminOrderConsole />} roles={['admin']} />}
                  />
                  {/* The AdminOrderConsole component renders the console for managing orders */}
                  <Route
                    path="/sales-reports"
                    element={<PrivateRoute element={<SalesReportsPage />} roles={['admin']} />}
                  />
                  {/* The SalesReportsPage component renders the page for sales reports */}
                  <Route
                    path="/user-behavior-dashboard"
                    element={<PrivateRoute element={<UserBehaviorDashboard />} roles={['admin']} />}
                  />
                  {/* The UserBehaviorDashboard component renders the dashboard for user behavior */}
                  <Route
                    path="/cart"
                    element={<PrivateRoute element={<Cart />} roles={['user']} />}
                  />
                  {/* The Cart component renders the cart */}
                  <Route
                    path="/checkout"
                    element={<PrivateRoute element={<Checkout />} roles={['user']} />}
                  />
                  {/* The Checkout component renders the checkout form */}
                  <Route
                    path="/manage-addresses-payments"
                    element={<PrivateRoute element={<ManageAddressesPayments />} roles={['user']} />}
                  />
                  {/* The ManageAddressesPayments component renders the form to manage addresses and payments */}
                  <Route
                    path="/order-history"
                    element={<PrivateRoute element={<OrderHistory />} roles={['user']} />}
                  />
                  {/* The OrderHistory component renders the order history */}
                  <Route
                    path="/wishlists"
                    element={<PrivateRoute element={<WishlistPage />} roles={['user']} />}
                  />
                  {/* The WishlistPage component renders the wishlist */}
                  <Route
                    path="/profile"
                    element={<PrivateRoute element={<Profile />} roles={['user', 'admin']} />}
                  />
                  {/* The Profile component renders the profile page */}
                  <Route path="*" element={<NotFound />} />
                  {/* The NotFound component renders the not found page */}
                </Routes>
              </Router>
            </WishlistProvider>
          </AuthProvider>
        </CartProvider>
      </CategoriesProvider>
    </ThemeProvider>
  );
};

export default App;


