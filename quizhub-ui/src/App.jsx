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
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const UserDashboardPage = React.lazy(() => import("./pages/UserDashboardPage"));
const AdminQuizPage = React.lazy(() => import("./pages/AdminQuizPage"));
const AddQuestionPage = React.lazy(() => import("./pages/AddQuestionPage"));
const EditQuizPage = React.lazy(() => import("./pages/EditQuizPage"));
const EditQuizForm = React.lazy(() => import("./components/EditQuizForm"));

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
      <Route
        path="quiz/add-question/:quizId"
        element={
          <AdminRoute>
            <AddQuestionPage />
          </AdminRoute>
        }
      />
      <Route
        path="quiz/edit/:quizId"
        element={
          <AdminRoute>
            <EditQuizPage />
          </AdminRoute>
        }
      />
      <Route
        path="quiz/edit-form/:quizId"
        element={
          <AdminRoute>
            <EditQuizForm />
          </AdminRoute>
        }
      />
      <Route
        path="quiz/admin"
        element={
          <AdminRoute>
            <AdminQuizPage />
          </AdminRoute>
        }
      />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="user"
        element={
          <UserRoute>
            <UserDashboardPage />
          </UserRoute>
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
