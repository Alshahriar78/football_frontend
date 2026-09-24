import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';

import Home from './pages/public/Home';
import Teams from './pages/public/Teams';
import Fixtures from './pages/public/Fixtures';
import Results from './pages/public/Results';
import Standings from './pages/public/Standings';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Tournaments from './pages/admin/Tournaments';
import AdminTeams from './pages/admin/Teams';
import AdminMatches from './pages/admin/Matches';
import AdminResults from './pages/admin/Results';
import TeamDetails from './pages/public/TeamDetails';
import Banners from './pages/admin/Banners';
import Gallery from './pages/admin/Gallery';
import Announcements from './pages/admin/Announcements';
import PublicAnnouncements from './pages/public/Announcements';
import PublicGallery from './pages/public/Gallery';

const App = () => {
  return (
    <Routes>
      {/* Public Website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/results" element={<Results />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/team/:id" element={<TeamDetails />} />
        <Route path="/announcements" element={<PublicAnnouncements />}/>
        <Route path="/gallery" element={<PublicGallery />} />
      </Route>

      {/* Admin Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
         <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/tournaments" element={<Tournaments />} />
            <Route path="/admin/teams" element={<AdminTeams />} />
            <Route path="/admin/matches" element={<AdminMatches />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/banners" element={<Banners />}/>
            <Route path="/admin/gallery" element={<Gallery />} />
            <Route path="/admin/announcements" element={<Announcements />} />
         </Route>
     </Route>
     
    </Routes>
    
  );
};

export default App;