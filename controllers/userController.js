import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  console.log(req);
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered!");
});
export const login = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Please provide email ,password and role."));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    if (user.role !== role) {
      return next(
        new ErrorHandler(`User with provided email and ${role} not found!`, 404)
      );
    }
    sendToken(user, 201, res, "User Logged In!");
  } catch (e) {
    console.log(e);
    next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
});
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200) // Set appropriate HTTP status code for successful logout
    .cookie("token", "", {
      httpOnly: false, // Allow client-side JavaScript to access cookie (if needed)
      expires: new Date(Date.now()), // Set expiration date to epoch time (Jan 1, 1970) to delete the cookie
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjusted for development and production
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
