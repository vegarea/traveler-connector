import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from './Dashboard';
import Users from './Users';
import TravelbuddysRoutes from './travelbuddys';
import SettingsRoutes from './settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="travelbuddies/*" element={<TravelbuddysRoutes />} />
        <Route path="settings/*" element={<SettingsRoutes />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;