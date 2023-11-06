const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

async function upvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    const complaint = await Complaint.findOne({ _id: reqComplaint.id }); // Find complain in database
    const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id }); // Find vote in database

    if(feedback) {
        if (feedback.is_upvote == true) {
            if (complaint) {
                await Complaint.findByIdAndUpdate(reqComplaint.id, { totalUpvotes: complaint.totalUpvotes - 1 }, { new: true, runValidators: true }); // Update upvote complaint
            } else {
                return res.status(404).json({ message: 'Complaint not found'});
            }    
    
            try {
                await Feedback.deleteOne({ userID: reqUser.userId, complaintID: reqComplaint.id, is_upvote: true });
    
                const responseFeedback = {
                    is_upvote: false,
                    is_downvote: false
                };
        
                res.status(200).json({ feedback: responseFeedback, totalUpvotes: complaint.totalUpvotes - 1 });
            } catch (err) {
                console.error('Error save upvote:', err);
                res.status(500).json({ message: 'Internal server error' });
            }    
        } else if (feedback.is_downvote == true) {
            res.status(409).json({ message: 'User already voted' });
        }   
    } else {
        if (complaint) {
            await Complaint.findByIdAndUpdate(reqComplaint.id, { totalUpvotes: complaint.totalUpvotes + 1 }, { new: true, runValidators: true }); // Update upvote complaint
        } else {
            return res.status(404).json({ message: 'Complaint not found'});
        }    

        try {
            const newFeedback = new Feedback({ userID: reqUser.userId, complaintID: reqComplaint.id, is_upvote: true }) // Save feedback upvotes
            await newFeedback.save();

            const responseFeedback = {
                is_upvote: newFeedback.is_upvote,
                is_downvote: newFeedback.is_downvote
            };
    
            res.status(200).json({ feedback: responseFeedback, totalUpvotes: complaint.totalUpvotes + 1 });
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
    const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id, }); // Find vote in database

    if(feedback) {
        if (feedback.is_downvote == true) {
            if (complaint) {
                await Complaint.findByIdAndUpdate(reqComplaint.id, { totalDownvotes: complaint.totalDownvotes - 1 }, { new: true, runValidators: true }); // Update upvote complaint
            } else {
                return res.status(404).json({ message: 'Complaint not found'});
            }    
    
            try {
                await Feedback.deleteOne({ userID: reqUser.userId, complaintID: reqComplaint.id, is_downvote: true });
    
                const responseFeedback = {
                    is_upvote: false,
                    is_downvote: false
                };
        
                res.status(200).json({ feedback: responseFeedback, totalDownvotes: complaint.totalDownvotes - 1 });
            } catch (err) {
                console.error('Error save upvote:', err);
                res.status(500).json({ message: 'Internal server error' });
            } 
        } else if (feedback.is_upvote == true) {
            res.status(409).json({ message: 'User already voted' });
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

            const responseFeedback = {
                is_upvote: newFeedback.is_upvote,
                is_downvote: newFeedback.is_downvote
            };

            res.status(200).json({ feedback: responseFeedback, totalDownvotes: complaint.totalDownvotes + 1 });
        } catch (err) {
            console.error('Error save upvote:', err);
            res.status(500).json({ message: 'Internal server error' });
        }    
    }
}

module.exports = { upvoteComplaint, downvoteComplaint }