import React, { Component } from 'react'
// this is a container that knows abotu redux so...
import {connect} from 'react-redux';
// we need bindActionCreators because we have redux actions that will dispatch
import {bindActionCreators} from 'redux';
import LogoutAction from '../actions/LogoutAction';

class Logout extends Component{
  	componentDidMount(){
  		// run the logoutAction on load
  		this.props.logoutAction();
  		this.props.history.push('/')
  	}

	render(){
		return(
			<div>
				Logging out...
			</div>
		)
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		logoutAction: LogoutAction
	}, dispatch);
}

// export default Login;
export default connect(null, mapDispatchToProps)(Logout);
