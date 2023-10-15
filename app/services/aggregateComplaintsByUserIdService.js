const Complaint = require('../models/Complaint');

async function aggregateComplaintsByUserId(username) {
    try {
        const complaints = await Complaint.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: {
                    "user.username": username
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: "$_id",
                    username: "$user.username",
                    title: "$title",
                    description: "$description",
                    status: "$status",
                    upvote: "$totalUpvotes",
                    downvote: "$totalDownvotes",
                    createdAt: "$createdAt",
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        return complaints;
    } catch (error) {
        throw error;
    }
}

module.exports = { aggregateComplaintsByUserId };