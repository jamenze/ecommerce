import React, { Component } from 'react';
import {Form, FormGroup, ControlLabel, FormControl, Button, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
// we need bindActionCreators so that we can correlate an action to the dispatcher
// It's down below inside of mapDispatchToProps
import { bindActionCreators } from 'redux';
import AuthAction from '../actions/AuthAction';

class Register extends Component{
	constructor(){
		super();
		this.state = {
			error: ""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillReceiveProps(newProps){
		console.log(this.props);
		console.log(newProps);
		if(newProps.auth.msg === "registerSuccess"){
			// the user was inserted. 
			// We have the token and name safely in the auth reducer.
			// Move them to the home page.
			this.props.history.push('/');
			// line above: tell teh router to move them forward to /
		}else if(newProps.auth.msg === "userExists"){
			this.setState({
				error: "This email address is already registered. Please login or use a different email."
			})
		}
	}


	handleSubmit(event){
		event.preventDefault();
		var formData = {
			name: event.target[0].value,
			email: event.target[1].value,
			accountType: event.target[2].value,
			password: event.target[3].value,
			city: event.target[4].value,
			state: event.target[5].value,
			salesRep: event.target[6].value
		}

		if(formData.name === ""){
			this.setState({
				error: "Name field cannot be empty.",
				// type: "error"
			})
		}else{
			this.props.authAction(formData);
		}
		// console.log(formData);
	}

	render(){
		// console.log(this.props.auth);
		if(this.state.type === "error"){
			// var msgClass = "text-dagner"
		}
		return(
			<Form horizontal onSubmit={this.handleSubmit}>
				<h2 className="bg-danger">{this.state.error}</h2>
	        <FormGroup controlId="formHorizontalError" validationState={this.state.nameError}>
	            <Col componentClass={ControlLabel} sm={2}>
	                Name
	            </Col>
	            <Col sm={10}>
	                <FormControl type="text" name="fullName" placeholder="Full Name" />
	            </Col>
	        </FormGroup>
	        <FormGroup controlId="formHorizontalName" validationState={this.state.emailError}>
	            <Col componentClass={ControlLabel} sm={2}>
	                Email
	            </Col>
	            <Col sm={10}>
	                <FormControl type="email" name="email" placeholder="Email" />
	            </Col>
	        </FormGroup>
	        <FormGroup controlId="formHorizontalEmail">
	            <Col componentClass={ControlLabel} sm={2}>
	                Account Type
	            </Col>
	            <Col sm={10}>
	                <FormControl type="text" name="type" value="customer" disabled />
	            </Col>
	        </FormGroup>
	        <FormGroup controlId="formHorizontalPass">
	            <Col componentClass={ControlLabel} sm={2}>
	                Password
	            </Col>
	            <Col sm={10}>
	                <FormControl type="password" name="password" placeholder="Password" />
	            </Col>
	        </FormGroup>
	        <FormGroup controlId="formHorizontalCity">
	            <Col componentClass={ControlLabel} sm={2}>
	                City
	            </Col>
	            <Col sm={10}>
	                <FormControl type="text" name="city" placeholder="City" />
	            </Col>
	        </FormGroup>
	        <FormGroup controlId="formHorizontalState">
	            <Col componentClass={ControlLabel} sm={2}>
	                State
	            </Col>
	            <Col sm={10}>
	                <FormControl type="text" name="state" placeholder="State" />
	            </Col>
	        </FormGroup>
	        <FormGroup controlId="formHorizontalEmp">
	            <Col componentClass={ControlLabel} sm={2}>
	                Sales Rep
	            </Col>
	            <Col sm={10}>
	                <FormControl type="text" name="employee" placeholder="Employee you worked with" />
	            </Col>
	        </FormGroup>
	        <FormGroup>
	            <Col smOffset={2} sm={10}>
	                <Button bsStyle="primary" bsSize="small" type="submit">
	                    Register
	                </Button>
	            </Col>
	        </FormGroup>
	    </Form>			
		)
	}
}

function mapStateToProps(state){
	// state = RootReducer
	return{
		// key = this.props.KEY will be accesible to this component
		// value = property of RootReducer
		auth: state.auth
	}
}

function mapDispatchToProps(dispatch){
	// dispatch is teh thing that takes any action
	// and sends it out to all teh reducers	
	return bindActionCreators({
		authAction: AuthAction
	}, dispatch)
}

// export default Register;
// console.log(connect);
// var connectWithReduxFunction = connect(mapStateToProps,mapDispatchToProps);
// var componentThatKnowsAboutRedux = connectWithReduxFunction(Register)
export default connect(mapStateToProps,mapDispatchToProps)(Register);
// export default componentThatKnowsAboutRedux;

