import JWT from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const deftoken = token.split(" ")[1];
    const decoded = JWT.verify(deftoken, process.env.JWT_SECRET_KEY);
    req.body.user = {
      userId: decoded.userId,
    };
    next();
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
  } else {
      return res.status(401).json({ message: "Invalid token" });
  }
  }
};

