import { Routes, Route } from 'react-router-dom';
import ProfilesConfig from './ProfilesConfig';
import GroupsConfig from './GroupsConfig';
import ActivityConfig from './ActivityConfig';

const TravelbuddysRoutes = () => {
  return (
    <Routes>
      <Route path="profiles" element={<ProfilesConfig />} />
      <Route path="groups" element={<GroupsConfig />} />
      <Route path="activity" element={<ActivityConfig />} />
    </Routes>
  );
};

export default TravelbuddysRoutes;