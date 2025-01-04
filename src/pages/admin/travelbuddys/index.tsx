import { Routes, Route } from 'react-router-dom';
import ProfilesConfig from './ProfilesConfig';
import SettingsConfig from './SettingsConfig';

const TravelbuddysRoutes = () => {
  return (
    <Routes>
      <Route index element={<ProfilesConfig />} />
      <Route path="profiles" element={<ProfilesConfig />} />
      <Route path="settings" element={<SettingsConfig />} />
    </Routes>
  );
};

export default TravelbuddysRoutes;