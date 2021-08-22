const apiResponse = require('../helpers/apiresponse.helper');
const EmergencySchema = require("../models/emergency.model");
const mongoose = require("mongoose");
const {SMSService} = require('../services/sms.services');
exports.getAllEmergency = (req, res) => {
    EmergencySchema.find().populate('user').exec().then(emergency => {
        return apiResponse.successResponseWithData(res,`${emergency.length} emergency's record found`, emergency);
    }).catch(error => {
        return apiResponse.serverErrorResponse(res, "unable to fetch emergency, an error occur.",error);
    });
}

exports.getSingleEmergency = (req, res) => {
    EmergencySchema.findById(req.params.id).populate('user').exec().then(emergency => {
        return apiResponse.successResponseWithData(res,"Emergency record fetched successfully.",emergency);
        
    }).catch(error => {
        return apiResponse.serverErrorResponse(res,"unable to fetch emergency record, an error occur.",error);
    });
}

exports.getAllUserEmergency = (req, res) => {
        EmergencySchema.find({uid: req.params.id}).populate('user').exec().then(emergency => {
            return apiResponse.successResponseWithData(res,"Emergency record fetched successfully.",emergency ?? []);
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

        const {user_id, lat, lng, address, title,description,timestamp } = req.body;
        
        if(!user_id || !lat || !lng || !address || !title || !description || !timestamp){
                return apiResponse.validationErrorWithData(res,'All fields are required!',{
                        required_fields: ['user_id','lat','lng','address','title','description','timestamp']
                });
        }
        // create new emergency
        const emergency = new EmergencySchema({
                _id: mongoose.Types.ObjectId(),
                uid: user_id,
                user: user_id,
                lat: lat,
                lng: lng,
                address: address,
                title: title,
                description: description,
                timestamp: timestamp,
        });
        emergency.save().then(result => {
                SMSService.sendSMS(`EMERGENCY REPORT.\nThere is an emergency report at ${address}. check your dashboard for more info`,['+2347061101691']).then(onSent => {
                    return apiResponse.successResponseWithData(res,"new emergency alert created successfully",result);

                }).catch(err => {
                    return apiResponse.serverErrorResponse(res,'Oops! an error occur, try again.',err);
                });
        }).catch(err => {
                return apiResponse.serverErrorResponse(res,'server error occur',err);
        });       
}


exports.deleteAllEmergency = (req, res) => {
    EmergencySchema.deleteMany().exec().then(response => {
        return apiResponse.successResponseWithData(res," All Emergency record deleted successfully.",response);
    }).catch(error => {
       return apiResponse.serverErrorResponse(res, "unable to delete emergency record, an error occur.",error);
    });
}
