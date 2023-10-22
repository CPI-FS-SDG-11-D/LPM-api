const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

async function getComplaints(req, res) {
  try {
    let user = req.user ?? "";

    // Define the sorting options
    const sortByCreatedAt = -1; // Sort by createdAt in descending order (latest first)
    const { page, limit } = req.query;

    const options = {
      page: page ?? 1,
      limit: limit ?? 5,
    };

    // gunakan aggregate pada model Complaint
    let complaintAggregate = Complaint.aggregate([
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
          username: { $first: "$user.username" },
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
          urlComplaint: { $first: "$urlComplaint" },
          createdAt: { $first: "$createdAt" },
        },
      },
      // tahap keempat: project field-field yang ingin ditampilkan
      {
        $project: {
          _id: 1,
          username: 1,
          title: 1,
          description: 1,
          status: 1,
          totalUpvotes: 1,
          totalDownvotes: 1,
          vote_flag: 1,
          urlComplaint: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          _id: sortByCreatedAt, // Sort by createdAt
        },
      },
    ]);

    let complaints;
    await Complaint
    .aggregatePaginate(complaintAggregate, options)
    .then(function (result) {
      complaints = result.docs ?? [];
    }).catch(function (err) {
      console.log(err);
    });

    // Send the complaints as a response
    res.status(200).json({ complaints: complaints });
  } catch (err) {
    console.error("Error Complaint :", err);

    // Handle any errors
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getViralComplaints(req, res) {
  try {
    // Define the sorting options
    const sortByTotalUpvotes = -1; // Sort by totalUpvotes in descending order (highest first)

    const virals = await Complaint.aggregate([
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
          // hitung total is_upvote
          totalUpvotes: { $first: "$totalUpvotes" },
        },
      },
      // tahap keempat: project field-field yang ingin ditampilkan
      {
        $project: {
          _id: 1,
          title: 1,
          totalUpvotes: 1,
        },
      },
      {
        $sort: {
          totalUpvotes: sortByTotalUpvotes, // Sort by totalUpvotes
        },
      },
      // tahap kelimat: limit agar hanya mengeluarkan 4
      {
        $limit: 4,
      },
    ]);

    // Send the viral complaints as a response
    res.status(200).json({ virals: virals });
  } catch (err) {
    console.error("Error Viral Complaint :", err);

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

  if (complaint.keterangan == "selesai" || complaint.keterangan == "nonaktif") {
    return res.status(410).json({
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

const addComplaint = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User tidak terautentikasi, Harap login terlebih dahulu",
    });
  }

  const userID = req.user.userId;
  const { title, description, urlComplaint } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Harap isi semua bidang yang diperlukan (title dan description)",
    });
  }

  try {
    const complaintData = {
      userID,
      title,
      description,
      status: "pending",
      totalUpvotes: 0,
      totalDownvotes: 0,
      urlComplaint: urlComplaint,
    };

    const complaint = new Complaint(complaintData);
    await complaint.save();

    res
      .status(201)
      .json({ message: "Keluhan berhasil ditambahkan", complaint });
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
    const user = await User.findOne({ _id: complaint.userID });
    const username = user.username;

    const responseData = { username, complaint};

    if (req.user) {
      const isComplaintOwner = req.user.userId == complaint.userID;
      const feedback = await Feedback.findOne({
        complaintID: req.params.id,
        userID: req.user.userId,
      });

      const feedbacks = {
        is_upvote: feedback ? feedback.is_upvote : false,
        is_downvote: feedback ? feedback.is_downvote : false,
      };

      responseData.isComplaintOwner = isComplaintOwner;
      responseData.feedbacks = feedbacks;
    } else {
      responseData.isComplaintOwner = false;
      responseData.feedbacks = null;
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.userID.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this complaint" });
    }

    complaint.status = req.body.status;
    await complaint.save();

    res.status(200).redirect(`/api/complaints/${req.params.id}`);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchComplaint = async (req, res) => {
  try {
    const searchTerm = req.query.title;
    const regexPattern = new RegExp(`\\b.*${searchTerm}.*\\b`, "i");

    const complaints = await Complaint.find({
      title: { $regex: regexPattern },
    });

    if (complaints.length === 0) {
      return res.status(404).json({ message: "Complaints NOT Found." });
    }

    const responseData = [];

    for (const complaint of complaints) {
      const user = await User.findOne({ _id: complaint.userID });
      const feedback = await Feedback.findOne({
        complaintID: complaint._id,
        userID: req.user ? req.user.userId : null,
      });

      responseData.push({
        username: user.username,
        complaint,
        feedback: 
          {
          is_upvote: feedback ? feedback.is_upvote : false,
          is_downvote: feedback ? feedback.is_downvote : false,
          }
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.userID.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this complaint" });
    }

    if (complaint.status !== "pending") {
      return res
        .status(403)
        .json({ message: "You can only delete pending complaints" });
    }

    // Menghapus Complaint
    await Complaint.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getComplaints,
  getViralComplaints,
  votes,
  loadComplaints,
  addComplaint,
  detailComplaint,
  updateComplaint,
  searchComplaint,
  deleteComplaint,
};
