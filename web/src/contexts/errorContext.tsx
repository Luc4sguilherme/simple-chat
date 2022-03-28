import { createContext, useContext, useMemo, useState } from 'react';

interface ErrorContextData {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  clearError: () => void;
}

type ErrorProviderProps = {
  children: JSX.Element;
};

const ErrorContext = createContext<ErrorContextData>({} as ErrorContextData);

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  const memoizedValue = useMemo(
    () => ({
      error,
      setError,
      clearError,
    }),
    [error],
  );

  return (
    <ErrorContext.Provider value={memoizedValue}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  return context;
}
