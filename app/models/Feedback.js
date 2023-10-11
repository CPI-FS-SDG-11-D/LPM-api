const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
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
    is_upvote: {
      type: Boolean,
      required: true,
      default: false
    },
    is_downvote: {
      type: Boolean,
      required: true,
      default: false
    },
  });

module.exports = mongoose.model("Feedback", feedbackSchema);