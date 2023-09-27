const Complaint = require('../models/Complaint');

const loadComplaints = () => {
    return Complaint.find();
  };

module.exports = { loadComplaints }