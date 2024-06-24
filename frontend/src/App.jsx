import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Findjobs from "./pages/Findjobs";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import UploadJob from "./pages/UploadJob";
import JobDetail from "./pages/JobDetail";
import UserProfile from "./pages/UserProfile";
import Auth from "./pages/Auth";

function Layout() {
  const user = true;
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/user-auth" state={{ from: location }} replace />
  );
}
const App = () => {
  const user = {};
  return (
    <main>
      <Navbar />
      hii
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="find-jobs" replace={true} />}
          />
          <Route path="/find-jobs" element={<Findjobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route
            path={
              user?.user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/company-profile/:id" element={<CompanyProfile />} />
          <Route path="/upload-job" element={<UploadJob />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/user-auth" element={<Auth/>} />
        </Route>
      </Routes>
      {user && <Footer />}
    </main>
  );
};

export default App;
