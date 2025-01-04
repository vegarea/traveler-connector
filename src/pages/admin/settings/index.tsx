import { Routes, Route } from 'react-router-dom';
import WordPressConfig from './WordPressConfig';
import StyleConfig from './StyleConfig';

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="wordpress" element={<WordPressConfig />} />
      <Route path="style" element={<StyleConfig />} />
    </Routes>
  );
};

export default SettingsRoutes;