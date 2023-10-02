const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const upvoteSchema = new Schema({
    userID: { 
        required: true,
        type: ObjectId
    },
    complaintID: { 
        required: true,
        type: ObjectId
    },
    count: { 
        required: true,
        type: String,
        default: 0
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Upvote", upvoteSchema);