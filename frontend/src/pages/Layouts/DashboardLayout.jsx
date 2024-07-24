import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';

const DashboardLayout = () => {
  return (
    <div className="h-screen bg-neutral">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default DashboardLayout;
