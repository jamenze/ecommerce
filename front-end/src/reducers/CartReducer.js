export default function(state = [], action){
	switch(action.type){
		case 'UPDATE_CART':
		case 'GET_CART':
			return action.payload.data;
		default:
			return state;
	}
	// if((action.type === 'UPDATE_CART') || (action.type === 'GET_CART')){
	// 	// var newState = {...state};
	// 	return action.payload.data;
	// }else{
	// 	return state;
	// }
}