import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from './contexts/authContext';
import Home from './pages/Home';
import Login from './pages/Login';

function PrivatedRoute() {
  const { signed } = useAuth();
  const location = useLocation();

  return signed ? (
    <Home />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

function RoutesContainer() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PrivatedRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesContainer;
