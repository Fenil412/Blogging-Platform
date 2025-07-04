import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import NotFoundPage from "./pages/NotFoundPage";
import BlogEditor from "./pages/BlogEditor";
import Layout from "./Layout.jsx";

// Protecting routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";

import { BlogProvider } from "./contexts/BlogContext";
import { DashboardProvider } from "./contexts/DashboardContext";

// Dashboard Layout Pages
import Settings from "./pages/Settings/Settings";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <DashboardProvider>
              <Dashboard />
              </DashboardProvider>
              </BlogProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/new"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <BlogEditor />
              </BlogProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/edit/:blogId"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <BlogEditor />
              </BlogProvider>
            </ProtectedRoute>
          }
        />
        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>
      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
