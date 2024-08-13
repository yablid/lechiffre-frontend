// src/main.tsx
// Entry point

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./errorPage";
import "./index.css";
import Login from "./routes/Login";
import Work from "./routes/Work"
import Admin from "./routes/Admin"
import TokenExchange from "./components/auth/TokenExchange";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoutes from "./components/PrivateRoutes";
import Landing from "./routes/Landing";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './theme';

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
        path: "/work",
        element: <Work />,
        errorElement: <ErrorPage />,
      },
    ]
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);