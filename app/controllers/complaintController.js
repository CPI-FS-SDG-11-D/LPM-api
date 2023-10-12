const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

const jwt = require("jsonwebtoken");
const accessToken = process.env.SECRET_TOKEN;

async function getComplaints(req, res) {
  try {
    let user = req.user ?? "";

    // gunakan aggregate pada model Complaint
    const complaints = await Complaint.aggregate([
      // tahap pertama: lookup user dan feedback
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "complaintID",
          as: "feedbacks",
        },
      },
      // tahap kedua: unwind user dan feedbacks
      {
        $unwind: "$user",
      },
      {
        $unwind: "$feedbacks",
      },
      // tahap ketiga: group berdasarkan _id complaint
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          status: { $first: "$status" },
          // hitung total is_upvote dan is_downvote
          totalUpvotes: { $first: "$totalUpvotes" },
          totalDownvotes: { $first: "$totalDownvotes" },
          // cek apakah user tertentu pernah memberikan feedback
          feedbacks: {
            $push: {
              userID: "$feedbacks.userID",
              is_upvote: "$feedbacks.is_upvote",
              is_downvote: "$feedbacks.is_downvote",
            },
          },
          vote_flag: {
            // tambahkan operator $first di sini
            $first: {
              $cond: [
                // gunakan tanda kutip ganda di sini
                {
                  $setIsSubset: [
                    [{ $toString: "$feedbacks.userID" }],
                    [user.userId],
                  ],
                },
                // gunakan tanda kutip ganda di sini juga
                {
                  $cond: [
                    { $eq: ["$feedbacks.is_upvote", true] },
                    "upvote",
                    "downvote",
                  ],
                },
                "",
              ],
            },
          },
        },
      },
      // tahap keempat: project field-field yang ingin ditampilkan
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          totalUpvotes: 1,
          totalDownvotes: 1,
          vote_flag: 1,
        },
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

  if (complaint.keterangan == "selesai" || complaint.keterangan == "nonaktif") {
    return res
      .status(410)
      .json({
        message:
          "Sorry, your complaint is no longer active or has been resolved.",
      });
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
      if (
        (feedback && feedback.upvote === upvote) ||
        feedback.downvote === downvote
      ) {
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
