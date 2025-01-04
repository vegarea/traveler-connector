import { Routes, Route } from 'react-router-dom';
import { WordPressConfigForm } from "@/components/admin/WordPressConfigForm";
import { PermissionsCheck } from "@/components/admin/permissions/PermissionsCheck";

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="wordpress" element={<WordPressConfigForm />} />
      <Route path="permissions" element={<PermissionsCheck />} />
    </Routes>
  );
};

export default SettingsRoutes;