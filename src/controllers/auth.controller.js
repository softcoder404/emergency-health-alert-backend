const apiResponse = require('../helpers/apiresponse.helper');
const {formatPhoneNumber} = require('../helpers/format_phone_number');
const UserSchema = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SMSService} = require('../services/sms.services');
const {generate6digit} = require('../helpers/generate_uuid');

exports.getUsers = (req, res) => {
    UserSchema.find().select('_id fullName phone matric hostel profile_url department level').exec().then(users => {
        return apiResponse.successResponseWithData(res,`${users.length} user's record found`, users);
    }).catch(error => {
        return apiResponse.serverErrorResponse(res, "unable to fetch users, an error occur.",error);
    });
}

exports.getSingleUser = (req, res) => {
    UserSchema.findById(req.params.id).exec().then(user => {
        return apiResponse.successResponseWithData(res,"User record fetched successfully.",user);
        
    }).catch(error => {
        return apiResponse.serverErrorResponse(res,"unable to fetch user record, an error occur.",error);
    });
}

exports.deleteUserAccount = (req, res) => {
    UserSchema.findByIdAndDelete(req.params.id).select("_id fullName phone matric hostel profile_url department level").exec().then(response => {
        return apiResponse.successResponseWithData(res,"User account deleted successfully.",response);
    }).catch(error => {
       return apiResponse.serverErrorResponse(res, "unable to delete user record, an error occur.",error);
    });
}

exports.updateUserAccount = (req, res) => {
    const {fullName, phone, matric, hostel, department, level,password} = req.body;
    if(!fullName || !phone || !matric || !hostel ||!department || !level){
            return apiResponse.validationErrorWithData(res,'All fields are required',{
                    required_fields: ['fullName','phone','matric','hostel','department','level']
            })
    }

    if(password){
        return apiResponse.validationErrorWithData(res,'Oops!, you can\'t update password',{
                required_fields: ['fullName','phone','matric','hostel','department','level']
        }) 
    }

    UserSchema.updateMany({
        _id: req.params.id
    }, {
        $set: {...req.body,profile_url:`https://eu.ui-avatars.com/api/?background=random&name=${fullName}`}
    }).exec().then(result => {
        UserSchema.findById(req.params.id).select('_id fullName phone matric hostel profile_url department level').exec().then(user => {
            return apiResponse.successResponseWithData(res,"User account updated successfully.",user);
        }).catch(err => {
           return apiResponse.serverErrorResponse(res,"unable to fetch updated record, try again.",err);
        });
    }).catch(error => {
       return apiResponse.serverErrorResponse(res,"unable to update user record, check your parameter.",error);
    });
}

exports.createUser = (req, res) => {
        let {fullName, phone, matric, password, hostel} = req.body;
        
        if(!fullName || !phone || !matric || !password || !hostel){
                return apiResponse.validationErrorWithData(res,'All fields are required!',{
                        required_fields: ['fullName','phone','matric','password','hostel']
                });
        }
        phone = formatPhoneNumber(phone);
        profile_url = `https://eu.ui-avatars.com/api/?background=random&name=${fullName}`
        //check if user exist
        UserSchema.find({
                matric: matric
        }).exec().then(result => {
                if (result.length > 0) {
                return apiResponse.unauthorizedResponse(res, "A user with this matric already exist!");
                } else {
                // create new user
                bcrypt.hash(password, 10, (err, encryptedPass) => {
                        if (err) {
                        return apiResponse.unauthorizedResponse(res,"password hash fail");
                        } else {
                        const user = new UserSchema({
                                _id: mongoose.Types.ObjectId(),
                                fullName: fullName,
                                phone: phone,
                                matric: matric,
                                password: encryptedPass,
                                hostel: hostel,
                                profile_url: profile_url,
                        })
                        user.save().then(result => {
                                return apiResponse.successResponseWithData(res,"new user created successfully",result);
                        }).catch(err => {
                        return apiResponse.serverErrorResponse(res,'server error occur',err);
                        })
                        }
                });
                }
        }).catch(err => {
                return apiResponse.serverErrorResponse(res,"an error occur while checking an existing user",err);
        })
}

exports.login = (req, res) => {
    UserSchema.findOne({
        matric: req.body.matric
    }).exec().then(user => {
        if (user.length < 1) {
            return apiResponse.unauthorizedResponse(res,'Auth fail!');
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return apiResponse.unauthorizedResponse(res,'Auth fail!');
            }
            if (result) {
                const token = jwt.sign({
                        matric: user.matric,
                        user_id: user._id,
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });

                return apiResponse.successResponseWithData(res,"User Logged In Successfully",{
                        token:token,
                        user: user
                });
            }
           return apiResponse.unauthorizedResponse(res,'Auth fail!');
        });
    }).catch(err => {
       return apiResponse.serverErrorResponse(res,'an error occur',err);
    })
}



exports.changePassword = (req, res) => {
        let {newPassword,confirmPassword} = req.body;
        const uid = req.params.id;

        if(!newPassword || !confirmPassword){
                return apiResponse.validationErrorWithData(res,'All fields are required!',{
                        required_fields: ['confirmPassword','newPassword']
                });
        }

        if(newPassword !== confirmPassword){
                return apiResponse.validationErrorWithData(res,'Password not match!');
        }


        bcrypt.hash(confirmPassword, 10, (err, encryptedPass) => {
                if (err) {
                return apiResponse.unauthorizedResponse(res,"password hash fail");
                } else {
                        UserSchema.findOneAndUpdate({_id: uid},{$set: {password: encryptedPass}}).exec().then(result => {
                        return apiResponse.successResponseWithData(res,"password updated successfully",result);
                }).catch(err => {
                return apiResponse.serverErrorResponse(res,'server error occur',err);
                })
                }
        });
      
}


exports.forgotPassword = (req, res) => {
        let {matric} = req.body;

        if(!matric ){
                return apiResponse.validationErrorWithData(res,'Matric field is required!');
        }

        //generate 6 digit token 
        const token = generate6digit();
        console.log(token);
        UserSchema.findOneAndUpdate({matric: matric},{ $set: {resetPasswordToken: token}}).exec().then(result => {

                SMSService.sendSMS(`Your password reset token: ${token}`,result.phone).then(onSent => {
                        return apiResponse.successResponseWithData(res,'Password reset token sent.',onSent);

                }).catch(err => {
                        return apiResponse.serverErrorResponse(res,'Oops! an error occur, try again.',err);
                })
        }).catch(err => {
                return apiResponse.serverErrorResponse(res,'Oops! an error occur, try again.',err);
        });
}

exports.verifyForgotPassword = (req, res) => {
        let {matric,token,newPassword} = req.body;

        if(!matric || !token || !newPassword ){
                return apiResponse.validationErrorWithData(res,'Matric fields are required!',{
                        required_fields: ['matric','token','newPassword']
                });
        }

        UserSchema.findOne({matric: matric}).select('resetPasswordToken _id').exec().then( user => {
                console.log(`user: ${user}`);
                if(user.resetPasswordToken !== token){
                        return apiResponse.validationErrorWithData(res,'Invalid token, try again!')
                }
                bcrypt.hash(newPassword, 10, (err, encryptedPass) => {
                        if (err) {
                        return apiResponse.unauthorizedResponse(res,"password hash fail");
                        } else {
                                UserSchema.findOneAndUpdate({matric: matric},{$set: {password: encryptedPass}}).exec().then(result => {
                                return apiResponse.successResponseWithData(res,"password updated successfully",result);
                        }).catch(err => {
                        return apiResponse.serverErrorResponse(res,'server error occur',err);
                        })
                        }
                });
        }).catch(err => {
                return apiResponse.serverErrorResponse(res,'Oops! server error occur, try again...',err);
        })
}