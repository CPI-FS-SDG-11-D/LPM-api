const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

async function upvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    const complaint = await Complaint.findOne({ _id: reqComplaint.id }); // Find complain in database
    // const feedback = await Feedback.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id, }); // Find upvote in database

    // if (feedback) {
    //     return res.status(409).json({ message: 'User already voted' });
    // }

    // if (complaint) {
    //     await Complaint.findByIdAndUpdate(reqComplaint.id, { upvote: complaint.upvote + 1 }, { new: true, runValidators: true }); // Update upvote complaint
    // } else {
    //     return res.status(404).json({ message: 'Complaint not found' });
    // }

    // try {
    //     const newUpvote = new Upvote({ userID: reqUser.userId, complaintID: reqComplaint.id, count: 1 })
    //     await newUpvote.save();

    //     res.status(200).json({ upvote: complaint.upvote + 1 });
    // } catch (err) {
    //     console.error('Error save upvote:', err);
    //     res.status(500).json({ message: 'Internal server error' });
    // }
}

async function downvoteComplaint(req, res){
    const reqUser = req.user;
    const reqComplaint = req.params;
    const complaint = await Complaint.findOne({ _id: reqComplaint.id }); // Find complain in database
    // const downvote = await Downvote.findOne({ userID: reqUser.userId, complaintID: reqComplaint.id, }); // Find downvote in database

    // if (downvote) {
    //     return res.status(409).json({ message: 'User already voted' });
    // }

    // if (complaint) {
    //     await Complaint.findByIdAndUpdate(reqComplaint.id, { downvote: complaint.downvote + 1 }, { new: true, runValidators: true }); // Update downvote complaint
    // } else {
    //     return res.status(404).json({ message: 'Complaint not found' });
    // }

    // try {
    //     const newDownvote = new Downvote({ userID: reqUser.userId, complaintID: reqComplaint.id, count: 1 })
    //     await newDownvote.save();

    //     res.status(200).json({ upvote: complaint.upvote + 1 });
    // } catch (err) {
    //     console.error('Error save downvote:', err);
    //     res.status(500).json({ message: 'Internal server error' });
    // }
}

module.exports = { upvoteComplaint, downvoteComplaint }