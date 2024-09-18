import { useEffect, useState } from "react";
import { Linkedin, NoProfile } from "../assets";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { jobs } from "../utils/data";
import { CustomButton, JobCard, Loading } from "../components";
import { apiRequest } from "../utils/apiUtils";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const JobDetail = () => {
  const location = useLocation();
  const params = useParams();
  const [job, setJob] = useState({});
  const [similarJobs, setSimilarJobs] = useState([]);
  const [selected, setSelected] = useState("0");
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [JobApplicants, setJobApplicants] = useState([]);
  const fetchJobApplicants = async (id) => {
    try {
      const res = await apiRequest({
        url: `/jobs/get-applicants/${id}`,
        token: user?.token,
        method: "GET",
      });
      setJobApplicants(res.data.applications);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchJobDetail = async () => {
    const from = location?.state?.from?.pathname;
    const isJobApplicants = from?.includes("job-applicants");
    if (isJobApplicants) {
      setSelected("2");
    }
    let id = null;
    if (params?.id && params.id !== undefined) {
      id = params?.id;
    }
    try {
      const res = await apiRequest({
        url: `jobs/get-job-details/${id}`,
      });
      setJob(res.data.data);
      setSimilarJobs(res.data.similarJobs);
      if (isJobApplicants) {
        fetchJobApplicants(res.data.data._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [params?.id]);

  const handleDeleteJob = async () => {
    window.confirm("Are you sure you want to delete this job?");
    try {
      const res = await apiRequest({
        url: `jobs/delete-job/${job?._id}`,
        token: user?.token,
        method: "DELETE",
      });

      if (res.success) {
        window.location.replace("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  const [colDefs, setColDefs] = useState([
    { field: "firstName" },
    { field: "lastName" },
    {
      field: "email",
      cellRenderer: (params) => (
        <a href={`mailto:${params.value}`}>{params.value}</a>
      ),
    },
    {
      field: "contact",
      cellRenderer: (params) => (
        <a href={`tel:${params.value}`}>{params.value}</a>
      ),
    },
    { field: "jobTitle" },
    { field: "location" },
  ]);
  const navigate = useNavigate();
  const handleApplyJob = async () => {
    if (!user?.token) {
      navigate("/user-auth");
    }
    setIsLoading(true);
    try {
      const res = await apiRequest({
        url: `/jobs/apply-job/${job?._id}`,
        token: user?.token,
        method: "POST",
      });
      if (res.status === "failed") {
        setIsLoading(false);
      } else if (res.status === "success") {
        console.log("Successfully applied for the job", res);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
    fetchJobDetail();
  };

  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-10">
        <div className="w-full h-fit bg-white px-5 py-10 mt-10 shadow-md md:w-full md:px-10 md:ms-6 2xl:w-4/5">
          <div className="w-full flex items-center justify-between">
            <div className="w-3/4 flex gap-2">
              <img
                src={job?.company?.profileUrl || NoProfile}
                alt={job?.company?.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex flex-col ms-3">
                <p className="text-xl font-semibold text-gray-600">
                  {job?.jobTitle}
                </p>

                <span className="text-base">{job?.location}</span>

                <span className="text-base text-blue-600">
                  {job?.company?.name}
                </span>

                <span className="text-gray-500 text-sm">
                  {moment(job?.createdAt).fromNow()}
                </span>
              </div>
            </div>

            <div className="">
              <AiOutlineSafetyCertificate className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="w-full flex flex-wrap md:flex-row gap-2 items-center justify-between mt-10 mb-7">
            <div className="bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">Salary</span>
              <p className="text-lg font-semibold text-gray-700">
                $ {job?.salary}
              </p>
            </div>

            <div className="bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">Job Type</span>
              <p className="text-lg font-semibold text-gray-700">
                {job?.jobType}
              </p>
            </div>

            <div className="bg-[#fed0ab] w-45 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">Experience</span>
              <p className="text-lg font-semibold text-gray-700">
                {job?.experience} Yrs
              </p>
            </div>

            <div className="bg-[#cecdff] w-45 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">No. of Vacancies</span>
              <p className="text-lg font-semibold text-gray-700">
                {job?.vacancies}
              </p>
            </div>
          </div>

          <div className="w-full flex gap-4 py-3">
            <CustomButton
              onClick={() => setSelected("0")}
              title="Job Description"
              containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                selected === "0"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />

            <CustomButton
              onClick={() => setSelected("1")}
              title="Company"
              containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                selected === "1"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />
            {user?._id === job?.company?._id &&
              user?.accountType === "company" && (
                <CustomButton
                  onClick={() => {
                    setSelected("2");
                    fetchJobApplicants(job._id);
                  }}
                  title="Applicants"
                  containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                    selected === "2"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-300"
                  }`}
                />
              )}
          </div>

          <div className="my-6">
            {selected === "0" && (
              <>
                <p className="text-xl font-semibold mb-2">Job Description</p>

                <span className="text-base">
                  {job?.details?.jobDescription}
                </span>

                {job?.details?.requirements && (
                  <>
                    <p className="text-xl font-semibold mt-8 mb-2">
                      Requirements
                    </p>
                    <span className="text-base">
                      {job?.details?.requirements}
                    </span>
                  </>
                )}
              </>
            )}
            {selected === "1" && (
              <>
                <div className="mb-6 flex flex-col">
                  <p className="text-xl text-blue-600 font-semibold">
                    {job?.company?.name}
                  </p>
                  <span className="text-base">{job?.company?.location}</span>
                  <span className="text-sm">{job?.company?.email}</span>
                </div>

                <p className="text-xl font-semibold mb-2">About Company</p>
                <span>{job?.company?.about}</span>
              </>
            )}
            {selected === "2" && (
              <div className="ag-theme-quartz" style={{ height: 350 }}>
                <AgGridReact rowData={JobApplicants} columnDefs={colDefs} />
              </div>
            )}
          </div>
          <div className="w-full mt-5">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {user?._id === job?.company?._id &&
                  user?.accountType === "company" && (
                    <CustomButton
                      title="Delete Job"
                      onClick={handleDeleteJob}
                      containerStyles="w-full flex items-center justify-center text-white bg-red-500 py-3 px-5 outline-none rounded-full text-base"
                    />
                  )}

                {user?.accountType === "seeker" && (
                  <>
                    {job?.applicants?.includes(user._id) ? (
                      <CustomButton
                        title="Applied"
                        containerStyles="w-full flex items-center justify-center text-white bg-blue-600 py-3 px-5 outline-none rounded-full text-base"
                      />
                    ) : (
                      <CustomButton
                        title="Apply Now"
                        onClick={handleApplyJob}
                        containerStyles="w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base"
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full p-5 mt-10 md:mt-0 md:w-1/3 2xl:w-2/4">
          <p className="text-gray-500 font-semibold">Similar Job Post</p>

          <div className="w-full flex flex-wrap gap-4">
            {similarJobs
              ?.slice(0, 6)
              .map(
                (job) =>
                  params?.id !== job?._id && <JobCard job={job} key={job._id} />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
