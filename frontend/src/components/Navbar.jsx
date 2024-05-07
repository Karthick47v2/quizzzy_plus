import { FaArrowRightFromBracket } from "react-icons/fa6";
import { SiChatbot } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";

import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="navbar-md rounded-lg shadow-xl z-20 flex items-center justify-center bg-neutral max-w-sm w-auto fixed top-6 left-1/2 -translate-x-1/2 text-white">
      <Link to="/chatbot">
        <div className=" flex justify-center items-center gap-1 p-3 rounded-l-md hover:bg-primary">
          <SiChatbot size={15} />
          <div className="hidden md:block font-semibold text-sm">Chat Bot</div>
        </div>
      </Link>
      <Link to="/chatpdf">
        <div className="flex justify-center items-center gap-1 p-3 hover:bg-primary">
          <FaFilePdf size={15} />
          <div className="hidden md:block font-semibold text-sm">Chat PDF</div>
        </div>
      </Link>
      <div className="divider divider-primary divider-horizontal"></div>
      <a href="/" className="mr-2 hover:bg-primary py-2 px-3 rounded-md">
        <FaArrowRightFromBracket size={15} />
      </a>
    </div>
  );
};
export default Navbar;
