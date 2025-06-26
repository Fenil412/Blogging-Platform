import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET all users (Admin only)
const admin = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -refreshToken -avatar -coverImage');

    return res
        .status(200)
        .json(new ApiResponse(200, users, "All users fetched successfully"));
});

// DELETE a user by ID (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await User.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User removed successfully"));
});

// Admin Dashboard - get total user count
const dashboard = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();

    return res
        .status(200)
        .json(new ApiResponse(200, { userCount }, "Admin access granted"));
});

export { admin, deleteUser, dashboard };
