import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoutes from './pages/admin';
import WordPressCallback from './pages/auth/WordPressCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/wordpress/callback" element={<WordPressCallback />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<AdminRoutes.Users />} />
          <Route path="travelbuddies" element={<AdminRoutes.TravelBuddies />} />
          <Route path="settings" element={<AdminRoutes.Settings />} />
          {/* Add other admin routes here */}
        </Route>
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
