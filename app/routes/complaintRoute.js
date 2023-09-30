const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");

router.get("/", complaintController.getComplaints);

router.get("/complaints", async (_, res) => {
  try {
    const allComplaints = await loadComplaints();
    res.status(200).json(allComplaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/complaint", async (req, res) => {
  try {
    const result = await addComplaint(req.body);
    console.log(result);
    res.status(201).redirect("/api/complaints");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/complaint/detail/:id", async (req, res) => {
  try {
    const complaint = await findComplaint(req.params.id);
    if (complaint === null) {
      return res.status(404).json({ message: "Complaint NOT Found." });
    }
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: "The Complaint NOT Found" });
  }
});

router.delete("/complaint/delete/:id", (req, res) => {
  try {
    const deletedComplaint = deleteComplaint(req.params.id);
    console.log(deletedComplaint);
    res.status(200).redirect("/api/complaints");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
