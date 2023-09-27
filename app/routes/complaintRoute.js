const express = require("express");
const router = express.Router();

const { loadComplaints } = require('../controllers/complaintController');

router.get("/", async (_, res) => {
    try {
      const allComplaints = await loadComplaints();
      res.status(200).json(allComplaints);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
module.exports = router;