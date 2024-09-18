import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils/apiUtils";
import { useNavigate } from "react-router-dom";
const AppliedJobs = () => {
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  const [colDefs, setColDefs] = useState([
    { field: "company.name" },
    { field: "jobTitle" },
    { field: "jobType" },
    { field: "location" },
    { field: "salary" },
    { field: "vacancies" },
    { field: "experience" },
    { field: "details.jobDescription" },
    { field: "details.requirements" },
  ]);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fetchJobApplications = async () => {
    try {
      const res = await apiRequest({
        url: `/jobs/get-applied-jobs`,
        token: user?.token,
        method: "POST",
      });
      setAppliedJobs(res.data.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobApplications();
  }, []);

  const NavigateToJob = (row) => {
    navigate("/job-detail/" + row.data._id);
  };
  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact
        rowData={appliedJobs}
        columnDefs={colDefs}
        onRowClicked={NavigateToJob}
      />
    </div>
  );
};

export default AppliedJobs;
