import { Routes,Route,Navigate } from "react-router-dom";

//apis
import { authApi } from "./api_services/auth/AuthAPIService";
import { trailApi } from "./api_services/trails/TrailAPIService";
import { myTrailApi } from "./api_services/my_trails/MyTrailAPIService";
import { ascentApi } from "./api_services/ascents/AscentAPIService";
import { hikeApi } from "./api_services/hikes/HikeAPIService";
import { auditLogApi } from "./api_services/audit_logs/AuditLogAPIService";
import { mountainApi } from "./api_services/mountains/MountainAPIService";
import { terrainTagApi } from "./api_services/terrain_tags/TerrainTagAPIService";
import { usersApi } from "./api_services/users/UsersAPIService";

//pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not_found/NotFoundPage";
import TrailsPage from "./pages/trails/TrailsPage";
import TrailDetailsPage from "./pages/trails/TrailDetailsPage";
import MyTrailsPage from "./pages/my_trails/MyTrailsPage";
import AscentsPage from "./pages/ascents/AscentPage";
import HikesPage from "./pages/hikes/HikesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";
import AdminMountainsPage from "./pages/admin/AdminMountainsPage";
import AdminTerrainTagsPage from "./pages/admin/AdminTerrainTagsPage";
import AdminTrailsPage from "./pages/admin/AdminTrailsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

//components
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/register" element={<RegisterPage authApi={authApi} />} />

      <Route element={<AppLayout />}>
        <Route path="/trails" element={<TrailsPage trailApi={trailApi}/>} />
        <Route path="/trails/:id" element={<TrailDetailsPage trailApi={trailApi} myTrailApi={myTrailApi} />} />
        <Route path="/" element={<Navigate to="/trails" replace />} />  
        <Route path="/my-trails" element = {
          <ProtectedRoute>
            <MyTrailsPage myTrailApi={myTrailApi}/>
          </ProtectedRoute>
        }/>
        <Route path="/ascents" element = {
          <ProtectedRoute>
            <AscentsPage ascentApi={ascentApi} myTrailApi={myTrailApi} />
          </ProtectedRoute>
        }/>
        <Route path="/hikes" element = {
          <ProtectedRoute>
            <HikesPage hikeApi={hikeApi} myTrailApi={myTrailApi} />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage/>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/audit-logs" element={
            <ProtectedRoute requiredRole="admin">
              <AdminAuditLogsPage auditLogApi={auditLogApi}/>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/mountains" element={
          <ProtectedRoute requiredRole="admin">
            <AdminMountainsPage mountainApi={mountainApi}/>
          </ProtectedRoute>
          }
        />
        <Route path="/admin/terrain-tags" element={
          <ProtectedRoute requiredRole="admin">
            <AdminTerrainTagsPage terrainTagApi={terrainTagApi}/>
          </ProtectedRoute>
          }
        />
        <Route path="/admin/trails" element={
          <ProtectedRoute requiredRole="admin">
            <AdminTrailsPage
              trailApi={trailApi}
              mountainApi={mountainApi}
              terrainTagApi={terrainTagApi}
            />
          </ProtectedRoute>
          }
        />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsersPage userApi={usersApi}/>
          </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
