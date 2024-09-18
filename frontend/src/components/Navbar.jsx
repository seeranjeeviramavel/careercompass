import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { users } from "../utils/data";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../redux/userSlice";
import { NoProfile } from "../assets";

function MenuList({ user, onClick }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <div>
      <Menu as="div" className="inline-block text-left">
        <div className="flex">
          <Menu.Button className="inline-flex gap-2 w-full rounded-md bg-white md:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20 ">
            <div className="leading[80px] flex flex-col items-start">
              <p className="text-sm font-semibold ">
                {user?.firstName ?? user?.name}
              </p>
              <span className="text-sm text-blue-600 ">
                {user?.jobTitle ?? user?.email}
              </span>
            </div>
            <img
              src={user?.profileUrl || NoProfile}
              alt="user profile"
              className="w-10 h-10 rounded-full object-cover "
            />
            <BiChevronDown
              className="h-8 w-8 text-slate-600"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-50 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none lg:right-2 lg:left-auto sm:left-2">
            <div className="p-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`${
                      user?.accountType === "seeker"
                        ? "user-profile"
                        : `company-profile/${user?._id}`
                    }`}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md p-2 text-sm`}
                    onClick={onClick}
                  >
                    <CgProfile
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    {user?.accountType === "seeker"
                      ? "User Profile"
                      : "Company Profile"}
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineLogout
                      className={`${
                        active ? "text-white" : "text-gray-600"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div class="sticky top-0 bg-[#f7fdfd] z-10">
        <nav class="w-full mx-auto flex items-center justify-between px-8 py-4 shadow-md">
          <div>
            <Link to="/" className="text-blue-600 font-bold text-xl">
              CareerCompass
            </Link>
          </div>

          <ul className="hidden lg:flex gap-10 text-base">
            <li>
              <Link to="/">Find Job</Link>
            </li>
            <li>
              <Link to="/company">Companies</Link>
            </li>
            <li>
              <Link
                to={
                  user?.accountType === "seeker"
                    ? "apply-history"
                    : "upload-job"
                }
              >
                {user?.accountType === "seeker" ? "Applications" : "Upload Job"}
              </Link>
            </li>
            {user?.accountType === "company" && (
              <li>
                <Link to={"job-applicants"}>Job Applicants</Link>
              </li>
            )}

            <li>
              <Link to="/about-us">About</Link>
            </li>
          </ul>

          <div className="hidden lg:block">
            {!user?.token ? (
              <a href="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles="text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600"
                />
              </a>
            ) : (
              <div>
                <MenuList user={user} />
              </div>
            )}
          </div>

          <button
            className="block lg:hidden text-slate-900"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>
        <div
          className={`${
            isOpen
              ? "w-full flex bg-[#f7fdfd] absolute top-50 left-0 z-50"
              : "hidden"
          } lg:hidden flex-col pl-8 gap-3 py-5 shadow-lg`}
        >
          <Link to="/" onClick={handleCloseNavbar}>
            Find Job
          </Link>
          <Link to="/company" onClick={handleCloseNavbar}>
            Companies
          </Link>
          <Link
            onClick={handleCloseNavbar}
            to={user?.accountType === "seeker" ? "apply-history" : "upload-job"}
          >
            {user?.accountType === "seeker" ? "Applications" : "Upload Job"}
          </Link>
          {user?.accountType === "company" && (
            <Link to={"job-applicants"}>Job Applicants</Link>
          )}
          <Link to="/about-us" onClick={handleCloseNavbar}>
            About
          </Link>

          <div className="w-full my-2 py-2 border-t-2 border-gray-100">
            {!user?.token ? (
              <a href="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                />
              </a>
            ) : (
              <div>
                <MenuList user={user} onClick={handleCloseNavbar} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
