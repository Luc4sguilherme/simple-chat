import './App.css';

import { AuthProvider } from './contexts/authContext';
import { ErrorProvider } from './contexts/errorContext';
import { SocketProvider } from './contexts/socketContext';
import RoutesContainer from './routes';

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <SocketProvider>
          <RoutesContainer />
        </SocketProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
