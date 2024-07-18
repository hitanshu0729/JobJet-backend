export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  console.log(process.env.NODE_ENV); // Log NODE_ENV for debugging
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
    httpOnly: false, // Cookie is accessible via client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Use secure flag in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjusted for development and production
  };
  res
    .status(statusCode)
    .cookie("token", token, options) // Set the cookie with options
    .json({
      success: true,
      user,
      message,
      token,
    });
};
