import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import companyRoutes from "./companyRoutes.js"; 
import jobRoutes from "./jobRoutes.js";
import { deleteAllCompanies } from "../controllers/companiesController.js";
import { deleteAllUser } from "../controllers/userController.js";
import { deleteAllJobs } from "../controllers/jobController.js";
const router = express.Router();
const path = "/api/v1/";

router.use(path + "auth", authRoutes);
router.use(path + "user", userRoutes);
router.use(path + "company", companyRoutes);
router.use(path + "jobs", jobRoutes);

export default router;