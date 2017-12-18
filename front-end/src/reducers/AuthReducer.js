// A reducer is a FUNCTION that returns a peice of state
// I specifically manage, the user's Name, token, and last message.
// If you want to change me, you need to add a case/else if

export default function(state = [], action){
	switch (action.type){
		case 'AUTH_ACTION':
			console.log(action.payload);
			// var newState = {...state};
			// I'm going to update. I care about this action.
			return action.payload.data;
		case 'LOGOUT':
			return [];
		default:
			return state;			
	}
	// if(action.type === 'AUTH_ACTION'){
	// 	return action.payload.data;
	// }else if(action.type === "LOGOUT"){
	// 	return [];
	// }else{
	// 	// I dont care about this action. I'm going to return what I already had.
	// 	return state;
	// }

}