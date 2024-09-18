import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const companyExists = await Companies.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ message: "Company already exists" });
    }
    const company = await Companies.create({ name, email, password });
    const token = await company.createJWT();
    company.password = undefined;
    res.status(201).json({
      message: "Company created successfully",
      user:  company,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const company = await Companies.findOne({ email }).select("+password");
    if (!company) {
      return res.status(401).json({ message: "Company not found" });
    }
    const isPasswordCorrect = await company.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await company.createJWT();
    company.password = undefined;
    res.status(201).json({
      message: "Login successful",
      user: company,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileMetaData, about } = req.body;

  try {
    if (!name || !contact || !location || !profileUrl || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const id = req.body.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id: " + id });
    }
    let profiledata;

    if (profileMetaData && Object.keys(profileMetaData).length > 0) {
      profiledata = await uploadFile({
        ...profileMetaData,
        uploadTime: Date.now(),
        uploaderId: userId,
        uploaderType: "company",
        uploadFolder: "profile",
      });
    }
    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
    };
    if (profiledata) {
      updateCompany.profileMetaData = profiledata._id;
      updateCompany.profileUrl = profiledata.fileUrl;
    }
    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    company.password = undefined;
    company.profileMetaData = undefined;
    const token = await company.createJWT();

    res.status(201).json({
      message: "Company profile updated successfully",
      user: company, 
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id:" + id });
    }
    const company = await Companies.findById({ _id: id });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCompanies = async (req, res, next) => {
    try {
      const { search, sort, location } = req.query;
      const query = {};
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }
  
      let sortOption;
      if (sort === "Newest") {
        sortOption = { createdAt: -1 };
      } else if (sort === "Oldest") {
        sortOption = { createdAt: 1 };
      } else if (sort === "A-Z") {
        sortOption = { name: 1 };
      } else if (sort === "Z-A") {
        sortOption = { name: -1 };
      }
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const total = await Companies.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const companies = await Companies.find(query)
        .select("-password")
        .sort(sortOption)
        .skip(startIndex)
        .limit(limit);
  
      res.status(200).json({
        companies,
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
  

export const getCompanyJobListings = async (req, res, next) => {
  try {
    const { search, sort } = req.query;
    const id = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id:" + id });
    }
    const query = {};
    if (search) {
      query.location = { $regex: search, $options: "i" };
    }
    let sorting;
    if (sort === "Newest") {
      sorting.sort("-createdAt");
    } else if (sort === "Oldest") {
      sorting.sort("createdAt");
    } else if (sort === "A-Z") {
      sorting.sort("name");
    } else if (sort === "Z-A") {
      sorting.sort("-name");
    }

    let queryResult = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: sorting,
      },
    });

    const companies = queryResult;
    res.status(200).json({
      sucess: true,
      message: "Company job listings fetched successfully",
      data: companies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id: " + id });
    }
    const company = await Companies.findById(id).populate({
      path: "jobPosts",
      options: {
        sort: "-createdAt",
      },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllCompanies = async (req, res, next) => {
  try {
    const companies = await Companies.deleteMany();
    res.status(200).json({
      success: true,
      message: "All companies deleted successfully",
      data: companies,
    });
  } catch (error) {
    console.error(error);
  }
}