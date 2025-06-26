import { Blog } from "../models/blog.model.js";
import { Follower } from "../models/follower.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const totalBlogs = await Blog.countDocuments({
        owner: userId,
    });

    if (!totalBlogs) {
        throw new ApiError(
            500,
            "Something went wrong while displaying total Blogs"
        );
    }

    const totalFollowers = await Follower.countDocuments({
        channel: userId,
    });

    if (!totalFollowers) {
        throw new ApiError(
            500,
            "Something went wrong while displaying total followers"
        );
    }

    const totalLikes = await Like.countDocuments({
        Blog: {
            $in: await Blog.find({ owner: userId }).distinct("_id"),
        },
    });

    if (!totalLikes) {
        throw new ApiError(
            500,
            "Something went wrong while displaying total likes"
        );
    }

    const totalViews = await Blog.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
            },
        },
    ]);

    if (!totalViews) {
        throw new ApiError(
            500,
            "Something went wrong while displaying total views"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalBlogs,
                totalFollowers,
                totalLikes,
                totalViews: totalViews[0]?.totalViews || 0,
            },
            "Channel stats fetched successfully"
        )
    );
});

const getChannelBlogs = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const Blogs = await Blog.find({
        owner: userId,
    }).sort({
        createdAt: -1,
    });

    if (!Blogs) {
        throw new ApiError(404, "Blogs not found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, Blogs, "Channel Blogs fetched successfully"));
});

export { getChannelStats, getChannelBlogs };