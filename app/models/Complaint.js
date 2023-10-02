const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const complaintSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      required: true,
      index: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    keterangan: {
      type: String,
      required: true
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

module.exports = mongoose.model("Complaint", complaintSchema);
