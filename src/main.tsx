// src/main.tsx
// Entry point

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './theme';
import "./index.css";

import Layout from './components/Layout';
import ErrorPage from "./errorPage";
import PrivateRoutes from "./components/PrivateRoutes";
import Login from "./routes/Login";
import Work from "./routes/Work"
import Admin from "./routes/Admin"
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
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/tokens',
    element: <TokenExchange />,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/work",
            element: <Work />,
            errorElement: <ErrorPage />,
          },
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  //<React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  //</React.StrictMode>
);