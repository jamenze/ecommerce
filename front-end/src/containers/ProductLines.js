import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ProductRow from '../components/ProductRow';
import { bindActionCreators } from 'redux';
import UpdateCart from '../actions/UpdateCart';

class ProductLines extends Component{
	constructor(){
		super();
		this.state = {
			productList: []
		}
		this.getProducts = this.getProducts.bind(this);
	}

	getProducts(props){
		const pl = props.match.params.productLine
		const url = `${window.apiHost}/productlines/${pl}/get`;
		axios.get(url)
		.then((response)=>{
			// console.log(response);
			this.setState({
				productList: response.data
			})
		});		
	}

	componentDidMount(){
		this.getProducts(this.props);
	}

	componentWillReceiveProps(nextProps){
		this.getProducts(nextProps);
	}

	render(){
		// console.log(this.props);
		// console.log(this.props.pl)
		// console.log(this.state.productList);
		const products = this.state.productList.map((product,index)=>{
			return (
				<ProductRow 
					key={index}
					product={product}
					addToCart={this.props.updateCart}
					token={this.props.auth.token}
				/>
			)
		})
		var thisPL = this.props.pl.filter((obj)=>{
			return obj.productLine === this.props.match.params.productLine
		})
		if(thisPL.length === 0){
			var desc = ""
		}else{
			desc = thisPL[0].textDescription
		}

		return(
			<div>
				<h1>Welcome to the {this.props.match.params.productLine} page</h1>
				<p>{desc}</p>
				<div className="products">
					<table className="table table-striped">
						<thead>
							<tr>
								<th className="table-head">Product Name</th>
								<th className="table-head">Model Scale</th>
								<th className="table-head">Made by</th>
								<th className="table-head">Description</th>
								<th className="table-head">In Stock</th>
								<th className="table-head">Your Price!</th>
								<th className="table-head">MSRP</th>
							</tr>
						</thead>
						<tbody>
							{products}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state){
	return{
		pl: state.pl,
		auth: state.auth
	}
}

// We need access to the updateCart action
function mapDispatchToProps(dispatch){
	return bindActionCreators({
		updateCart: UpdateCart
	}, dispatch)
}

// export default ProductLines;
export default connect(mapStateToProps, mapDispatchToProps)(ProductLines)