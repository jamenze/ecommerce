import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


// Get the createStore method from the redux module
// as well as the applyMiddleWare method
// we always need createStore because that's where
// state lives.
import { createStore, applyMiddleware } from 'redux';

// createStore needs a reducer. More specifically,
// a root reducer.
import RootReducer from './reducers/RootReducers';

// we are going to need AJAX a lot. 
// We will use it in our Redux Actions which means..
// we need redux-promise.
import reduxPromise from 'redux-promise';

// We have set up Redux. Now we need a way to tell React about it.
// The Provider is the answer!
import { Provider } from 'react-redux';

// create the store... the ugly way
console.log(applyMiddleware(reduxPromise)(createStore));
const theStore = applyMiddleware(reduxPromise)(createStore)(RootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// the friendly way:
// const middleWare = applyMiddleware(reduxPromise);
// const storeWithMid = middleware(createStore);
// const theStore = storeWithMid(RootReducer);

// Hand render the Provider and hand Provider the store
// Put App INSIDE of the Provider, so that everything inside of APp,
// will know about the Provider/theStore

ReactDOM.render(
	<Provider store={theStore}>
		<App />
	</Provider>, 
	document.getElementById('root'
));
