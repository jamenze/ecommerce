import axios from 'axios';

export default function(formData){
	// THIS IS TO BE REMOVED IN PROD
	// FOR DEV PURPOSES ONLY
	if(formData === "fake"){
		var axiosPromise = axios({
			method: "POST",
			url: `${window.apiHost}/fakelogin`,
			data: formData
		})		
	}else{
		axiosPromise = axios({
			method: "POST",
			url: `${window.apiHost}/login`,
			data: formData
		})
	}

	// console.log("Login action running")
	return {
		type: "AUTH_ACTION",
		payload: axiosPromise
	}
}