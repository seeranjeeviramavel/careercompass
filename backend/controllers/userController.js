import mongoose from "mongoose";
import Users from "../models/userModel.js";
import { uploadFile } from "../utils/FileUpload.js";

export const updateUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    accountType,
    contact,
    location,
    jobTitle,
    profileMetaData,
    resumeMetaData,
    about,
    _id: id,
  } = req.body;

  try {
    const userId = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id: " + userId });
    }

    let profiledata, resumedata;

    if (profileMetaData && Object.keys(profileMetaData).length > 0) {
      profiledata = await uploadFile({
        ...profileMetaData,
        uploadTime: Date.now(),
        uploaderId: userId,
        uploaderType: "user",
        uploadFolder: "profile",
      });
    }
    if (resumeMetaData && Object.keys(resumeMetaData).length > 0) {
      resumedata = await uploadFile({
        ...resumeMetaData,
        uploadTime: Date.now(),
        uploaderId: userId,
        uploaderType: "user",
        uploadFolder: "resume",
      });
    }
    const Updateuser = {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contact,
      location,
      jobTitle,
      about,
      _id: userId,
    };

    if (profiledata) {
      Updateuser.profileMetaData = profiledata._id;
      Updateuser.profileUrl = profiledata.fileUrl;
    }
    if (resumedata) {
      Updateuser.resumeMetaData = resumedata._id;
      Updateuser.resumeUrl = resumedata.fileUrl;
    }

    const updatedUser = await Users.findByIdAndUpdate(userId, Updateuser, {
      new: true,
    });
    updatedUser.profileMetaData = undefined;
    updatedUser.resumeMetaData = undefined;
    const token = await updatedUser.createJWT();
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id:" + id });
    }
    const user = await Users.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllUser = async (req, res) => {
  try {
    const deletedUser = await Users.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
