import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './theme';
import "./index.css";

import Layout from './components/Layout';
import ErrorPage from "./errorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./routes/Login";
import Work from "./routes/Work";
import NewProject from "./routes/NewProject";
import Admin from "./routes/Admin";
import Landing from "./routes/Landing";
import TokenExchange from "./components/auth/TokenExchange";

import { AuthProvider } from "./context/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "work",
        element: (
          <ProtectedRoute requiredRole={50}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <Work />
          },
          {
            path: "new-project", // Renders Work inside the Layout
            element: <NewProject />,
          }
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole={10}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <Admin />,
          },
        ],
      },
    ],
  },
  
  // Standalone routes (e.g., login, tokens) without Layout
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/tokens",
    element: <TokenExchange />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);
