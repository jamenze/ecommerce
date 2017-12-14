import axios from 'axios';

export default function(){
	const ajaxPromise = axios.get(`${window.apiHost}/productlines/get`);
	return {
		type: "GET_PRODUCTLINES",
		// axios doesn't just return data, it returns:
		// headers, config, request, status, etc.
		// Our app ONLY cares about the data
		payload: ajaxPromise.data
	}
}