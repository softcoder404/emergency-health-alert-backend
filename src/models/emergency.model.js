const mongoose = require('mongoose');

const EmergencySchema = mongoose.Schema({
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        status: { type: String, default: 'Pending' },
        created_at : { type: Date, default : Date.now()},
        user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" } 
});

module.exports = mongoose.model("EmergencySchema", EmergencySchema);