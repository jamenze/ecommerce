import axios from 'axios';

export default function(){
	const ajaxPromise = axios.get(`${window.apiHost}/productlines/get`);
	return{
		type: "GET_PRODUCTLINES",
		// axios doens't just return the data, it returns:
		// headers, config, request, status, etc. Our app ONLY 
		// cares about teh data
		payload: ajaxPromise
	}
}