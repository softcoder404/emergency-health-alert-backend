

exports.formatPhoneNumber = phone => phone.substr(0,1) == '+' ? phone : '+234' + phone.substring(1);