const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: { 
            required: true,
            type: String
        },
        email: { 
            required: true,
            unique: true,
            type: String,
        },
        password: { 
            required: true,
            type: String
        },
        urlPhoto: { 
            required: true,
            type: String,
            default: 'https://res.cloudinary.com/ddpbwjjfz/image/upload/v1697472188/profile/gek0crksf01d7l1pehgz.jpg'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);