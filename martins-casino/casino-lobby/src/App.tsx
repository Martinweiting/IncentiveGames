import { useEffect, useMemo, useState } from 'react';
import LobbyPage, { type AppRoute } from './components/lobby/LobbyPage';

const APP_ROUTES = ['/', '/games', '/promotions', '/leaderboard'] as const;
const ROUTE_CHANGE_EVENT = 'casino:lobby-route-change';

function normalizeRoute(pathname: string): AppRoute {
  return APP_ROUTES.includes(pathname as AppRoute) ? (pathname as AppRoute) : '/';
}

function readCurrentRoute(): AppRoute {
  return normalizeRoute(window.location.pathname);
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => readCurrentRoute());

  useEffect(() => {
    const syncRoute = () => setRoute(readCurrentRoute());

    window.addEventListener('popstate', syncRoute);
    window.addEventListener(ROUTE_CHANGE_EVENT, syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener(ROUTE_CHANGE_EVENT, syncRoute);
    };
  }, []);

  const navigate = useMemo(
    () => (nextRoute: AppRoute) => {
      if (nextRoute === route) {
        window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
        return;
      }

      window.history.pushState({}, '', nextRoute);
      window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
    },
    [route]
  );

  return <LobbyPage route={route} navigate={navigate} />;
}
