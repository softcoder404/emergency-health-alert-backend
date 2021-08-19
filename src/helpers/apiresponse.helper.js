exports.successResponse = (res, msg)=> {
	let data = {
		success: true,
		message: msg
	};
	return res.status(200).send(data);
};

exports.successResponseWithData = (res, msg, data) =>{
	let resData = {
		success: true,
		message: msg,
		data: data
	};
	return res.status(200).send(resData);
};



exports.serverErrorResponse = (res, msg,err) =>{
	let data = {
		success: false,
		message: msg,
		error: err
	};
	return res.status(500).send(data);
};

exports.notFoundResponse = (res, msg)=> {
	let data = {
		success: false,
		message: msg,
	};
	return res.status(404).send(data);
};

exports.validationErrorWithData = (res, msg, data) => {
	var resData = {
		success: false,
		message: msg,
		data: data
	};
	return res.status(400).send(resData);
};

exports.unauthorizedResponse =  (res, msg)=> {
	var data = {
		success: false,
		message: msg,
	};
	return res.status(401).send(data);
};