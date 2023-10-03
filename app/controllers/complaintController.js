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

async function votes(req, res) {
  const reqUser = req.user;
  const { id } = req.body;
  let { upvote, downvote } = req.body;

  const isVoteNotValid =
    (upvote === "0" && downvote === "0") ||
    (upvote == "1" && downvote == "1") ||
    (upvote === undefined && downvote === undefined);
  if ((!id && !upvote && !downvote) || isVoteNotValid) {
    return res.status(404).json({ message: "Bad request" });
  }

  const complaint = await Complaint.findOne({ _id: id }); // Find complain in database
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  if (upvote === "upvote" || !downvote) {
    upvote = 1;
    downvote = 0;
  }
  if (downvote === "downvote" || !upvote) {
    upvote = 0;
    downvote = 1;
  }

  let feedback = await Feedback.findOne({
    userID: reqUser.userId,
    complaintID: id,
  }); // Find feedback in
  try {
    if (feedback) {
      if (feedback && feedback.upvote === upvote || feedback.downvote === downvote) {
        return res.status(200).json({ message: "Please make changes." });
      }
      feedback.upvote = upvote;
      feedback.downvote = downvote;
    } else {
      feedback = new Feedback({
        userID: reqUser.userId,
        complaintID: id,
        upvote: upvote,
        downvote: downvote,
      });
    }

    await feedback.save();
    return res.status(200).json({ feedback: feedback });
  } catch (err) {
    console.error("Error feedback:", err);
  }
  res.status(404).json({ message: "Feedback not found" });
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
  votes,
  loadComplaints,
  addComplaint,
  findComplaint,
  deleteComplaint,
};
