import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import BuddyBossLayout from './components/admin/buddyboss/BuddyBossLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/buddyboss/*" element={<BuddyBossLayout />} />
      </Routes>
    </Router>
  );
}

export default App;