// A reducer is a FUNCTION that returns a piece of state

export default function(state = [], action){
	if(action.type === 'AUTH_ACTION'){
		// var newState = {...state};
		// I'm going to update. I care about this action.
		return action.payload.data;
	}else{
		// I dont care about this action. I'm going to return what I already had.
		return state;
	}
	console.log(action);
	
}