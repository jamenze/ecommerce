import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class ProductLines extends Component{
	constructor(){
		super();
		this.state = {
			productList: []
		}
	}


	componentDidMount(){
		const pl = this.props.match.params.productLine
		const url = `${window.apiHost}/productlines/${pl}/get`;
		axios.get(url)
		.then((response)=>{
			console.log(response);
			this.setState({
				productList: response.data
			})
		});
	}

	render(){
		// console.log(this.props);
		// console.log(this.props.pl)
		console.log(this.state.productList);
		const products = this.state.productList.map((product,index)=>{
			return (<div></div>)
		})
		var thisPL = this.props.pl.filter((obj)=>{
			return obj.productLine === this.props.match.params.productLine
		})
		if(thisPL.length === 0){
			var desc = ""
		}else{
			var desc = thisPL[0].textDescription
		}

		return(
			<div>
				<h1>Welcome to the {this.props.match.params.productLine} page</h1>
				<p>{desc}</p>
				<div className="products">
					{products}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state){
	return{
		pl: state.pl
	}
}

// export default ProductLines;
export default connect(mapStateToProps)(ProductLines)