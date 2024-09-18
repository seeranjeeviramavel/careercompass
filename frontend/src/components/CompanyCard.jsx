import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const CompanyCard = ({ cmp }) => {
  return (
    <div className="w-full p-3 bg-white shadow-md rounded flex items-center gap-4">
      <Link to={`/company-profile/${cmp?._id}`} className="flex items-center w-full">
        <img
          src={cmp?.profileUrl || NoProfile}
          alt={cmp?.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <div className="ml-3 flex flex-col">
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 truncate">
            {cmp?.name}
          </p>
          <span className="text-xs sm:text-sm text-blue-600">{cmp?.email}</span>
        </div>
      </Link>

      <div className="flex flex-col items-center">
        <p className="text-sm sm:text-base md:text-lg text-blue-600 font-semibold">
          {cmp?.jobPosts?.length}
        </p>
        <span className="text-xs sm:text-sm text-gray-600">Jobs Posted</span>
      </div>

      <div className="flex-1 flex justify-end">
        <p className="text-xs sm:text-sm text-gray-600">{cmp?.location}</p>
      </div>
    </div>
  );
};

export default CompanyCard;
