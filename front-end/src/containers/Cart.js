import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GetCart from '../actions/GetCart';

class Cart extends Component{

	constructor() {
		super();
		this.makePayment = this.makePayment.bind(this);
	}

	componentDidMount(){
		console.log(this.props.auth);
		if(this.props.auth.token === undefined){
			// if the user has no token... they should not be here. Goodbye.
			// this.props.history.push('/login')
		}else{
			// the user does have a token, go get their cart!
			this.props.getCart(this.props.auth.token);
		}
	}

	makePayment() {
        var handler = window.StripeCheckout.configure({
            key: 'pk_test_aj8GszmxnsDvaNM10ZFt9ECA',
            locale: 'auto',
            token: (token) => {
                var theData = {
                    amount: 10 * 100,
                    stripeToken: token.id,
                    userToken: this.props.tokenData,
                }
                axios({
                    method: 'POST',
                    url: window.hostAdress'/stripe',
                    data: theData
                }).done((data) => {
                    console.log(data);
                    if (data.msg === 'paymentSuccess') {

                    }
                });
            }
        });
        handler.open({
            name: "Pay Now",
            description: 'Pay Now',
            amount: 10 * 100
        })
    }

	render(){
		console.log(this.props.cart);
		if(!this.props.cart.totalItems){
			return(
				// if this return occurs, the render is DONE
				<div>
					<h3>Your cart is empty! Get shopping!</h3>
				</div>
			)
		}
		return(
			<h1>Cart Page</h1>
		)
	}
}

function mapStateToProps(state){
	return{
		auth: state.auth,
		cart: state.cart
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		getCart: GetCart
	},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);