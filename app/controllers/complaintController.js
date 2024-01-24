const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

async function getComplaints(req, res) {
  try {
    let user = "";
    if (req.user) {
      const userId = new mongoose.Types.ObjectId(req.user.userId); // Konversi ke ObjectId
      user = await User.findOne({ _id: userId }); // Menggunakan ObjectId
    }

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
          userID: { $first: "$user.userID" },
          username: { $first: "$user.username" },
          urlUser: { $first: "$user.urlUser" },
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
          feedback: {
            // tambahkan operator $first di sini
            $first: {
              $cond: [
                // gunakan tanda kutip ganda di sini
                {
                  $setIsSubset: [["$feedbacks.userID"], [user._id]],
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
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $sort: {
          _id: sortByCreatedAt, // Sort by createdAt
        },
      },
      // tahap keempat: project field-field yang ingin ditampilkan
      {
        $project: {
          _id: 0,
          username: "$username",
          urlUser: "$urlUser",
          complaint: {
            _id: "$_id",
            userID: "$userID",
            title: "$title",
            description: "$description",
            status: "$status",
            totalUpvotes: "$totalUpvotes",
            totalDownvotes: "$totalDownvotes",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
            urlComplaint: "$urlComplaint",
          },
          // feedbacks: "$feedbacks",
          feedback: {
            is_upvote: { $eq: ["$feedback", "upvote"] },
            is_downvote: { $eq: ["$feedback", "downvote"] },
          },
        },
      },
    ]);

    let complaints;
    await Complaint.aggregatePaginate(complaintAggregate, options)
      .then(function (result) {
        complaints = result.docs ?? [];
      })
      .catch(function (err) {
        console.log(err);
      });

    // Send the complaints as a response
    res.status(200).json({ complaints });
  } catch (err) {
    console.error("Error Complaint :", err);

    // Handle any errors
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getViralComplaints(req, res) {
  try {
    const complaints = await Complaint.find().select('title totalUpvotes').sort({ totalUpvotes: -1 }).limit(4);

    res.status(200).json({ complaints: complaints });
  } catch (err) {
    console.error('Error get complaints:', err);
    res.status(404).json({ message: 'Complaints not found' });
  }
}

const addComplaint = async (req, res) => {
  const userID = req.user.userId;
  const { title, description, urlComplaint } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Fill the blank" });
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

    res.status(201).json({ message: "Complaint added successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const detailComplaint = async (req, res) => {
  const reqUser = req.user;
  const reqComplaint = req.params;

  try {
    const complaint = await Complaint.findOne({ _id: reqComplaint.id });
    const user = await User.findOne({ _id: complaint.userID });
    const feedback = await Feedback.findOne({ complaintID: reqComplaint.id, userID: reqUser ? reqUser.userId : null });

    const responseData = {
      username: user.username,
      urlUser: user.urlUser,
      complaint: {
        _id: complaint._id,
        userID: complaint.userID._id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        totalUpvotes: complaint.totalUpvotes,
        totalDownvotes: complaint.totalDownvotes,
        createdAt: complaint.createdAt,
        urlComplaint: complaint.urlComplaint || null,
      },
      feedback: {
        is_upvote: feedback ? feedback.is_upvote : false,
        is_downvote: feedback ? feedback.is_downvote : false,
      },
  };

    res.status(200).json(responseData);
  } catch (error) {
    return res.status(404).json({ message: "Complaint not found" });
  }
};

const updateComplaint = async (req, res) => {
  const reqUser = req.user;
  const reqComplaint = req.params;
  const reqStatus = req.body;

  try {
    const complaint = await Complaint.findOne({ _id: reqComplaint.id });

    if (complaint.userID.toString() !== reqUser.userId) {
      return res.status(403).json({ message: "Unauthorize" });
    }

    complaint.status = reqStatus.status;
    await complaint.save();

    res.status(200).json({ message: "Complaint updated successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Complaint not found" });
  }
};

const searchComplaint = async (req, res) => {
  const searchTerm = req.query.title;
  const regexPattern = new RegExp(`\\b.*${searchTerm}.*\\b`, "i");
  const responseData = [];

  try {
    const complaints = await Complaint.find({title: { $regex: regexPattern }});

    if (complaints.length === 0) {
      return res.status(404).json({ message: "Complaints not found." });
    }

    for (const complaint of complaints) {
      const user = await User.findOne({ _id: complaint.userID });
      const feedback = await Feedback.findOne({ complaintID: complaint._id, userID: req.user ? req.user.userId : null });

      responseData.push({
        username: user.username,
        urlUser: user.urlUser,
        complaint: {
          _id: complaint._id,
          userID: complaint.userID,
          title: complaint.title,
          description: complaint.description,
          status: complaint.status,
          totalUpvotes: complaint.totalUpvotes,
          totalDownvotes: complaint.totalDownvotes,
          createdAt: complaint.createdAt,
          urlComplaint: complaint.urlComplaint || null,
        },
        feedback: {
          is_upvote: feedback ? feedback.is_upvote : false,
          is_downvote: feedback ? feedback.is_downvote : false,
        },
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteComplaint = async (req, res) => {
  const reqUser = req.user;
  const reqComplaint = req.params;

  const session = await Complaint.startSession();
  session.startTransaction();

  try {
    const complaint = await Complaint.findOne({ _id: reqComplaint.id });

    if (complaint.status !== "pending") {
      return res.status(403).json({ message: "You can only delete pending complaints" });
    } else if (complaint.userID.toString() !== reqUser.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Complaint.deleteOne({ _id: complaint._id });
    await Feedback.deleteMany({ complaintID: complaint._id });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(404).json({ message: "Complaint not found" });
  }
};

module.exports = {
  getComplaints,
  getViralComplaints,
  addComplaint,
  detailComplaint,
  updateComplaint,
  searchComplaint,
  deleteComplaint,
};
