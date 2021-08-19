const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        isAdmin: {type: Boolean, default: false },
        fullName: { type: String, required: true },
        matric: { type: String, required: true },
        phone: { type: String, required: true },
        hostel: { type: String, required: true },
        password: { type: String, required: true },
        department: { type: String, required: false, default: "Department" },
        level: { type: String, required: false, default: "Level" },
        profile_url: { type: String, default: "https://eu.ui-avatars.com/api/?background=random&name=UserName" },
        resetPasswordToken: {type: String, default: 'nil'}
});

module.exports = mongoose.model("UserSchema", UserSchema);