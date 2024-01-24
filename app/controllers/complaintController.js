const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

async function addComplaint(req, res){
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

async function getComplaint(req, res) {
    const reqUser = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const response = [];

    try {
        const complaints = await Complaint.find().sort({ createdAt: -1, totalUpvotes: -1 }).skip((page - 1) * limit).limit(limit);

        if (complaints.length === 0) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        for (const complaint of complaints) {
            const user = await User.findOne({ _id: complaint.userID });
            const feedback = await Feedback.findOne({ complaintID: complaint._id, userID: reqUser ? reqUser.userId : null });

            response.push({
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

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getComplaintViral(req, res) {
    try {
        const complaints = await Complaint.find().select('title totalUpvotes').sort({ totalUpvotes: -1 }).limit(4);

        res.status(200).json({ complaints: complaints });
    } catch (err) {
        console.error('Error get complaints:', err);
        res.status(404).json({ message: 'Complaints not found' });
    }
}

async function getComplaintById(req, res) {
    const reqUser = req.user;
    const reqComplaint = req.params;

    try {
        const complaint = await Complaint.findOne({ _id: reqComplaint.id });
        const user = await User.findOne({ _id: complaint.userID });
        const feedback = await Feedback.findOne({ complaintID: reqComplaint.id, userID: reqUser ? reqUser.userId : null });

        const response = {
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

        res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: "Complaint not found" });
    }
};

async function getComplaintByTitle(req, res){
    const reqUser = req.user;
    const searchTerm = req.query.title;
    const regexPattern = new RegExp(`\\b.*${searchTerm}.*\\b`, "i");
    const response = [];

    try {
        const complaints = await Complaint.find({ title: { $regex: regexPattern }}).sort({ totalUpvotes: -1, createdAt: -1 });

        if (complaints.length === 0) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        for (const complaint of complaints) {
            const user = await User.findOne({ _id: complaint.userID });
            const feedback = await Feedback.findOne({ complaintID: complaint._id, userID: reqUser ? reqUser.userId : null });

            response.push({
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

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

async function updateComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    const reqStatus = req.body;

    try {
        const complaint = await Complaint.findOne({ _id: reqComplaint.id });

        if (complaint.userID.toString() !== reqUser.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        complaint.status = reqStatus.status;
        await complaint.save();

        res.status(200).json({ message: "Complaint updated successfully" });
    } catch (error) {
        return res.status(404).json({ message: "Complaint not found" });
    }
};

async function deleteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;

    try {
        const complaint = await Complaint.findOne({ _id: reqComplaint.id });

        if (complaint.status !== "pending") {
            return res.status(403).json({ message: "You can only delete pending complaints" });
        } else if (complaint.userID.toString() !== reqUser.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Complaint.deleteOne({ _id: complaint._id });
        await Feedback.deleteMany({ complaintID: complaint._id });

        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        return res.status(404).json({ message: "Complaint not found" });
    }
};

module.exports = {
    addComplaint,
    getComplaint,
    getComplaintViral,
    getComplaintById,
    getComplaintByTitle,
    updateComplaint,
    deleteComplaint,
};
