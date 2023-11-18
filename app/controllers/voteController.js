const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

async function upvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;

    try {
        const complaint = await Complaint.findOne({ _id: reqComplaint.id });
        const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id });
    
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }    
    
        if (feedback) {
            if (feedback.is_upvote) {
                await Complaint.findByIdAndUpdate(reqComplaint.id, { totalUpvotes: complaint.totalUpvotes - 1 }, { new: true, runValidators: true });
                await Feedback.deleteOne({ userID: reqUser.userId, complaintID: reqComplaint.id, is_upvote: true });
    
                const responseFeedback = { is_upvote: false, is_downvote: false };

                res.status(200).json({ feedback: responseFeedback, totalUpvotes: complaint.totalUpvotes - 1 });
            } else if (feedback.is_downvote) {
                res.status(409).json({ message: 'User already voted' });
            }
        } else {
            await Complaint.findByIdAndUpdate(reqComplaint.id, { totalUpvotes: complaint.totalUpvotes + 1 }, { new: true, runValidators: true });
    
            const newFeedback = new Feedback({ userID: reqUser.userId, complaintID: reqComplaint.id, is_upvote: true });
            await newFeedback.save();
    
            const responseFeedback = { is_upvote: newFeedback.is_upvote, is_downvote: newFeedback.is_downvote };
            res.status(200).json({ feedback: responseFeedback, totalUpvotes: complaint.totalUpvotes + 1 });
        }
    } catch (err) {
        console.error('Error save upvote:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function downvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    
    try {
        const complaint = await Complaint.findOne({ _id: reqComplaint.id });
        const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id });
    
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }    
    
        if (feedback) {
            if (feedback.is_downvote) {
                await Complaint.findByIdAndUpdate(reqComplaint.id, { totalDownvotes: complaint.totalDownvotes - 1 }, { new: true, runValidators: true });
                await Feedback.deleteOne({ userID: reqUser.userId, complaintID: reqComplaint.id, is_downvote: true });
    
                const responseFeedback = { is_upvote: false, is_downvote: false };
                
                res.status(200).json({ feedback: responseFeedback, totalDownvotes: complaint.totalDownvotes - 1 });
            } else if (feedback.is_downvote) {
                res.status(409).json({ message: 'User already voted' });
            }
        } else {
            await Complaint.findByIdAndUpdate(reqComplaint.id, { totalDownvotes: complaint.totalDownvotes + 1 }, { new: true, runValidators: true });
    
            const newFeedback = new Feedback({ userID: reqUser.userId, complaintID: reqComplaint.id, is_downvote: true });
            await newFeedback.save();
    
            const responseFeedback = { is_upvote: newFeedback.is_upvote, is_downvote: newFeedback.is_downvote };
            res.status(200).json({ feedback: responseFeedback, totalDownvotes: complaint.totalDownvotes + 1 });
        }
    } catch (err) {
        console.error('Error save upvote:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { upvoteComplaint, downvoteComplaint }