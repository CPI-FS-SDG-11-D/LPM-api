require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./app/models/User");
const Complaint = require("./app/models/Complaint");
const Feedback = require("./app/models/Feedback");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const url = process.env.URL_DATABASE;

// Connect to the database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Drop all collections
mongoose.connection.dropDatabase();

const default_password = "password";

seedUser();
let users = [];
async function seedUser() {
  const hashedPassword = await bcrypt.hash(
    default_password || faker.internet.password(),
    10
  );
  // Seed users
  for (let i = 0; i < 10; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashedPassword,
    });
  }

  // Insert users
  User.insertMany(users)
    .then(() => {
      console.log("Users seeded");
      getUsers();
    })
    .catch((err) => {
      throw err;
    });
  async function getUsers() {
    users = await User.find().select("_id");

    seedComplaint();
  }
}

let complaints = [];
async function seedComplaint() {
  for (let i = 0; i < 5; i++) {
    const usersUpvote = faker.number.int({ min: 0, max: users.length - 1 });
    complaints.push({
      userID: users[i]._id,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement([
        "belum dimulai",
        "sedang berjalan",
        "tertunda",
        "selesai",
        "nonaktif",
      ]),
      totalUpvotes: usersUpvote,
      totalDownvotes: users.length - usersUpvote,
      urlComplaint: faker.image.urlPlaceholder({ width: 128, height: 128, backgroundColor: '000000', textColor: 'FF0000', format: 'png', text: 'lorem ipsum' })
    });
  }

  // Insert complaints
  Complaint.insertMany(complaints)
    .then(() => {
      console.log("Complaints seeded");

      getComplaints();
    })
    .catch((err) => {
      throw err;
    });
  async function getComplaints() {
    complaints = await Complaint.find().select(
      "_id totalUpvotes totalDownvotes"
    );

    seedFeedback();
  }
}

let feedbacks = [];
async function seedFeedback() {
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < complaints.length; j++) {
      const isUpvote =
        faker.number.int({ min: 0, max: 1 }) === 1 ? true : false;

      feedbacks.push({
        userID: users[i]._id,
        complaintID: complaints[j]._id,
        is_upvote: isUpvote,
        is_downvote: !isUpvote,
      });
    }
  }

  // Insert feedbacks
  Feedback.insertMany(feedbacks)
    .then(() => {
      console.log("Feedbacks seeded");

      process.kill(0);
    })
    .catch((err) => {
      throw err;
    });
}
