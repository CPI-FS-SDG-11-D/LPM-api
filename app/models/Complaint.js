const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const complaintSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      required: true,
      index: true,
      ref: "User",
    },
    title: {
      type: String,
      maxLength: 1000,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    totalUpvotes: {
      type: Number,
      required: true,
      default: 0,
    },
    totalDownvotes: {
      type: Number,
      required: true,
      default: 0,
    },
    urlComplaint: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.plugin(mongoosePaginate);
complaintSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Complaint", complaintSchema);
