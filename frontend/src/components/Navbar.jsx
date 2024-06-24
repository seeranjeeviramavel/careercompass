import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="relative bg-[#f7fdfd] z-50">
      <nav className="container mx-auto flex items-center justify-between p-5">
        <div>
          <Link to="/" className="text-blue-600 font-bold text-xl">
            Career
            <span className="text-[#1677cccb]">Compass</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
