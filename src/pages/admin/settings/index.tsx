import { Routes, Route } from 'react-router-dom';
import WordPressConfig from './WordPressConfig';
import PermissionsConfig from './PermissionsConfig';
import StyleConfig from './StyleConfig';

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="wordpress" element={<WordPressConfig />} />
      <Route path="permissions" element={<PermissionsConfig />} />
      <Route path="style" element={<StyleConfig />} />
    </Routes>
  );
};

export default SettingsRoutes;