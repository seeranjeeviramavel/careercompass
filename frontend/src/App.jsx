import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  UploadJob,
  UserProfile,
} from "./pages";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import JobApplicants from "./pages/JobApplicants";
import AppliedJobs from "./pages/AppliedJobs";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  ) : (
    <Navigate to="/user-auth" state={{ from: location }} replace />
  );
}

function App() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <main className="bg-[#f7fdfd]">
      <Navbar />
      <Routes>
        <Route path="/" element={<FindJobs />} />
        <Route path="/find-jobs" element={<FindJobs />} />
        <Route path="/company" element={<Companies />} />
        <Route path={"/company-profile/:id"} element={<CompanyProfile />} />
        <Route path={"/job-detail/:id"} element={<JobDetail />} />
        <Route element={<Layout />}>
          <Route
            path={
              user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />

          {user?.accountType === "company" ? (
            <>
              {" "}
              <Route path={"/company-profile"} element={<CompanyProfile />} />
              <Route path={"/upload-job"} element={<UploadJob />} />
              <Route path={"/job-applicants"} element={<JobApplicants />} />
            </>
          ) : (
            <>
              <Route path={"/apply-history"} element={<AppliedJobs />} />
            </>
          )}
        </Route>
        <Route path="/about-us" element={<About />} />
        <Route path="/user-auth" element={<AuthPage />} />
      </Routes>
      {user && <Footer />}
    </main>
  );
}

export default App;
