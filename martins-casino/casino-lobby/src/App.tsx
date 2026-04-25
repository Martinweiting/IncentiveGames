import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LobbyPage, { type AppRoute } from './components/lobby/LobbyPage';

const APP_ROUTES = ['/', '/games', '/promotions', '/leaderboard'] as const;

function normalizeRoute(pathname: string): AppRoute {
  return APP_ROUTES.includes(pathname as AppRoute) ? (pathname as AppRoute) : '/';
}

function RoutedLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = normalizeRoute(location.pathname);

  return <LobbyPage route={route} navigate={(nextRoute) => navigate(nextRoute)} />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RoutedLobby />} />
        <Route path="/games" element={<RoutedLobby />} />
        <Route path="/promotions" element={<RoutedLobby />} />
        <Route path="/leaderboard" element={<RoutedLobby />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
