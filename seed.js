const mongoose = require("mongoose");
const User = require("./app/models/User");
const Complaint = require("./app/models/Complaint");
const Feedback = require("./app/models/Feedback");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const url = process.env.URL_DATABASE_COMPASS || process.env.URL_DATABASE_ATLAS;

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
    complaints.push({
      userID: users[i]._id,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      keterangan: faker.lorem.paragraph(),
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
    complaints = await Complaint.find().select("_id");

    seedFeedback();
  }
}

let feedbacks = [];
async function seedFeedback() {
  for (let i = 0; i < users.length; i++) {
    const manyVote = faker.number.int({ min: 0, max: complaints.length - 1 });
    const array = [];
    for (let j = 0; j < manyVote; j++) {
      const randomComplaint = faker.number.int({
        min: 0,
        max: complaints.length - 1,
      });
      const isUpvote = faker.number.int({ min: 0, max: 1 });
      if (!array.includes(randomComplaint)) {
        feedbacks.push({
          userID: users[i]._id,
          complaintID: complaints[randomComplaint]._id,
          upvote: isUpvote ? 1 : 0,
          downvote: isUpvote ? 0 : 1,
          type_vote: isUpvote ? 1 : 0,
        });
        array.push(randomComplaint);
      }
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
