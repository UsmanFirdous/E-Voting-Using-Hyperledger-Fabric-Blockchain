var express = require('express');
var app = express();
const layout = require('express-layout')

const validator = require('express-validator')

const bodyParser = require('body-parser')
app.use(bodyParser.json());
//const urlencoded=app.use(bodyParser.urlencoded({ extended: true }));
const formidable = require('formidable');
const multer = require('multer');
const uniqueString = require('unique-string');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
var axios= require('axios');
const session = require('express-session');

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
// app.get('/',function(req,res){
// 	res.sendFile(__dirname + "/index.html");
// });
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
// (async () => {

// 	let response= await axios({
// 			method: "get",
// 			url: 'http://192.168.1.165:3000/getHash',
// 			timeout: 10000
// 		});
// 	let hash=response.data;
// 	console.log("Hash from mining node:",hash);
	
// 	})();
require('./models/Admin');
const Admin = mongoose.model('admin');
const routes = require('./routes');
app.use('/',routes);

app.get('/login', (req, res) => {
	if(req.session.email)
	{
		res.redirect('http://localhost:3001/welcom');
	}
	else if(req.session.halkano)
	{
		res.redirect('http://localhost:3001/polling_officer_panel');
	}
	else
	{
	res.render('login', {
	 data: {},
	 errors: {}
    })
}
});
app.get('/Admin_login', (req, res) => {
	if(req.session.email)
	{
		res.redirect('http://localhost:3001/welcom');
	}
	else if(req.session.halkano)
	{
		res.redirect('http://localhost:3001');
	}
	else
	{
	res.render('Admin_login', {
	 data: {},
	 errors: {}
 
 })
}
});

app.use(bodyParser.urlencoded({extended : true}));
app.get('/single', (req, res) => {

	res.render('single', {
    data: {},
    errors: {}
	
	})

});

app.post('/result', (req, res) => {
	
	
	var qresult=req.body;
   
   
   'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var middleware = [
  express.static(path.join(__dirname, 'public'))
];
app.use(middleware);

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

 
	
// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	
	
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	
	var crypto_suite = Fabric_Client.newCryptoSuite();
	
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	
	crypto_suite.setCryptoKeyStore(crypto_store);
	
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests

	return fabric_client.getUserContext('user1', true);
	
}).then((user_from_store) => {
	
	
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
		
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}

	// queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
	// queryAllCars chaincode function - requires no arguments , ex: args: [''],
	
	const request = {
		
		//targets : --- letting this default to the peers assigned to the channel
		chaincodeId: 'fabcar',
		fcn: 'queryvote',
		args: [qresult.key1]
	};

	// send the query proposal to the peer
	return channel.queryByChaincode(request);
	
}).then((query_responses) => {
	console.log("Query has completed, checking results");
	// query_responses could have more than one  results if there multiple peers were used as targets
	if (query_responses && query_responses.length == 1) {
		if (query_responses[0] instanceof Error) {
			console.error("error from query = ", query_responses[0]);
		} else {
			//console.log("Response is ", query_responses[0].toString());
		    myData =query_responses[0].toString();
				 myData2 = [];
				 console.log("ahhhahahhahahahhah")
				 var labels = [];
				
				 var values=[];
				 
				 
				 console.log(myData)
			
			

		  //console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
         
		  loop1:for(var i=0;i<myData.length;i++)
		  {
			       if(myData[i]==',')
				   {
					   if(myData[Number(i)+ Number(3)]=='R')
					   {
					   //var rabbia=i;
					   //var shanza=2;
					   //rabbia=Number(rabbia)+ Number(2);
					   //if(myData[rabbia]=='R')
					   //{
						//console.log("hahhahahaahhaahahhahahaahahahhahahhahahahahah");   
						  myData2.push(myData[i]);
						   i= Number(i) + Number(11);
						   
						   
					   //}
					   }  
				   }
			      
				     
				      if( myData[i]!='"' && myData[i]!='{' && myData[i]!='}' && myData[i]!='[' && myData[i]!=']')
					  {
						  
							  
								  
									myData2.push(myData[i]);  
						  
				       
				      }
			      			
		  }
		  for(var i=0;i<myData2.length-1;i++)
			{
				var k=i;
				var string="";
				if(i==0 || myData2[k]==',')
				{
					while(myData2[k]!=':')
					{
								if(myData2[k]!=',')
								{
								string+=myData2[k];
								}
								k++;
					}
					i=k;
					labels.push(string);
				}
			}
			console.log(labels);
			for(var i=0;i<myData2.length;i++)
			{
				if(myData2[i]==':')
				{
						var k=i+1;
						var st="";
						while(myData2[k]!=',')
						{
							
								st+=myData2[k];
								k++;
						}
						i=k;
						
							values.push(st);
						
				}
			}
		 console.log(values);
		 
		 res.render('result', { users: myData2, qresult: qresult.key1,labels:labels,values:values});
		  
		  
		   
		
		
 	
		}
	} else {
		console.log("No payloads were returned from query");
	}
	 
}).catch((err) => {

	console.error('Failed to query successfully :: ' + err);


});
	 //console.log(myData2);
   
   
   
   
	
});
app.post('/login_c',function(req,res){

	let errors=[];
	if(!req.body.email){
		errors.push("Please Enter your email");
	}
	if(!req.body.password){
		errors.push("Please Enter your password");
	}
	if(!req.body.list){
		errors.push("Please Select the list");
	}
	if(errors.length>0)
		{
			 res.render('login',{
				 errors:errors,
				 
			 });
		}
		
		Admin.findOne({Email: req.body.email},function(err,foundadmin){
			//console.log("body:",req.body);
			if(foundadmin)
			{ 
				//console.log("body:",req.body);
				
					 if(foundadmin.Email==req.body.email && foundadmin.Password==req.body.password && foundadmin.Status==req.body.list)
					 {
						 if(foundadmin.Status=="Admin")
						 {
							console.log("Admin login successfully");
							req.session.email=req.body.email;
							res.redirect('/welcom');
						 }
						 else
						 {
							req.session.halkano=req.body.list;
							res.redirect('/polling_officer_panel');
						 }

					 }

					 else
					 {
						if(req.body.list=="Admin")
						{
							console.log("Admin Invalid Email Address/Password");
							errors.push("Invalid Email Address/Password");
						res.render('Admin_login',{
							errors:errors,
						});
						}
						else
						{
							errors.push("Invalid Email Address/Password/Status");
						res.render('login',{
							errors:errors,
						});
						}
						
					 }
			}
			else
			{
				
				errors.push("InValid Email Address/Password");
				res.render('login',{
					errors:errors,
				});
			}
		
		});
		


	});









'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */
 
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var middleware = [
  layout(),
  express.static(path.join(__dirname, 'public')),
];
app.use(middleware);
require('./models/Voter');

const Voter = mongoose.model('voters');





//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;
var myData;
var myData2;
 
	
// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	
	
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	
	var crypto_suite = Fabric_Client.newCryptoSuite();
	
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	
	crypto_suite.setCryptoKeyStore(crypto_store);
	
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests

	return fabric_client.getUserContext('user1', true);
	
}).then((user_from_store) => {
	
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
		
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}

	// queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
	// queryAllCars chaincode function - requires no arguments , ex: args: [''],
	
	const request = {
		
		//targets : --- letting this default to the peers assigned to the channel
		chaincodeId: 'fabcar',
		fcn: 'queryAllvotes',
		args: ['']
	};

	// send the query proposal to the peer
	return channel.queryByChaincode(request);
	
}).then((query_responses) => {
	console.log("Query has completed, checking results");
	// query_responses could have more than one  results if there multiple peers were used as targets
	if (query_responses && query_responses.length == 1) {
		if (query_responses[0] instanceof Error) {
			console.error("error from query = ", query_responses[0]);
		} else {
			//console.log("Response is ", query_responses[0].toString());
		   myData =query_responses[0].toString();
		   myData2 = [];
		  
		  
		  //console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
         
		  loop1:for(var i=0;i<myData.length;i++)
		  {
			       if(myData[i]==',')
				   {
					   if(myData[Number(i)+ Number(3)]=='R')
					   {
					   //var rabbia=i;
					   //var shanza=2;
					   //rabbia=Number(rabbia)+ Number(2);
					   //if(myData[rabbia]=='R')
					   //{
						//console.log("hahhahahaahhaahahhahahaahahahhahahhahahahahah");   
						  myData2.push(myData[i]);
						   i= Number(i) + Number(11);
						   
						   
					   //}
					   }  
				   }
			      
				     
				      if( myData[i]!='"' && myData[i]!='{' && myData[i]!='}' && myData[i]!='[' && myData[i]!=']')
					  {
						  
							  
								  
									myData2.push(myData[i]);  
						  
				       
				      }
			      			
		  }
		  
		  // console.log(myData2);
		
		app.get('/user',(req, res) => { 
		  
		 res.render('user', { users: myData2 });
});	  
// axios.post('http://192.168.0.182:3001/display', {},{
// 	// You need to use `getHeaders()` in Node.js because Axios doesn't
// 	// automatically set the multipart form boundary in Node.
// 	//headers: formData.getHeaders(),
// 	maxContentLength: Infinity,
// 	maxBodyLength: Infinity
//   })
//   .then((response) =>{ 	
// 	  console.log('Response from 2nd peer: Data is successfully store in 2nd peer')
//   }).catch((err) => {
// 	console.error('axios error :: ' + err);
// });	   
		
  

 app.listen(3001, '192.168.1.10',function (routes) {
  console.log('server started on port 3001');
  
});
		
 	
		}
	} else {
		console.log("No payloads were returned from query");
	}
	 
}).catch((err) => {

	console.error('Failed to query successfully :: ' + err);


});
	
		  
