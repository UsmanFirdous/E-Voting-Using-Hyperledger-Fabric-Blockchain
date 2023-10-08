const express = require('express')
var nodemailer = require('nodemailer');
const layout = require('express-layout')
var fs = require('fs');
var axios= require('axios');
const router = express.Router()
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
const uniqueString = require('unique-string');
var path = require('path');
const { Console } = require('console');
app.get('/getHash',function(req,res){
    console.log("getHash API is calling");
    let hash=uniqueString();
    res.end(hash);
})
app.get('/testing',function(req,res){
    console.log("Testing API is calling");
    res.end('Done')
    });
app.listen(80,function(){
	console.log("Respberry Pi started on Port 80");
})
