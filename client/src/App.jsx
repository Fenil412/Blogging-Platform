import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import NotFoundPage from "./pages/NotFoundPage";




function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      
              <Routes location={location}>
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />

                  
                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
    </ThemeProvider>
  );
}

export default App;
