const mongoose = require("mongoose");
const ComplaintModel = require("../model/complaint.model");

const loadComplaints = () => {
  return ComplaintModel.find();
};

const addComplaint = (input) => {
    ComplaintModel.insertMany(input);
}

module.exports = { loadComplaints, addComplaint }