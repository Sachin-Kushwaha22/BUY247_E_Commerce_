import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RazorPay from './RazorPay';
import AdminSign from './Admin/Authentication/adminSignin';
import AdminDashboard from './Admin/landingpage'
import HomePage from './Home/homepage';
import ProtectedRoute from './Protected Routes/ProtectedRoute';
import SigninRoute from './Protected Routes/SigninRoute';
// Define routes properly
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
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
]);

// Render the RouterProvider with the defined router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
