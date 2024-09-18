import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Company Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    accountType: {
      type: String,
      default: "company",
    },
    contact: {
      type: String,
    },
    location: {
      type: String,
    },
    about: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    profileMetaData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Files",
    },
    jobPosts: {
      type: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
    },
  },
  {
    timestamps: true,
  }
);

companySchema.pre("save", async function () {
  if (!this.isModified("password")) {
  } else {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


companySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

companySchema.methods.createJWT = async function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Companies = mongoose.model("Companies", companySchema);


export default Companies;