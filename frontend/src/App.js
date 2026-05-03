import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import LegalFramework from "./pages/LegalFramework";
import Chronicle from "./pages/Chronicle";
import ChroniclePost from "./pages/ChroniclePost";
import Reports from "./pages/Reports";
import Support from "./pages/Support";
import Connect from "./pages/Connect";
import Grievance from "./pages/Grievance";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import HomepageEditor from "./admin/HomepageEditor";
import AboutEditor from "./admin/AboutEditor";
import ChronicleManager from "./admin/ChronicleManager";
import ReportsManager from "./admin/ReportsManager";
import DirectoryManager from "./admin/DirectoryManager";
import TeamManager from "./admin/TeamManager";
import GrievancesInbox from "./admin/GrievancesInbox";
import UsersManager from "./admin/UsersManager";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal-framework" element={<LegalFramework />} />
          <Route path="/updates" element={<Chronicle />} />
          <Route path="/updates/:slug" element={<ChroniclePost />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/support" element={<Support />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin dashboard (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="homepage" element={<HomepageEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="chronicle" element={<ChronicleManager />} />
          <Route path="reports" element={<ReportsManager />} />
          <Route path="directory" element={<DirectoryManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="grievances" element={<GrievancesInbox />} />
          <Route
            path="users"
            element={
              <ProtectedRoute adminOnly>
                <UsersManager />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
