import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
// import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not_found/NotFoundPage";
// import { usersApi } from "./api_services/users/UsersAPIService";
import TrailsPage from "./pages/trails/TrailsPage";
import { trailApi } from "./api_services/trails/TrailAPIService";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/register" element={<RegisterPage authApi={authApi} />} />
      <Route path="/trails" element={<TrailsPage trailApi={trailApi}/>} />
      <Route path="/404" element={<NotFoundPage />} />

        {/*
          Example usage of protected route.
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <KontrolnaTablaUserStranica />
            </ProtectedRoute>
          }
        /> */}

        {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/trails" replace />} />

        {/* Catch-all ruta za nepostojeće stranice */}
        <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
