import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminAuth } from '@/components/admin/auth/AdminAuth';
import { AuthGuard } from '@/components/admin/auth/AuthGuard';
import Dashboard from './Dashboard';
import Users from './Users';
import TravelbuddysRoutes from './travelbuddys';
import SettingsRoutes from './settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminAuth />} />
      <Route element={<AuthGuard><AdminLayout /></AuthGuard>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="travelbuddies/*" element={<TravelbuddysRoutes />} />
        <Route path="settings/*" element={<SettingsRoutes />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;