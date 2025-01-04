import { Routes, Route } from 'react-router-dom';
import ProfilesConfig from './ProfilesConfig';

const TravelbuddysRoutes = () => {
  return (
    <Routes>
      <Route path="profiles" element={<ProfilesConfig />} />
    </Routes>
  );
};

export default TravelbuddysRoutes;