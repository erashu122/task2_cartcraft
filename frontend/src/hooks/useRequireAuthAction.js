import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth.js';

export const useRequireAuthAction = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (action) => {
    if (!token) {
      toast.error('Please sign in first');
      navigate('/login');
      return;
    }
    action();
  };
};
