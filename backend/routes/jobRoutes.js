import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import {
  applyJob,
  createJob,
  deleteJob,
  getAppliedJobs,
  getJobApplications,
  getJobById,
  getJobPosts,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/upload-job", userAuth, createJob);
router.put("/update-job/:id", userAuth, updateJob);
router.get("/find-jobs", getJobPosts);
router.get("/get-job-details/:id", getJobById);
router.delete("/delete-job/:id", userAuth, deleteJob);
router.post("/apply-job/:id", userAuth, applyJob);
router.get("/get-applicants/:id", userAuth, getJobApplications);
router.post("/get-applied-jobs", userAuth, getAppliedJobs);

export default router;
