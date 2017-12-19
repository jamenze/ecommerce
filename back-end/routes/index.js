var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');
var stripe = require('stripe')(config.stripeKey);
var connection = mysql.createConnection(config)
connection.connect();

// include bcrpyt for hasing and checking password
var bcrypt = require('bcrypt-nodejs');
// include rand-token for generating a random token
var randToken = require('rand-token');
// console.log(randToken.uid(100));

// router.all('*', (req, res, next)=>{

// });

router.post('/fakelogin', (req, res, next)=>{
	const getFirstUser = `SELECT * from users limit 1;`;
	connection.query(getFirstUser, (error, results)=>{
		if(error){
			throw error;
		}
		console.log(results);
		res.json({
			msg: "loginSuccess",
			token: results[0].token,
			name: results[0].email
		});
	})
});

router.post('/login', (req, res, next)=>{
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;

	const checkLoginQuery = `SELECT * FROM users 
		INNER JOIN customers ON users.cid = customers.customerNumber
		WHERE users.email = ?`;
	connection.query(checkLoginQuery, [email], (error, results)=>{
		if(error){
			throw error; //dev only
		}
		if(results.length === 0){
			// this user does not exist. Goodbye.
			res.json({
				msg: 'badUser'
			})
		}else{
			// this email is valid, see if the password is...
			// password is the english they gave us on the form
			// results[0].password is what we have for this user in the DB
			const checkHash = bcrypt.compareSync(password, results[0].password)
			const name = results[0].customerName;
			if(checkHash){
				// these are the droids we're looking for.
				// create a new token.
				// update their row in teh DB with the token
				// send some json back to react/ajax/axios
				const newToken = randToken.uid(100);
				const updateToken = `UPDATE users SET token = ?
					WHERE email = ?`
				connection.query(updateToken,[newToken, email],(error)=>{
					if(error){
						throw error;
					}else{
						res.json({
							msg: "loginSuccess",
							token: newToken,
							name: name
						});						
					}
				})
			}else{
				// you dont want to sell me deathsticks. You want to go home
				// and rethink your life.
				res.json({
					msg: "wrongPassword"
				}) 
			}
		}
	})

	// res.json(req.body);
});

router.post('/register', (req,res,next)=>{
	console.log(req.body);
	// res.json(req.body);
	const userData = req.body;

	// const nameAsArray = req.body.name.split("");
	// const firstName = nameAsArray[0]

	// Express just got a post request to /register. This must be
	// from our react app. Specifically, the /register form.
	// This means, someone is trying to register. We have their data
	// inside of userData.
	// We need to insert their data into 2 tables:
	// 1. Users.
	//  - Users table needs their customer ID from the customers table
	//  - password, which needs to be hashed
	//  - email
	//  - arbitraty token which Express will create
	// 2. Customers.
	// - Name, city, state, salesRep, creditLimit
	// FIRST query... check to see if the user is already in users.
	// - if they are, res.json({msg:"userExists"})
	// - if they aren't...
	//   - insert user into customers FIRST (because we need CID for users)
	//   - insert user into users
	//   - res.json({msg:"userInserted", token: token, name: name})
	// FIRST check to see if user exists. We will use email.
	const checkEmail = new Promise((resolve, reject) =>{
		const checkEmailQuery = `SELECT * FROM users WHERE email = ?;`;
		connection.query(checkEmailQuery,[userData.email],(error, results)=>{
			if (error) { 
				throw error; //for development
				// reject(error) //in production
			}else if(results.length > 0){
				// user exists already. goodbye.
				reject({
					msg: "userExists"
				})
			}else{
				// no error. no user. resolve (we dont care about results)
				resolve()
			}
		});
	})
	checkEmail.then(
		// code to run if our checkEmail resolves.
		()=>{
			console.log("User is not in the db.")
			const insertIntoCust = `INSERT INTO customers
			(customerName, city, state, salesRepEmployeeNumber, creditLimit)
				VALUES
			(?,?,?,?,?)`;
			connection.query(insertIntoCust,[userData.name,userData.city,userData.state,1337,100000],(error, results)=>{
				if(error){
					console.log(error);
					throw error;
				}
				// get the customer ID that was JUST inseterd (results)
				const newID = results.insertId;
				// Set up a random string for this user's token
				// We will store it in teh DB
				const token = randToken.uid(60);
				// hashSync will create a blowfish/crypt (something evil) 
				// hash we will insert into the DB
				const hash = bcrypt.hashSync(userData.password);
				console.log(newID);
				const insertUsers = `INSERT INTO users
				(cid,type,password,token,email)
					VALUES
				(?,?,?,?,?);`;
				connection.query(insertUsers,[newID,'customer',hash,token,userData.email],(error,results)=>{
					if(error){
						throw error; //Dev only
					}else{
						// If we get this far... this is goign to be
						// whats inside of the authReducer.
						res.json({
							token: token,
							name: userData.name,
							msg: "registerSuccess"
						})
					}
				})
			});
		}
	).catch(
	// code to run if checkEmail rejects
		(error)=>{
			console.log(error);
			res.json(error);
		}
	)
})

router.get('/productlines/get', (req, res, next)=>{
	const selectQuery = `SELECT * FROM productlines`;
	connection.query(selectQuery,(error, results)=>{
		if(error){
			throw error; //dev only
		}else{
			res.json(results)
		}
	})
});

router.get('/productlines/:productline/get',(req, res, next)=>{
	const pl = req.params.productline
	var plQuery = `SELECT * FROM productlines
		INNER JOIN products ON productlines.productLine = products.productLine
		WHERE productlines.productline = ?` 
	connection.query(plQuery,[pl],(error,results)=>{
		if (error){
			throw error //dev only
		}else{
			res.json(results);
		}
	})
});

router.post('/getCart', (req,res,next)=>{
	const userToken = req.body.token;
	const getUidQuery = `SELECT id from users WHERE token = ?;`;
	connection.query(getUidQuery,[userToken],(error, results)=>{
		if(error){
			throw error; //dev only
		}else if(results.length === 0){
			// THIS TOKEN IS BAD. USER IS CONFUSED OR A LIAR
			res.json({
				msg:"badToken"
			});
		}else{
			// Get the user's id for the last query
			const uid = results[0].id;
			// this is a good token. I know who this is now. 	
			const getCartTotals = `SELECT SUM(buyPrice) as totalPrice, count(buyPrice) as totalItems 
				FROM cart
				INNER JOIN products ON products.productCode = cart.productCode
				WHERE cart.uid = ?;`;
			connection.query(getCartTotals,[uid],(error,cartResults)=>{
				if(error){
					throw error;
				}else{
					// res.json(cartResults);
					const getCartProducts =`SELECT * FROM cart
						INNER JOIN products on products.productCode = cart.productCode
						WHERE uid = ?`;
					connection.query(getCartProducts,[uid],(error, cartContents)=>{
						if(error){
							throw error; //dev onlhy
						}else{
							var finalCart = cartResults[0];
							finalCart.products = cartContents;
							res.json(finalCart)
						}
					})
				}
			})
		}
	});
});

router.post('/updateCart', (req, res, next)=>{
	const productCode = req.body.productCode;
	const userToken = req.body.userToken;
	// FIRST... is this even a valid token?
	const getUidQuery = `SELECT id from users WHERE token = ?;`;
	connection.query(getUidQuery,[userToken],(error, results)=>{
		if(error){
			throw error; //dev only
		}else if(results.length === 0){
			// THIS TOKEN IS BAD. USER IS CONFUSED OR A LIAR
			res.json({
				msg:"badToken"
			});
		}else{
			// Get the user's id for the last query
			const uid = results[0].id;
			// this is a good token. I know who this is now. 
			const addToCartQuery = `INSERT into cart (uid, productCode)
				VALUES (?,?);`;
			connection.query(addToCartQuery,[uid,productCode],(error)=>{
				if(error){
					throw error;
				}else{
					// the insert worked.
					// get the sum of their products and their total
					const getCartTotals = `SELECT ROUND(SUM(buyPrice),2) as totalPrice, count(buyPrice) as totalItems 
						FROM cart
						INNER JOIN products ON products.productCode = cart.productCode
						WHERE cart.uid = ?;`;
					connection.query(getCartTotals,[uid],(error,cartResults)=>{
						if(error){
							throw error;
						}else{
							var finalCart = cartResults[0];
							// we dont care about their products array on update
							// we only care about it on the /cart page.
							// so returning an empty products array is safe.
							// it WILL be updated when they get to the /cart page.
							finalCart.products = [];
							res.json(finalCart);
						}
					})
				}
			});
		}
	});

	// res.json(req.body)
});

router.post('/stripe',(req, res, next)=>{
	// Bring in vars from the ajax request
	const userToken = req.body.userToken;
	console.log(userToken);
	const stripeToken = req.body.stripeToken;
	const amount = req.body.amount;
	// stripe module required above, is assocaited with our secretkey.
	// it has a charges object which has multiple methods.
	// the one we want, is create.
	// create takes 2 args:
	// 1. object (stripe stuff)
	// 2. function to run when done
	stripe.charges.create({
		amount: amount,
		currency: 'usd',
		source: stripeToken,
		description: "Charges for classicmodels"
	},
	(error, charge)=>{
		// stripe, when the charge has been run,
		// runs this callback, and sends it any errors, and the charge object
		if(error){
			res.json({
				msg: error
			})
		}else{
			// Insert stuff from cart that was just paid into:
			// - orders
			const getUserQuery = `SELECT users.id, users.cid,cart.productCode,products.buyPrice, COUNT(cart.productCode) as quantity FROM users 
				INNER JOIN cart ON users.id = cart.uid
				INNER JOIN products ON cart.productCode = products.productCode
			WHERE token = ?
			GROUP BY cart.productCode`
			console.log(userToken)
			console.log(getUserQuery);
			connection.query(getUserQuery, [userToken], (error2, results2)=>{
				console.log("==========================")
				console.log(results2)
				console.log("==========================")
				const customerId = results2[0].cid;
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%")
				console.log(customerId)
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%")
				const insertIntoOrders = `INSERT INTO orders
					(orderDate,requiredDate,comments,status,customerNumber)
					VALUES
					(?,?,'Website Order','Paid',?)`
					connection.query(insertIntoOrders,[Date.now(),Date.now(),customerId],(error3,results3)=>{
						console.log(results3)
						const newOrderNumber = results3.insertId;
						// results2 (the select query above) contains an array of rows. 
						// Each row has the uid, the productCOde, and the price
						// map through this array, and add each one to the orderdetails tabl

						// Set up an array to stash our promises inside of
						// After all the promises have been created, we wil run .all on this thing
						var orderDetailPromises = [];
						// Loop through all the rows in results2, which is...
						// a row for every element in the users cart.
						// Each row contains: uid, productCode,BuyPrice
						// Call the one we're on, "cartRow"
						results2.map((cartRow)=>{
							// Set up an insert query to add THIS product to the orderdetails table
							var insertOrderDetail = `INSERT INTO orderdetails
								(orderNumber,productCode,quantityOrdered,priceEach,orderLineNumber)
								VALUES
								(?,?,?,?,1)`
							// Wrap a promise around our query (because queries are async)
							// We will call resolve if it succeeds, call reject if it fails
							// Then, push the promise onto the array above
							// So that when all of them are finished, we know it's safe to move forward

							const aPromise = new Promise((resolve, reject) => {
								connection.query(insertOrderDetail,[newOrderNumber,cartRow.productCode,cartRow.quantity, cartRow.buyPrice],(error4,results4)=>{
									// another row finished.
									if (error4){
										reject(error4)
									}else{
										resolve(results4)
									}
								})
							})
							orderDetailPromises.push(aPromise);
						})
						// When ALL the promises in orderDetailPromises have called resolve...
						// the .all function will run. It has a .then that we can use
						Promise.all(orderDetailPromises).then((finalValues)=>{
							console.log("All promises finished")
							console.log(finalValues)
							const deleteQuery = `
								DELETE FROM cart WHERE uid = ${results2[0].id}
							`
							connection.query(deleteQuery, (error5, results5)=>{
								// - orderdetails
								// Then remove it from cart
								res.json({
									msg:'paymentSuccess'
								})
							})
						});

					})
			});

		}
	});
})


module.exports = router;
