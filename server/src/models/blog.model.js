import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const blogSchema = new Schema(
    {
        videoFile: {
            type: String //cloudinary url
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        content: {
            type: String, 
            required: true
        },
        tags: {
            type: [String] // Array of tag strings
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

blogSchema.plugin(mongooseAggregatePaginate)

export const Blog = mongoose.model("Blog", blogSchema)