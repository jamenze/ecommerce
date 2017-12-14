var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');
var connection = mysql.createConnection(config)
connection.connect();

// include bcrpyt for hasing and checking password
var bcrypt = require('bcrypt-nodejs');
// include rand-token for generating a random token
var randToken = require('rand-token');
// console.log(randToken.uid(100));

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

router.get('/productlines/:productline/get'),(req, res, next)=>{
	const pl = req.params.productline
	var plQuery = `SELECT * FROM productlines
		INNER JOIN products ON productlines.product = products.productline
		WHERE productLines.productline = ?`
	connection.query(plQuery,[pl],(error, results)=>{
		if (error) {
			throw error // dev only
		} else {
			res.json(results);
		}
	})
});


module.exports = router;