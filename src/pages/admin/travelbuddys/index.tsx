import { Routes, Route } from 'react-router-dom';
import ProfilesConfig from './ProfilesConfig';
import AdminLayout from "@/components/admin/AdminLayout";

const TravelbuddysRoutes = () => {
  return (
    <Routes>
      <Route index element={<ProfilesConfig />} />
      <Route path="profiles" element={<ProfilesConfig />} />
    </Routes>
  );
};

export default TravelbuddysRoutes;