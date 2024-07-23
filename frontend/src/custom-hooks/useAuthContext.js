import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    console.error('useAuthContext must be used within AuthContext');
  }
  return context;
};
