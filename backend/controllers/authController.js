import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await Users.create({ firstName, lastName, email, password });
    user.password = undefined;
    const token = await user.createJWT();
    res.status(201).json({
      message: "User created successfully",
      user,
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
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Please Create Account before logging in" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await user.createJWT();
    user.password = undefined;
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res, next) => {
  const { token, accountType } = req.body;

  if (!accountType) {
    return res.status(400).json({ error: "Account type is required" });
  }
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, given_name, family_name, picture } = ticket.getPayload();

    let user, jwtToken;

    if (accountType === "seeker") {
      user = await Users.findOne({ email });
      if (!user) {
        user = await Users.create({
          firstName: given_name,
          lastName: family_name,
          email,
          profileUrl: picture,
        });
      }
    } else if (accountType === "company") {
      user = await Companies.findOne({ email });
      if (!user) {
        user = await Companies.create({
          firstName: given_name,
          lastName: family_name,
          email,
          profileUrl: picture,
        });
      }
    }
    jwtToken = await user.createJWT();
    return res.status(200).json({ user, token: jwtToken });
  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(401).json({ error: "Invalid Google token" });
  }
};
