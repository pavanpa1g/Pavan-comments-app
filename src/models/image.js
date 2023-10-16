import mongoose from "mongoose";

let Image;

try {
    Image = mongoose.model("Image");
} catch (error) {
    const imagesModel = mongoose.Schema(
        {
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            imageUrl: { type: String, required: true },
            description: { type: String, trim: true },
            likes: { type: Number, default: 0 },
            likedBy: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            commentsCount: { type: Number, default: 0 },
        },
        {
            timestamps: true,
        }
    );

    Image = mongoose.model("Image", imagesModel);
}

export default Image;
