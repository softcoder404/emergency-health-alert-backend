const apiResponse = require('../helpers/apiresponse.helper');
const EmergencySchema = require("../models/emergency.model");
const mongoose = require("mongoose");

exports.getAllEmergency = (req, res) => {
    EmergencySchema.find().populate('user').select('_id title user created_at status').exec().then(emergency => {
        return apiResponse.successResponseWithData(res,`${emergency.length} emergency's record found`, emergency);
    }).catch(error => {
        return apiResponse.serverErrorResponse(res, "unable to fetch emergency, an error occur.",error);
    });
}

exports.getSingleEmergency = (req, res) => {
    EmergencySchema.findById(req.params.id).populate('user').select('_id title user created_at status').exec().then(emergency => {
        return apiResponse.successResponseWithData(res,"Emergency record fetched successfully.",emergency);
        
    }).catch(error => {
        return apiResponse.serverErrorResponse(res,"unable to fetch emergency record, an error occur.",error);
    });
}

exports.getAllUserEmergency = (req, res) => {
        EmergencySchema.find({user: req.params.id}).populate('user').select('_id title user created_at status').exec().then(emergency => {
            return apiResponse.successResponseWithData(res,"Emergency record fetched successfully.",emergency);
        }).catch(error => {
            return apiResponse.serverErrorResponse(res,"unable to fetch emergency record, an error occur.",error);
        });
    }

exports.deleteEmergency = (req, res) => {
    EmergencySchema.findByIdAndDelete(req.params.id).select("_id user status title").exec().then(response => {
        return apiResponse.successResponseWithData(res,"Emergency account deleted successfully.",response);
    }).catch(error => {
       return apiResponse.serverErrorResponse(res, "unable to delete emergency record, an error occur.",error);
    });
}

exports.createAlertEmergency = (req, res) => {

        const {title, user_uid} = req.body;
        
        if(!title || !user_uid){
                return apiResponse.validationErrorWithData(res,'All fields are required!',{
                        required_fields: ['title','user_uid']
                });
        }
       
        // create new emergency
        const user = new EmergencySchema({
                _id: mongoose.Types.ObjectId(),
                title: title,
                user: user_uid,
        });
        user.save().then(result => {
                return apiResponse.successResponseWithData(res,"new emergency alert created successfully",result);
        }).catch(err => {
                return apiResponse.serverErrorResponse(res,'server error occur',err);
        });       
}
