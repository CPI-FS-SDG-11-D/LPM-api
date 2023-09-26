const express = require("express");
const router = express.Router();

const { loadComplaints, addComplaint } = require("../controller/complaint.controller");

router.get("/", async (_, res) => {
  try {
    const allComplaints = await loadComplaints();
    res.status(200).json(allComplaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
    try {
      const result = await addComplaint(req.body);
      console.log(result);
      res.status(201).redirect("/complaints");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;
