import { Routes, Route } from 'react-router-dom';
import WordPressConfig from './WordPressConfig';
import PermissionsConfig from './PermissionsConfig';

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="wordpress" element={<WordPressConfig />} />
      <Route path="permissions" element={<PermissionsConfig />} />
    </Routes>
  );
};

export default SettingsRoutes;