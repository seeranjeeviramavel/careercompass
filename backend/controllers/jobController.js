import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";

export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      requirements,
    } = req.body;

    if (
      !jobTitle ||
      !jobDescription ||
      !jobType ||
      !location ||
      !salary ||
      !vacancies ||
      !experience ||
      !requirements
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid company id" });
    }

    const jobPost = {
      userId: req.body.userId,
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      details: {
        jobDescription,
        requirements,
      },
      company: id,
    };

    const job = new Jobs(jobPost);
    await job.save();
    const company = await Companies.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    company.jobPosts.push(job._id);
    await company.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      requirements,
    } = req.body;

    if (
      !jobTitle ||
      !jobDescription ||
      !jobType ||
      !location ||
      !salary ||
      !vacancies ||
      !experience ||
      !requirements
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      details: {
        jobDescription,
        requirements,
      },
    };

    const job = await Jobs.findByIdAndUpdate(id, jobPost, { new: true });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobPosts = async (req, res) => {
  try {
    const { search, sort, location, jType, exp } = req.query;
    const query = {};
    console.log(jType);
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (jType) {
      query.jobType = { $in: jType.split(",") };
    }
    if (exp) {
      const [minExp, maxExp] = exp.split("-");
      query.experience = {
        $gte: parseInt(minExp) - 1,
        $lte: parseInt(maxExp) + 1,
      };
    }

    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { jobType: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = {};
    if (sort === "Newest") {
      sortOption = { createdAt: -1 };
    } else if (sort === "Oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "A-Z") {
      sortOption = { jobTitle: 1 };
    } else if (sort === "Z-A") {
      sortOption = { jobTitle: -1 };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;

    const total = await Jobs.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const jobs = await Jobs.find(query)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);
    res.status(200).json({
      jobs,
      currentPage: page,
      totalPages,
      recordCount: total,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await Jobs.findById(id).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const searchQuery = {
      $or: [
        { jobTitle: { $regex: job.jobTitle, $options: "i" } },
        { jobType: { $regex: job.jobType, $options: "i" } },
      ],
    };

    const similarJobs = await Jobs.find(searchQuery)
      .populate({ path: "company", select: "-password" }) // Populate company in similar jobs
      .sort({ _id: -1 });

    res.status(200).json({
      message: "Job fetched successfully",
      data: job, // The job will include company details
      similarJobs, // Similar jobs with company details populated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }
    const job = await Jobs.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }
    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const userId  = req.body.user.userId;
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (job.applicants.includes(userId)) {
      return res.status(400).json({ message: "User already applied" });
    }

    job.applicants.push(userId);
    await job.save();

    res.status(200).json({ message: "Job applied successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }
    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const applications = await Users.find({ _id: { $in: job.applicants } }).select("-password");
    res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const appliedJobs = await Jobs.find({ applicants: userId });

    if (appliedJobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for the user" });
    }
    const jobsWithCompanyDetails = await Promise.all(
      appliedJobs.map(async (job) => {
        const company = await Companies.findById(job.company);
        company.password = undefined;
        return {
          ...job.toObject(),
          company,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Jobs applied by the user fetched successfully",
      data: jobsWithCompanyDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteAllJobs = async (req, res, next) => {
  try {
    const jobs = await Jobs.deleteMany();
    res.status(200).json({
      success: true,
      message: "All jobs deleted successfully",
      data: jobs,
    });
  } catch (error) {
    console.error(error);
  }
}
