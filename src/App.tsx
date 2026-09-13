import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Teams from './pages/Teams';
import Fixtures from './pages/Fixtures';
import Results from './pages/Results';
import Standings from './pages/Standings';
import Statistics from './pages/Statistics';
import TeamProfile from './pages/TeamProfile';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/team/:id" element={<TeamProfile />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/results" element={<Results />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;