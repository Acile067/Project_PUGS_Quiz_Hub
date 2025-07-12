import React, { useState, useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SecondaryLayout from "./layouts/SecondaryLayout";
import Spinner from "./components/Spinner";
import GuestRoute from "./components/GuestRoute";
import { checkAndCleanToken } from "./services/authService";
import PrivateRoute from "./components/PrivateRoute";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));

const createAppRoutes = () => (
  <>
    {/* Rute koje koriste MainLayout */}
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />

      <Route
        path="profile/:id"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Route>

    {/* Rute koje koriste SecondaryLayout */}
    <Route path="/" element={<SecondaryLayout />}>
      <Route
        path="register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
    </Route>
  </>
);

const router = createBrowserRouter(createRoutesFromElements(createAppRoutes()));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadRoutes = async () => {
      const routePromises = [import("./pages/HomePage")];

      await Promise.all(routePromises);
      setIsLoading(false);
    };

    checkAndCleanToken();
    preloadRoutes();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <React.Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default App;
