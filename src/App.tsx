import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AdminRoutes from './pages/admin';
import MemberProfile from './pages/MemberProfile';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/u/:username" element={<MemberProfile />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;