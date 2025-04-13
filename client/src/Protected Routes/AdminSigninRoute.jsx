import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const SigninRoute = ({ children }) => {
   const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/checkAdminAuth`, {
          withCredentials: true,
        });
        if (res.status === 200) {
            navigate('/admin/dashboard');
        }else setIsAuth(false)
      } catch (err) {
        setIsAuth(false);
      }
    };
    verify();
  }, []);

  if (isAuth) return null;

  return children;
};

export default SigninRoute;
