import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Please Enter Your Job Title"],
    },
    jobType: {
      type: String,
      required: [true, "Please Enter Your Job Type"],
    },
    location: {
      type: String,
      required: [true, "Please Enter Your Location"],
    },
    salary: {
      type: Number,
      required: [true, "Please Enter Your Salary"],
    },
    vacancies: {
      type: Number,
      required: [true, "Please Enter Your Vacancies"],
    },
    experience: {
      type: String,
      default: 0,
    },
    details: {
      type: Object,
      required: [true, "Please Enter Your Job Details"],
    },
    applicants: {
      type: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    },
  },
  {
    timestamps: true,
  }
);

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
