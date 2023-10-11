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
      maxLength: 255,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    totalUpvotes: {
      type: Number,
      required: true,
      default: 0
    },
    totalDownvotes: {
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
