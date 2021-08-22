const mongoose = require('mongoose');

const EmergencySchema = mongoose.Schema({
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        description: {type: String, required: true},
        timestamp: {type: String, required: false},
        status: { type: Boolean, default: false },
        lat: {type: String, required: true},
        lng: {type: String, required: true},
        address: {type: String, required: true},
        created_at : { type: Date, default : Date.now()},
        user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
        uid : {type: String, required: true},
});

module.exports = mongoose.model("EmergencySchema", EmergencySchema);