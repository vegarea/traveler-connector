import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import MemberProfile from './pages/MemberProfile';
import Index from './pages/Index';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/members/:username" element={<MemberProfile />} />
        <Route 
          path="/admin/*" 
          element={
            <AdminLayout>
              {/* Admin routes will be rendered here */}
            </AdminLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;