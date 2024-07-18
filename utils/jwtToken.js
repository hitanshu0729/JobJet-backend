export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
    httpOnly: false, // Ensures the cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production", // Use secure flag in production
    sameSite: "None", // Allows cross-site requests
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
