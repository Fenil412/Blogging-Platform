import mongoose, {Schema} from "mongoose"

const followersSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is following
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // one to whom 'follower' is following
        ref: "User"
    }
}, {timestamps: true})



export const Followers = mongoose.model("Followers", followersSchema)