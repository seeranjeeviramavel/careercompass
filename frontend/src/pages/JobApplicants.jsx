import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiUtils";
import { useSelector } from "react-redux";
import { JobCard } from "../components";
const JobApplicants = () => {
  const { user } = useSelector((state) => state.user);
  const [recentPost, setRecentPost] = useState({});

  const getRecentPost = async () => {
    try {
      const res = await apiRequest({
        url: `/company/get-company/${user?._id}`,
        method: "GET",
      });
      console.log(res.data.data);
      setRecentPost(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRecentPost();
  }, []);

  return (
    <div>
      <div class="w-full flex flex-wrap p-10 gap-10">
        {recentPost?.jobPosts && recentPost.jobPosts.length > 0 ? (
          recentPost.jobPosts.map((cmp) => {
            const { name, email, profileUrl } = recentPost;
            console.log(profileUrl, "profileUrl");
            const newJob = {
              ...cmp,
              company: {
                name,
                email,
                profileUrl,
              },
            };
            return <JobCard key={cmp._id} job={newJob} />;
          })
        ) : (
          <span className="text-3xl">No Job Posts</span>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
