import axios from 'axios';

export default function(formData) {
	var axiosPromise = axios({
		method: "POST",
		url: `${window.apiHost}/login`,
		data: formData
	})
	console.log("Login action running");
	return {
		// force the action to wait before dispatching
		type: "AUTH_ACTION", // what type of action to do
		payload: axiosPromise // the object that gets sent out to all the reducers

	}
}