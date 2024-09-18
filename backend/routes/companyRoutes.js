import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";
import {
  getCompanies,
  getCompanyById,
  getCompanyJobListings,
  getCompanyProfile,
  login,
  register,
  updateCompanyProfile,
} from "../controllers/companiesController.js";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
const router = express.Router();

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.post("/get-company-profile", userAuth, getCompanyProfile);
router.put("/update-company-profile", userAuth, updateCompanyProfile);
router.post("/get-company-joblisting", userAuth, getCompanyJobListings);
router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

export default router;
