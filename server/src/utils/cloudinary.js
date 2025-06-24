import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "BloggingPlatform"
        })

        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const getPublicIdFromUrl = (url) => {
    try {
        if (!url) return null;
        const parts = url.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split(".")[0]; // Remove file extension
        return publicId;
    } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        return null;
    }
};


export { uploadOnCloudinary, getPublicIdFromUrl };