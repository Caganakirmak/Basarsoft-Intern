// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import { MapProvider } from './contexts/MapContext';
import Login from './components/Login';
import Signup from './components/Signup';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup']; // Navbar'ın gizlenmesi gereken yollar
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname); // Şu anki route bu listede mi?

  return (
    <MapProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<MapComponent />} /> {/* Varsayılan rota */}
          </Routes>
        </div>
      </div>
    </MapProvider>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
