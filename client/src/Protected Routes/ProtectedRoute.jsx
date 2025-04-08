import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const serverUrl = import.meta.env.VITE_SERVER_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const adminPicFunc = async () => {
      const adminPic = localStorage.getItem('adminProfileImg');
      if (!adminPic) {
        try {
          const profilePic = await axios.get(`${serverUrl}/api/admin/getProfilePic`, {
            withCredentials: true
          })
          if (profilePic.status === 200) {
            localStorage.setItem('adminProfileImg', profilePic.data.profilePic)
          }
        } catch (error) {
          console.log('error from protected route getProfilepic', error);
        }
      }
    }

    const verify = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/checkAdminAuth`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsAuth(true);
          setAdminData(res.data.admin)
        }
      } catch (err) {
        setIsAuth(false);
      }
    };
    verify();
    adminPicFunc();
  }, []);

  if (isAuth === null) return <h2>Loading...</h2>;
  if (isAuth === false) return <Navigate to="/admin/signin" replace />;

  return typeof children === 'function' ? children(adminData) : children;
};

export default ProtectedRoute;
