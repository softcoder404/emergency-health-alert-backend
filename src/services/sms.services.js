require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_TOKEN);
class SMSService{


      static sendSMS(message,receiver){
                return new Promise((resolve,reject) => {
                        client.messages
                        .create({body: message, from: '+15704735993', to: receiver})
                        .then(result => resolve(result))
                        .catch(error => reject(error));
                }); 
        }


}

module.exports = {
        SMSService
}