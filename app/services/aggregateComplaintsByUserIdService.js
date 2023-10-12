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
                    _id: 0,
                    userID: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    totalUpvotes: 1,
                    totalDownvotes: 1,
                    createdAt: 1,
                    username: "$user.username",
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