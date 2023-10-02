const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { 
        required: true,
        type: String
    },
    email: { 
        required: true,
        unique: true,
        type: String,
    },
    password: { 
        required: true,
        type: String
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);