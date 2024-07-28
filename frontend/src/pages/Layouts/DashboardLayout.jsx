import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import { useEffect } from 'react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');
  useEffect(() => {
    if (!userToken) {
      return navigate('/login');
    }
  });
  return (
    userToken && (
      <div className="h-screen bg-neutral">
        <Navbar />
        <Outlet />
      </div>
    )
  );
};
export default DashboardLayout;
