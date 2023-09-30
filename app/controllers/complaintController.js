const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

async function getComplaints(req, res) {
  try {
    const complaints = await Feedback.aggregate([
      {
        $lookup: {
          from: "complaints",
          localField: "complaintID",
          foreignField: "_id",
          as: "complaint",
        },
      },
      {
        $unwind: "$complaint",
      },
      {
        $lookup: {
          from: "users",
          localField: "complaint.userID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: "$complaint._id",
          title: "$complaint.title",
          description: "$complaint.description",
          keterangan: "$complaint.keterangan",
          username: "$user.username",
          upvote: 1,
          downvote: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          keterangan: { $first: "$keterangan" },
          username: { $first: "$username" },
          upvotes: { $sum: "$upvote" },
          downvotes: { $sum: "$downvote" },
        },
      },
      {
        $sort: { upvotes: -1 },
      },
    ]);

    // Send the complaints as a response
    res.status(200).json({ complaints: complaints });
  } catch (err) {
    console.error("Error Complaint :", err);

    // Handle any errors
    res.status(500).json({ error: "Internal server error" });
  }
}

const addComplaint = (input) => {
  Complaint.insertMany(input);
};

const loadComplaints = () => {
  return Complaint.find();
};

const findComplaint = (id) => {
  return Complaint.findOne({ _id: id });
};

const deleteComplaint = (id) => {
  Complaint.deleteOne({ _id: id }).then((result) => {
    return result;
  });
};

module.exports = {
  getComplaints,
  loadComplaints,
  addComplaint,
  findComplaint,
  deleteComplaint,
};
