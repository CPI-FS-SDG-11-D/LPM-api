const Complaint = require("../models/Complaint");

const addComplaint = (input) => {
  Complaint.insertMany(input);
};

const loadComplaints = () => {
  return Complaint.find();
};

const findComplaint = (id) => {
  return Complaint.findOne({ _id: id});
};

const deleteComplaint = (id) => {
  Complaint.deleteOne({ _id: id }).then((result) => {
      return result;
  });
}
module.exports = { loadComplaints, addComplaint, findComplaint, deleteComplaint };
