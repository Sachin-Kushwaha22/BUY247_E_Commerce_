import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RazorPay from './RazorPay';
import AdminSign from './Admin/Authentication/adminSignin';
import AdminDashboard from './Admin/landingpage'
import HomePage from './Home/homepage';
import ProtectedRoute from './Protected Routes/ProtectedRoute';
import SigninRoute from './Protected Routes/AdminSigninRoute';
import UserDashboard from './Customers/Profile';
import UserAuth from './Customers/Auth';
import UserAuthRoute from './Protected Routes/UserAuthRoute';
import Cart from './Cart/Cart';
import { CartProvider } from './Context/CartContext';
import CartPageProvider from './Protected Routes/CartPageProvider';

// Define routes properly
const router = createBrowserRouter([
  {
    path: '/', element: (
      <HomePage />

    )
  },
  { path: '/payment', element: <RazorPay /> },
  {
    path: '/admin/signin',
    element: (
      <SigninRoute>
        <AdminSign />
      </SigninRoute>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        {(adminData) => <AdminDashboard admin={adminData} />}
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/profile',
    element: (
      <UserDashboard />
    ),
  },
  {
    path: '/user/auth',
    element: (
      <UserAuthRoute>
        <UserAuth />
      </UserAuthRoute>
    ),
  },
  {
    path: '/user/cart',
    element: (
      <CartPageProvider>
        {(cart) => <Cart cart={cart} />}
      </CartPageProvider>
    ),
  },
]);

// Render the RouterProvider with the defined router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
