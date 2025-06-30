import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Follower } from "../models/follower.model.js";
import mongoose from "mongoose";

// Get all users with pagination and filtering
const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role, status } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (status) filter.status = status;
    
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        select: '-password -refreshToken'
    };

    const users = await User.paginate(filter, options);
    
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

// Get detailed user information
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid user ID");
    }
    
    const user = await User.findById(id)
        .select('-password -refreshToken')
        .populate({
            path: 'blogs',
            select: 'title slug views likesCount createdAt',
            options: { limit: 5, sort: { createdAt: -1 } }
        });
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    // Get additional stats
    const [blogCount, commentCount, likeCount] = await Promise.all([
        Blog.countDocuments({ author: id }),
        Comment.countDocuments({ owner: id }),
        Like.countDocuments({ likedBy: id })
    ]);
    
    const userData = {
        ...user.toObject(),
        blogCount,
        commentCount,
        likeCount
    };
    
    return res
        .status(200)
        .json(new ApiResponse(200, userData, "User details fetched"));
});

// Update user details (admin)
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, status, isVerified } = req.body;
    
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid user ID");
    }
    
    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields to update");
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-password -refreshToken');
    
    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Toggle user active status
const toggleUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid user ID");
    }
    
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();
    
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User status updated"));
});

// Delete user (admin)
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid user ID");
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    // Delete user assets from Cloudinary
    if (user.avatar?.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
    }
    if (user.coverImage?.public_id) {
        await deleteFromCloudinary(user.coverImage.public_id);
    }
    
    // Delete user content
    await Promise.all([
        Blog.deleteMany({ author: id }),
        Comment.deleteMany({ owner: id }),
        Like.deleteMany({ likedBy: id }),
        Follower.deleteMany({ $or: [{ follower: id }, { author: id }] })
    ]);
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

// Get platform statistics
const getPlatformStats = asyncHandler(async (req, res) => {
    const [users, blogs, comments, likes, followers] = await Promise.all([
        User.countDocuments(),
        Blog.countDocuments(),
        Comment.countDocuments(),
        Like.countDocuments(),
        Follower.countDocuments()
    ]);
    
    const newUsers = await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const activeUsers = await User.countDocuments({ status: 'active' });
    
    const stats = {
        users: {
            total: users,
            active: activeUsers,
            new: newUsers
        },
        content: {
            blogs,
            comments,
            likes
        },
        engagement: {
            followers
        }
    };
    
    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Platform stats fetched"));
});

// Get recent platform activity
const getRecentActivity = asyncHandler(async (req, res) => {
    const [newUsers, newBlogs, newComments] = await Promise.all([
        User.find().sort({ createdAt: -1 }).limit(5).select('username createdAt'),
        Blog.find().sort({ createdAt: -1 }).limit(5).select('title slug createdAt').populate('author', 'username'),
        Comment.find().sort({ createdAt: -1 }).limit(5).select('content createdAt').populate('owner', 'username').populate('blog', 'title slug')
    ]);
    
    const activity = {
        newUsers,
        newBlogs,
        newComments
    };
    
    return res
        .status(200)
        .json(new ApiResponse(200, activity, "Recent activity fetched"));
});

// Search users
const searchUsers = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 20 } = req.query;
    
    if (!search || search.trim().length < 3) {
        throw new ApiError(400, "Search query must be at least 3 characters");
    }
    
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        select: 'username email fullName role status createdAt'
    };
    
    const users = await User.paginate(
        {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } }
            ]
        },
        options
    );
    
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users search results"));
});

export {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getPlatformStats,
    getRecentActivity,
    searchUsers,
    toggleUserStatus
};