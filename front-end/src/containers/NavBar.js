import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class NavBar extends Component{
	constructor(){
		super();
	}

	componentWillReceiveProps(newProps){

	}

	render(){
		if(this.props.auth.name !== undefined){
			// the user is logged in
			var rightMenuBar = [
				<li className="">Welcome, {this.props.auth.name}</li>,
				<li><Link to="/cart">(0) items in your cart | ($000)</Link></li>,
				<li><Link to="/logout">Logout</Link></li>
			]	
		}else{
			var rightMenuBar = [
			    <li><Link to="/login">Sign in</Link> or <Link to="/register">Create an account</Link></li>,
			    <li>(0) items in cart | ($0.00)</li>
			]
		}
		console.log(this.props.auth);
		return(
			<div id="navbar">
				<nav className="navbar navbar-fixed-top">
			  		<div className="container-fluid navbar-white">
			  			<div className="container">
				    		<ul className="nav navbar-nav">
				    			<li><Link to="/">Home</Link></li>
				    			<li><Link to="/shop">Shop</Link></li>
				    			<li><Link to="/about">About Us</Link></li>
				    			<li><Link to="/contact">Contact Us</Link></li>
				    		</ul>
				    	</div>
			    	</div>
			    	<div className="container-fluid navbar-default">
			    		<div className="container">
			    			<div className="nav navbar-header">
			    				ClassicModels Logo
			    			</div>
			    			<div className="nav navbar-nav pull-right">
			    				{rightMenuBar}
			    			</div>
			    		</div>
			    	</div>
			    </nav>
			</div>
		)
	}
}


function mapStateToProps(state){
	// state = RootReducer
	return{
		auth: state.auth
	}
}

export default connect(mapStateToProps)(NavBar);
// export default NavBar;