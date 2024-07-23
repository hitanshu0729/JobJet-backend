import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running at port ${process.env.PORT || 4000}`);
});
