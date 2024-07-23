import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { SiChatbot } from 'react-icons/si';
import { FaFilePdf } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';
const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <div className="fixed backdrop-blur-sm w-1/2 h-[80px] left-1/2 -translate-x-1/2 top-0 z-10">
      <div className="navbar-md rounded-lg shadow-xl z-20 flex items-center justify-center bg-neutral max-w-sm w-auto fixed top-6 left-1/2 -translate-x-1/2 text-white">
        <Link to="/chatbot">
          <div
            className={`flex justify-center items-center gap-1 p-3 rounded-l-md hover:bg-primary ${
              pathname === '/chatbot' ? 'bg-primary/50' : ''
            }`}
          >
            <SiChatbot size={15} />
            <div className="hidden md:block font-semibold text-sm">Chatbot</div>
          </div>
        </Link>
        <Link to="/pdf2qa">
          <div
            className={`flex justify-center items-center gap-1 p-3 hover:bg-primary ${
              pathname === '/pdf2qa' ? 'bg-primary/50' : ''
            }`}
          >
            <FaFilePdf size={15} />
            <div className="hidden md:block font-semibold text-sm">
              PDF to QA
            </div>
          </div>
        </Link>
        <div className="hidden md:flex divider divider-primary divider-horizontal "></div>
        <a
          href="/"
          className="mr-2 hover:bg-primary py-2 px-1 pl-2 md:px-2 rounded-md tooltip tooltip-secondary tooltip-bottom hover:tooltip-open"
          data-tip="logout"
        >
          <FaArrowRightFromBracket />
        </a>
      </div>
    </div>
  );
};
export default Navbar;
