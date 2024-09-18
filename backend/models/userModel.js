import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
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
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    accountType: {
      type: String,
      default: "seeker",
    },
    contact: {
      type: String,
    },
    location: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    profileMetaData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Files",
    },
    resumeMetaData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Files",
    },
    profileUrl: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) {
  } else {
    this.password = bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createJWT = async function () {
  const token = JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const Users = mongoose.model("Users", userSchema);

export default Users;
