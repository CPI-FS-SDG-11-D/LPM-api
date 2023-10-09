const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

async function upvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    const complaint = await Complaint.findOne({ _id: reqComplaint.id }); // Find complain in database
    const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id }); // Find upvote in database

    if(feedback) {
        if (feedback.is_upvote == true || feedback.is_downvote == true) {
            return res.status(409).json({ message: 'User already voted' });
        }   
    } else {
        if (complaint) {
            await Complaint.findByIdAndUpdate(reqComplaint.id, { totalUpvotes: complaint.totalUpvotes + 1 }, { new: true, runValidators: true }); // Update upvote complaint
        } else {
            return res.status(404).json({ message: 'Complaint not found' });
        }    

        try {
            const newFeedback = new Feedback({ userID: reqUser.userId, complaintID: reqComplaint.id, is_upvote: true }) // Save feedback upvotes
            await newFeedback.save();
    
            res.status(200).json({ totalUpvotes: complaint.totalUpvotes + 1 });
        } catch (err) {
            console.error('Error save upvote:', err);
            res.status(500).json({ message: 'Internal server error' });
        }    
    }
}

async function downvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    const complaint = await Complaint.findOne({ _id: reqComplaint.id }); // Find complain in database
    const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id, }); // Find downvote in database

    if(feedback) {
        if (feedback.is_upvote == true || feedback.is_downvote == true) {
            return res.status(409).json({ message: 'User already voted' });
        }   
    } else {
        if (complaint) {
            await Complaint.findByIdAndUpdate(reqComplaint.id, { totalDownvotes: complaint.totalDownvotes + 1 }, { new: true, runValidators: true }); // Update upvote complaint
        } else {
            return res.status(404).json({ message: 'Complaint not found' });
        } 

        try {
            const newFeedback = new Feedback({ userID: reqUser.userId, complaintID: reqComplaint.id, is_downvote: true }) // Save feedback downvotes
            await newFeedback.save();
    
            res.status(200).json({ totalDownvotes: complaint.totalDownvotes + 1 });
        } catch (err) {
            console.error('Error save upvote:', err);
            res.status(500).json({ message: 'Internal server error' });
        }    
    }
}

module.exports = { upvoteComplaint, downvoteComplaint }