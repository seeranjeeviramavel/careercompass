import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanyCard, CustomButton, Header, ListBox, Loading } from "../components";
import { companies } from "../utils/data";
import { apiRequest, updateURL } from "../utils/apiUtils";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState(companies ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanys = async () => {
    setIsFetching(true);

    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: cmpLocation,
      sort,
      navigate,
      location,
    });
    try {
      const res = await apiRequest({
        url: newURL,
        method: "GET",
      });
      console.log(res.data.companies);
      setNumPage(res.data.numPages);
      setTotalPages(res.data.totalPages);
      setRecordsCount(res.data.recordCount);
      setData(res.data.companies);
      setIsFetching(false);
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    fetchCompanys();
  },[page, cmpLocation, sort]);
  const handleSearchSubmit = async(e) => {
    e.preventDefault();
    fetchCompanys();
  };
  const handleShowMore = () => {};

  return (
    <div className="w-full">
      <Header
        title="Find Your Dream Company"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setCmpLocation}
      />

      <div className="container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 bg-[#f7fdfd]">
        <div className="flex items-center justify-between mb-4 px-6">
          <p className="text-sm md:text-base">
            Showing: <span className="font-semibold">{recordsCount}</span> Companies
            Available
          </p>

          <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
            <p className="text-sm md:text-base mt-2">Sort By:</p>
            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          {data?.map((cmp, index) => (
            <CompanyCard cmp={cmp} key={index} />
          ))}

          {isFetching && (
            <div className="mt-10">
              <Loading />
            </div>
          )}

        
        </div>

        {numPage > page && !isFetching && (
          <>
            <p className="text-sm text-right">
            {data?.length} records out of {totalPages} pages
          </p>
          <div className="w-full flex items-center justify-center pt-16">
            <CustomButton
              onClick={handleShowMore}
              title="Load More"
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Companies;
