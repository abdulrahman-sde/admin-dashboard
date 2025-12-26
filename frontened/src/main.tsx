import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Layout from "./components/dashboard/Layout.tsx";
import Login from "./pages/auth/Login.tsx";
import Home from "./pages/dashboard/Home.tsx";
import Customers from "./pages/dashboard/customers/index.tsx";
import CustomerDetail from "./pages/dashboard/customers/detail.tsx";
import AddCustomer from "./pages/dashboard/customers/add.tsx";
import Orders from "./pages/dashboard/orders/index.tsx";
import Categories from "./pages/dashboard/categories/index.tsx";
import EditCategory from "./pages/dashboard/categories/EditCategory.tsx";
import Transactions from "./pages/dashboard/Transactions.tsx";
import Reports from "./pages/dashboard/Reports.tsx";
import AddProducts from "./pages/dashboard/AddProducts.tsx";
import Products from "./pages/dashboard/Products.tsx";
import Reviews from "./pages/dashboard/Reviews.tsx";
import Admin from "./pages/dashboard/Admin.tsx";
import PaymentMethods from "./pages/dashboard/PaymentMethods.tsx";
import { Provider } from "react-redux";
import { store } from "./lib/store/store.ts";
import { Toaster } from "sonner";
import Coupons from "./pages/dashboard/coupons/index.tsx";
import AddCoupon from "./pages/dashboard/coupons/AddCoupon.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/add", element: <AddCustomer /> },
      { path: "customers/:id", element: <CustomerDetail /> },
      { path: "orders", element: <Orders /> },
      { path: "coupons", element: <Coupons /> },
      { path: "coupons/add", element: <AddCoupon /> },
      { path: "categories", element: <Categories /> },
      { path: "categories/add", element: <EditCategory /> },
      { path: "categories/edit/:id", element: <EditCategory /> },
      { path: "transactions", element: <Transactions /> },
      { path: "reports", element: <Reports /> },
      { path: "products/add", element: <AddProducts /> },
      { path: "products/edit/:id", element: <AddProducts /> },
      { path: "products", element: <Products /> },
      { path: "reviews", element: <Reviews /> },
      { path: "payment-methods", element: <PaymentMethods /> },
      { path: "admin", element: <Admin /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
