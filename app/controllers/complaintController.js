const Complaint = require("../models/Complaint");

const loadComplaints = async (_, res) => {
  try {
    const allComplaints = await Complaint.find();
    res.status(200).json(allComplaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addComplaint = async (req, res) => {
  try {
    const result = await Complaint.insertMany(req.body);
    console.log(result);
    res.status(201).redirect("/api/complaints");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const detailComplaint = async (req, res) => {
  try {
      const complaint = await Complaint.findOne({ _id: req.params.id});
      if (complaint === null) {
          return res.status(404).json({ message: "Complaint NOT Found." });
      }
      res.status(201).json(complaint);
  } catch (error) {
      res.status(400).json({ message: "The Complaint NOT Found" });
  }
};

const searchComplaint = async (req, res) => {
  try {
    const searchTerm = req.params.title;
    const regexPattern = new RegExp(`\\b${searchTerm}\\b`, "i"); // Mencari kata tunggal

    const complaints = await Complaint.find({ title: { $regex: regexPattern } });

    if (complaints.length === 0) {
      return res.status(404).json({ message: "Complaints NOT Found." });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteComplaint = (req, res) => {
  try {
      const deletedComplaint = Complaint.deleteOne({ _id: req.params.id }).then((result) => {
        return result;
    });
      res.status(200).redirect("/api/complaints");
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


module.exports = { loadComplaints, addComplaint, detailComplaint, searchComplaint, deleteComplaint };
