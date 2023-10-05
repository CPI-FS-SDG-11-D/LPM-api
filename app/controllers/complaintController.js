const Complaint = require("../models/Complaint");

const jwt = require("jsonwebtoken");
const accessToken = process.env.SECRET_TOKEN;

async function getComplaints(req, res) {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    let user = "";
    if (token) {
      const decodedToken = jwt.verify(token, accessToken);
      user = decodedToken ?? "";
    }

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
          keterangan: { $first: "$keterangan" },
          // hitung total upvote dan downvote
          totalUpvotes: { $sum: "$feedbacks.upvote" },
          totalDownvotes: { $sum: "$feedbacks.downvote" },
          // cek apakah user tertentu pernah memberikan feedback
          feedbacks: {
            $push: {
              userID: "$feedbacks.userID",
              upvote: "$feedbacks.upvote",
              downvote: "$feedbacks.downvote",
            },
          },
          vote: {
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
                    { $eq: ["$feedbacks.upvote", 1] },
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
          keterangan: 1,
          totalUpvotes: 1,
          totalDownvotes: 1,
          vote: 1,
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

const loadComplaints = async (_, res) => {
  try {
    const allComplaints = await Complaint.find();
    res.status(200).json(allComplaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

const addComplaint = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({
          message: "User tidak terautentikasi, Harap login terlebih dahulu",
        });
    }

    const result = await Complaint.insertMany(req.body);
    console.log(result);
    res.status(201).redirect("/api/complaints");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const detailComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id });
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

    const complaints = await Complaint.find({
      title: { $regex: regexPattern },
    });

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
    const deletedComplaint = Complaint.deleteOne({ _id: req.params.id }).then(
      (result) => {
        return result;
      }
    );
    res.status(200).redirect("/api/complaints");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getComplaints,
  votes,
  loadComplaints,
  addComplaint,
  detailComplaint,
  searchComplaint,
  deleteComplaint,
};
