const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  userID: {
    type: ObjectId,
    required: true,
    index: true,
    ref: 'User'
  },
  complaintID: {
    type: ObjectId,
    required: true,
    index: true,
    ref: 'Complaint'
  },
  upvote: {
    type: Number,
    required: true,
    default: 0
  },
  downvote: {
    type: Number,
    required: true,
    default: 0
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Feedback", feedbackSchema);