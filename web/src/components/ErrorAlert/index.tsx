import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { useError } from '../../contexts/errorContext';

type ErrorAlertProps = {
  children: JSX.Element;
};

function ErrorAlert({ children }: ErrorAlertProps) {
  const { error, clearError } = useError();

  return (
    <>
      {!error || (
        <Alert
          severity="error"
          onClose={clearError}
          style={{ position: 'absolute', width: '100%', zIndex: 999 }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {children}
    </>
  );
}

export default ErrorAlert;
