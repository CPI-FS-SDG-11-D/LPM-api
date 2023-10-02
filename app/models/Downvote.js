const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const downvoteSchema = new Schema({
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

module.exports = mongoose.model("Downvote", downvoteSchema);