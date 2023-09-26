const mongoose = require("mongoose");
const UserModel = require("../model/user.model");

const loadUsers = () => {
  return UserModel.find();
};

const addUser = (input) => {
    UserModel.insertMany(input);
}

module.exports = { loadUsers, addUser }