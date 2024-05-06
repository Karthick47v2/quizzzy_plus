import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

const DashboardLayout = () => {
  return (
    <div className="h-screen bg-base-200">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default DashboardLayout;
