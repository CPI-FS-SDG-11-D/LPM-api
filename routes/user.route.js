const express = require("express");
const router = express.Router();

const { loadUsers, addUser } = require("../controller/user.controller");

router.get("/", async (_, res) => {
  try {
    const allUsers = await loadUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
    try {
      const result = await addUser(req.body);
      console.log(result);
      res.status(201).redirect("/users");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;
