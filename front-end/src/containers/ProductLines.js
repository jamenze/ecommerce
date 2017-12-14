import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProductLines extends Component {

	render() {
		console.log(this.props);
		return(
			// whatever's in that param is going to be in the props.match
			<h1>Welcome to the {this.props.match.params.productLine} page</h1>
		)

	}

}

function mapStateToProps(state) {
	return {
		pl: state.pl
	}
}

// export default ProductLines;
export default connect(mapStateToProps)(ProductLines)