import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Col ,MenuItem} from 'react-bootstrap';

// this is a container that knows about redux
import { connect } from 'react-redux';

// we need bindActionCreators because we have redux actions that 
import { bindActionCreators } from 'redux';
import LoginAction from  '../actions/LoginAction';

class Login extends Component {
	constructor() {
		super();
		this.state = {
			error: ""
		}

		// if we need to use "this" in a non-lifecycle method 
		// (one we created) such as handleSubmit, we have to bind the method
		this.handleSubmit = this.handleSubmit.bind(this);
}

componentWillReceiveProps(newProps){
	if (this.props.auth.msg === "wrongPassword"){
			this.setState({
				error: "This password does not match."
			});
		} else if (newProps.auth.msg === "badUser"){
			this.setState({
				error: "We do not have an account for this email address."
			})
		} else if (newProps.auth.msg === "loginSuccess"){
			// user has logged in, move them on
			newProps.history.push('/');
		}
}

handleSubmit(event) {
	event.preventDefault();
	// console.dir(event.target);
	const email = event.target[0].value; // get the 0 element and get its value
	const password = event.target[1].value;
	const formData = {
		email: email,
		password: password
	}

	// can add some validation even though browser already provides it
	if(formData.email.length === 0){

	} else if (formData.password.length === 0) {
		error: "Password field cannot be empty"
	} else {
		this.props.loginAction(formData); 
	}
}

	render(){
		console.log(this.props.auth); // when we first arrive, this should display and be an empty array


		return(
			<div className="register-wrapper">
				<h1 className="text-danger">{this.state.error}</h1>
				<Form horizontal onSubmit={this.handleSubmit}>
					<FormGroup controlId="formHorizontalName" validationState={this.state.nameError}>
						<Col componentClass={ControlLabel} sm={2}>
							Email
						</Col>
						<Col sm={10}>
							<FormControl type="email" name="email" placeholder="Email" />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName" validationState={this.state.emailError}>
						<Col componentClass={ControlLabel} sm={2}>
							Password
						</Col>
						<Col sm={10}>
							<FormControl type="password" name="password" placeholder="Password" />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button bsStyle="success" bsSize="small" type="submit">
								Login
							</Button>
						</Col>
					</FormGroup>
				</Form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		// hand it an object
		loginAction: LoginAction // call it loginAction and bring it LoginAction
	}, dispatch); // send it the dispatch
}
	
//export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);


















