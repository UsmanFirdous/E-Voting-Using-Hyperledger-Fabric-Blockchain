const express = require('express')
var nodemailer = require('nodemailer');
const layout = require('express-layout')
var fs = require('fs');
var axios= require('axios');
const router = express.Router()
var app = express();
const FormData = require('form-data');
var check=0;
function makeid(length) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
var gname="";
var myData=0;
var myData2=0;
const bodyParser = require('body-parser')
const formidable = require('formidable');
const multer = require('multer');
const uniqueString = require('unique-string');
var path = require('path');
const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/evoting',{
})
.then(() => console.log('Monogdb Connected...'))
.catch(err => console.log(err))

var picname="";
var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		var dir='./public/Files/';
		callback(null, dir);
	},
	filename: function (req, file, callback) {
		picname=file.fieldname + uniqueString() + '.jpg';
	  // picname= gname + '.jpg';
		callback(null , picname );
	}
});	
var upload = multer({ storage : storage}).single('userPhoto');
/////////////////////////////////////////////////////////////
var storaged =   multer.diskStorage({
	
	destination: function (req, file, callback) {
		check=0;
		var dir='./FaceRecognition/dataset/' + req.body.cnic;
		if (!fs.existsSync(dir)){
				Voter.findOne({CNIC: req.body.cnic},function(err,foundv){
				if(!foundv)
				{
					check=1;
				}
				else
				{
					var di='./FaceRecognition/dataset/' + req.body.cnic;
					fs.mkdirSync(di);
					callback(null, dir);
				}
				});	
		}
		else
		{
			check=1;
		}	
	},
	filename: function (req, file, callback) {
		picname=req.body.name + '.' + makeid(9) + '.png';
	  // picname= gname + '.jpg';
		callback(null , picname );
	}
});	
var uploadd = multer({ storage : storaged}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});
app.set('view engine', 'ejs');

require('./models/Voter');
const Voter = mongoose.model('voters');
require('./models/Candidates');
const Candidates = mongoose.model('candidates');
require('./models/Election');
const Election = mongoose.model('election');
require('./models/CandidateRegion');
const CandidateRegion = mongoose.model('candidateregion');
require('./models/Face');
const Face = mongoose.model('face');
require('./models/Admin');
const Admin = mongoose.model('admin');
require('./models/Thumb');
const Thumb = mongoose.model('thumb');


var sess;

router.get('/', (req, res) => {
	
   // console.log("login success");
	res.render('index');
	
});
router.get('/welcom', (req, res) => {
	console.log("welcome page");
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('welcom');
	}
});

router.get('/polling_officer_panel', (req, res) => {
	console.log("welcome page");
	if(!req.session.halkano)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('polling_officer_panel');
	}
});


router.get('/facedataset', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('facedataset', {
		data: {},
		errors: {}
	
	});
	}
});
//setTimeout(facedataset, 10000, 'funky');
router.get('/thumbdataset', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('thumbdataset', {
		data: {},
		errors: {}
	
	});
	}
})

router.get('/Admin_Register', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
{

	res.render('Admin_Register', {
	 data: {},
	 errors: {}
 
 })
}
});


router.post('/Admin_Register_c/',function(req,res){
	
		
		let errors=[];
		if(!req.body.email){
			errors.push("Please Enter Your Email");
		}
		if(!req.body.password){
			errors.push("Please Enter Your Password");
		}
		if(errors.length>0)
			{
				 res.render('Admin_Register',{
					 errors:errors,
					 
				 });
			}
		var admin=new Admin();
		admin.Email=req.body.email;
		admin.Password=req.body.password;
		admin.Status=req.body.list;
		var e=[];
	admin.save(function(err) {
		if (err>0)
		{
			e.push(err);
			res.render('Admin_added',{
				e:e
			})
		}
		else
		{
			e.push("Admin Record Succesfully Saved in MongoDb");
			res.render('Admin_added',{
				e:e
			})
		}
	});



	});	

router.get('/final/:cnic', (req, res) => {
		if(!req.session.halkano)
		{console.log("plz login");
		res.redirect('login');
		}
		else
		{
      res.render('final', { 
       cnic:req.params.cnic
			});        
		}	
	});
router.post('/insert', (req, res) => {
	
			
			Voter.findOne({CNIC: req.body.cnic},function(err,voter){
				console.log("voters:",voter)
				// CandidateRegion.find({RegionNo:voter.Halka},function(err,foundcandidate_r){
				//  console.log(foundcandidate_r);
				//  var cnic=[];
				//  for(var i=0;i<foundcandidate_r.length; i++)
				//  {
				// 		 cnic.push(foundcandidate_r[i].VoterID)
				//  }
				 //console.log(cnic);
				 Candidates.find({},function(err,foundcandidate){
					var cnic=[];
				  for(var i=0;i<foundcandidate.length; i++)
				 {
					cnic.push(foundcandidate[i].VoterID)
				 }	 
					 
	 
					 Voter.find({CNIC:cnic},function(err,CandidateD){
					 
						 
						 console.log(foundcandidate);
						 console.log(CandidateD);
						// console.log(voter);
	 
					 res.render('insert', { Candidates: foundcandidate,CandidateD:CandidateD , Voter:voter
					 });
			 

	 })
	 })	 
	 
 
				});	
});

router.get('/CandidatesRegister', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('CandidatesRegister', {
	 data: {},
	 errors: {}
 
 })
 }
});
router.get('/CandidateRegion_Register', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('CandidateRegion_Register', {
	 data: {},
	 errors: {}
 
 })
}
});
router.get('/ElectionRegister', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('ElectionRegister', {
	 data: {},
	 errors: {}
 
 })
}
});
router.post('/Election_added',function(req,res){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	let errors=[];
	if(!req.body.electionyear){
		errors.push("Please Enter Election Year");
	}
	if(errors.length>0)
		{
			 res.render('ElectionRegister',{
				 errors:errors,
				 
			 });
		}
	var elec=new Election();
	elec.ElectionYear=req.body.electionyear;
	var e=[];
elec.save(function(err) {
	if (err>0)
	{
		e.push(err);
		res.render('Election_added',{
			e:e
		})
	}
	else
	{
		e.push("Record Succesfully Saved in MongoDb");
		res.render('Election_added',{
			e:e
		})
	}
});
	}
});

router.post('/CandidateRegion_added',function(req,res){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	let errors=[];
	if(!req.body.cnic){
		errors.push("Please Enter Candidate CNIC");
	}
	if(!req.body.regionno){
		errors.push("Please Enter Region No");
	}
	if(errors.length>0)
		{
			 res.render('CandidateRegion_Register',{
				 errors:errors,
				 
			 });
		}

		CandidateRegion.findOne({VoterID: req.body.cnic,RegionNo:req.body.regionno},function(err,found){
			if(found)
			{
					errors.push("Sorry this("+ req.body.cnic +") CNIC is Already Register in ("+req.body.regionno +") constituency  try another CNIC" );
					res.render('CandidateRegion_Register',{
						errors:errors,
						
					});

			}
		
		Voter.findOne({CNIC: req.body.cnic},function(err,foundvoter){
			if(!foundvoter)
			{
					errors.push("Sorry this ("+ req.body.cnic +") CNIC is not a voter plz enter Valid candidate CNIC No" );
					res.render('CandidateRegion_Register',{
						errors:errors,
						
					});
			}
			else
			{
				console.log(foundvoter);
			}

		
if(!found && foundvoter)
{
	var candidatereg=new CandidateRegion();
	candidatereg.VoterID=req.body.cnic;
	candidatereg.RegionNo=req.body.regionno;
	var e=[];
candidatereg.save(function(err) {
	if (err>0)
	{
		e.push(err);
		res.render('CandidateRegion_added',{
			e:e
		})
	}
	else
	{
		e.push("Record Succesfully Saved in MongoDb");
		res.render('CandidateRegion_added',{
			e:e
		})
	}
});
}
});
});
	}
});

router.post('/candidate_added',function(req,res){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	upload(req,res,function(err) {
		if(err) {
				return res.end("Error uploading file.");
		}
//console.log(req.file.fieldname);
		let errors=[];
		if(!req.body.candidateid){
			errors.push("Please Enter CandidateId");
		}
		if(!req.body.partyname){
			errors.push("Please Enter Party Name");
		}
		if(!req.body.status){
			errors.push("Please Enter Candidate Status");
		}
		if(!req.file.fieldname){
			errors.push("Please Select Party Mark");
		}
		
		if(errors.length>0)
		{
			 res.render('CandidatesRegister',{
				 errors:errors,
				 
			 });
		}
		 
		Candidates.findOne({VoterID: req.body.candidateid},function(err,found){
			if(found)
			{
					errors.push("Sorry this("+ req.body.candidateid +") CNIC is Already Register try another CNIC" );
					res.render('CandidatesRegister',{
						errors:errors,
						
					});

			}
			else
			{
				console.log("no record found")
			}
		
		Voter.findOne({CNIC: req.body.candidateid},function(err,foundvoter){
			if(!foundvoter)
			{
					errors.push("Sorry this("+ req.body.candidateid +") CNIC not a voter plz enter valid candidate CNIC No" );
					res.render('CandidatesRegister',{
						errors:errors,
						
					});

			}
			else
			{
				console.log("no record found")
			}
		

if(!found && foundvoter)
{
var c=new Candidates();
console.log(req.body);
c.VoterID=req.body.candidateid;
c.Status=req.body.status;
c.PartyName=req.body.partyname;
c.PartyMark = 'Files/' + picname;

var e=[];
c.save(function(err) {
	if (err>0)
	{
		e.push(err);
		res.render('candidate_added',{
			e:e
		})
	}
	else
	{
		e.push("Record Succesfully Saved in MongoDb");
		res.render('candidate_added',{
			e:e
		})
	}
			
})
}
})
});
});
	}
});
/////////////////////Voter Record insert Page////////////////
router.get('/voter_insert', (req, res) => {
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	res.render('voter_insert', {
	 data: {},
	 errors: {}
 
 })
}
});

router.post('/record_added',function(req,res){
	console.log(req.body);

	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	
	else
	{
		
	new formidable.IncomingForm().parse(req, (err, fields, files) => {
		 
		 
		


		let errors=[];
		if (err) {
      console.error('Error', err)
      throw err
		}
		
	
		if(!fields.name){
			errors.push("Please Enter Name");
		}
		if(!fields.cnic){
			errors.push("Please Enter CNIC");
		}
		if(!fields.fname){
			errors.push("Please Enter F/Name");
		}
		if(!fields.email){
			errors.push("Please Enter Email Address");
		}
		if(!fields.halka){
			errors.push("Please Enter the Hakla No");
		}
		if(!files.userPhoto.name)
		{
			errors.push("Please Select the file");
		}
		if(errors.length>0)
		{
			 res.render('voter_insert',{
				 errors:errors,
				 
			 });
		}
		
	});
 
	upload(req,res,function(err) {
		let errors=[];
		if(err) {
					return res.end("Error uploading file.");
			}
			Voter.findOne({CNIC: req.body.cnic},function(err,found){
				if(found)
				{
					
						errors.push("Sorry this("+ req.body.cnic +") CNIC is Already Register try another CNIC" );
						res.render('voter_insert',{
							errors:errors,
							
						});
	
				}
				else
				{
					console.log("no record found")
				}
			

if(!found)
{

			var v=new Voter();
			console.log(req.body);
	v.Name=req.body.name;
	v.VoterId=uniqueString();
	v.CNIC=req.body.cnic;
	v.Fname=req.body.fname;
	v.Email=req.body.email;
	v.Picture = 'Files/' + picname;
	v.Halka=req.body.halka;

	var e=[];
	v.save(function(err) {
		if (err>0)
		{
			e.push(err);
			res.render('record_added',{
				e:e
			})
		}
		else
		{
			e.push("Record Succesfully Saved in MongoDb");
			res.render('record_added',{
				e:e
			})
		}
				
});
}
});			
			
	});
}
});


router.post('/facedataset_c',function(req,res){
	
  
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	 
	else
	{
		
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
		console.log(fields);
		let errors=[];	
	  
		
		if (err) {
      console.error('Error', err)
      throw err
		}
		
		
		if(!fields.cnic){
			errors.push("Please Enter cnic no");
		}
		if(!fields.name){
			errors.push("Please Enter Voter name");
		}
		
		
		if(errors.length>0)
		{
			 res.render('facedataset',{
				 errors:errors,
			 });
		}
		Face.findOne({VoterID: fields.cnic},function(err,found){
			if(found)
			{
				   
					errors.push("Sorry this ("+ fields.cnic +") CNIC is Already Register try another CNIC" );
					res.render('facedataset',{
						errors:errors,
					});
						

			}
			else
			{
				Voter.findOne({CNIC: fields.cnic},function(err,foundv){
					if(!foundv)
					{
					  
						errors.push("Sorry this ("+ fields.cnic +") is not a voter plz enter a valid CNIC No" );
						res.render('facedataset',{
							errors:errors,
						});		
				
					}
			
				});    
			}
		});
		



	});


	
	uploadd(req,res, async err => {
	


			if(err) {
					console.log("Error uploading file.");
			}
			if(check==0)
	    {
			var face=new Face();
	face.VoterID=req.body.cnic;
	face.VoterName=req.body.name;
	face.DatasetPath = 'dataset\\' + req.body.cnic;
	

	var e=[];
	face.save(function(err) {
		if (err>0)
		{
			e.push(err);
			res.render('record_added_dataset',{
				e:e
			})
		}
		else
		{
			e.push("Record Succesfully Saved in MongoDb");
			res.render('record_added_dataset',{
				e:e
			})
		}
				
});
	}
	else
	{
		console.log("check=1");
	}
			
			
	});
}


});

router.post('/thumbdataset_c',function(req,res){
	

	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	
	else
	{
		
		let errors=[];
		if(!req.body.cnic){
			errors.push("Please Enter cnic no");
		}
		if(!req.body.template){
			errors.push("Please Enter Thumb Template");
		}
		
		
		if(errors.length>0)
		{
			 res.render('thumbdataset',{
				 errors:errors,
			 });
		}
		Thumb.findOne({VoterID: req.body.cnic},function(err,found){
			if(found)
			{
					errors.push("Sorry this("+ req.body.cnic +") CNIC is Already Register try another CNIC" );
					res.render('thumbdataset',{
						errors:errors,
						
					});

			}
			else
			{
				console.log("no record found")
			}
		
		Voter.findOne({CNIC: req.body.cnic},function(err,foundvoter){
			if(!foundvoter)
			{
					errors.push("Sorry this ("+ req.body.cnic +") CNIC is not voter try valid voter CNIC NO" );
					res.render('thumbdataset',{
						errors:errors,
						
					});

			}
			else
			{
				console.log("no record found")
			}
		
		
	
	 if(!found && foundvoter)
	 {
	var thumb=new Thumb();
	thumb.VoterID=req.body.cnic;
	thumb.Template=req.body.template;
	
	var e=[];
	thumb.save(function(err) {
		if (err>0)
		{
			e.push(err);
			res.render('record_added_thumbdataset',{
				e:e
			})
		}
		else
		{
			e.push("Record Succesfully Saved in MongoDb");
			res.render('record_added_thumbdataset',{
				e:e
			})
		}
							
	});
}
});
});
}
});

router.get('/show_records',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Voter.find({},function(err,voters){
		res.render('show_records',{voters:voters});
	});
}
});
router.get('/show_dataset',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Face.find({},function(err,voters){
		res.render('show_dataset',{voters:voters});
	});
}
});
router.get('/show_thumbdataset',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Thumb.find({},function(err,voters){
		var myData = [];
		var myData2 = [];
		for(var i =0; i<voters.length ; i++)
		{
        myData.push(voters[i].Template)
		}
		 for(var i=0;i<myData.length;i++)
		 {
					 var chararray=myData[i].split('');
					 var template="";
					 for(var j=0;j<40;j++)
					 {
							template+=chararray[j];
							if(j==39)
							{
								template+="....";
							}
					 }
					 myData2.push(template);
					 

		 }
    console.log(myData2);
		res.render('show_thumbdataset',{voters:voters,template:myData2});
	});
}
});
router.get('/Show_Election',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Election.find({},function(err,election){
		res.render('Show_Election',{election:election});
	});
}
});
router.get('/ShowCandidates',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Candidates.find({},function(err,candidates){
		res.render('ShowCandidates',{candidates:candidates});
	});
}
});
router.get('/ShowCandidateRegion',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	CandidateRegion.find({},function(err,candidates){
		res.render('ShowCandidateRegion',{candidateregion:candidates});
	});
}
});
router.get('/delete/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Voter.find({_id: req.params.id}).remove()
	.exec(function(err,foundpin){
		res.redirect('/show_records');
	})
}
});
router.get('/delete_Election/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Election.find({_id: req.params.id}).remove()
	.exec(function(err,foundpin){
		res.redirect('/Show_Election');
	})
}
});
router.get('/delete_thumbdataset/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Thumb.find({_id: req.params.id}).remove()
	.exec(function(err,foundpin){
		res.redirect('/show_thumbdataset');
	})
}
});
router.get('/delete_CandidateRegion/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	CandidateRegion.find({_id: req.params.id}).remove()
	.exec(function(err,foundpin){
		res.redirect('/ShowCandidateRegion');
	})
}
});
router.get('/delete_dataset/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Face.find({_id: req.params.id}).remove()
	.exec(function(err,foundpin){
		res.redirect('/show_dataset');
	})
}
});
router.get('/delete_candidate/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Candidates.find({_id: req.params.id}).remove()
	.exec(function(err,foundpin){
		res.redirect('/ShowCandidates');
	})
}
});

router.get('/Candidatedetails_updated/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Candidates.findOne({_id: req.params.id},function(err,foundvoter){
		res.render('Candidatedetails_updated',{candidate:foundvoter});
	
	})
}
});
router.get('/facedataset_update/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Face.findOne({_id: req.params.id},function(err,foundvoter){
		res.render('facedataset_update',{voters:foundvoter});
	})
}
});
router.get('/thumbdataset_update/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Thumb.findOne({_id: req.params.id},function(err,foundvoter){
		res.render('thumbdataset_update',{voters:foundvoter});
	})
}
});
router.get('/CandidateRegion_updated/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	CandidateRegion.findOne({_id: req.params.id},function(err,candidatereg){
		res.render('CandidateRegion_updated',{candidateregion:candidatereg});
	
	})
}
});
router.get('/Election_updated/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Election.findOne({_id: req.params.id},function(err,foundvoter){
		res.render('Election_updated',{election:foundvoter});
	})
}
});
router.get('/details_updated/:id',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Voter.findOne({_id: req.params.id},function(err,foundvoter){
		res.render('details_updated',{voters:foundvoter});
	
	})
}
});


router.post('/search_single',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Voter.findOne({CNIC: req.body.cnic},function(err,foundvoter){
		if(!foundvoter)
		{
			var error="";
		res.render('search_single',{voters:error});
		}
		else
		res.render('search_single',{voters:foundvoter});
	
	})
}
});
router.post('/search_single_dataset',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Face.findOne({VoterID: req.body.cnic},function(err,foundvoter){
		if(!foundvoter)
		{
			var error="";
		res.render('search_single_dataset',{voters:error});
		}
		else
		res.render('search_single_dataset',{voters:foundvoter});
	
	})
}
});
router.post('/search_single_thumbdataset',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Thumb.findOne({VoterID: req.body.cnic},function(err,voters){
		if(!voters)
		{
			var error="";
		res.render('search_single_thumbdataset',{voters:error});
		}
		else
		{
		 
			var myData;
			var myData2; 
			
					myData=voters.Template
						 var chararray=myData.split('');
						 var template="";
						 for(var j=0;j<40;j++)
						 {
								template+=chararray[j];
								if(j==39)
								{
									template+="....";
								}
						 }
						 myData2 = template;
						



		res.render('search_single_thumbdataset',{voters:voters,template:myData2});
		}
	})
}
});
router.post('/find_voter',function(req,res,next){
	Voter.findOne({CNIC:req.body.cnic},function(err,foundvoter){
		if(!foundvoter)
		{
			var error="";
		res.render('find_voter',{voters:error});
		}
		else
		res.render('find_voter',{voters:foundvoter});
	
	})
});
router.post('/search_single_candidate',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Candidates.findOne({VoterID: req.body.cnic},function(err,foundvoter){
		console.log(foundvoter);
		if(!foundvoter)
		{
			var error="";
		res.render('search_single_candidate',{candidates:error});
		}
		else
		res.render('search_single_candidate',{candidates:foundvoter});
	
	})
}
});
router.post('/search_single_Election',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Election.findOne({ElectionYear: req.body.electionyear},function(err,foundelection){
		console.log(foundelection);
		if(!foundelection)
		{
			var error="";
		res.render('search_single_Election',{election:error});
		}
		else
		res.render('search_single_Election',{election:foundelection});
	
	})
}
});
router.post('/search_single_candidateregion',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	CandidateRegion.findOne({CNIC: req.body.candidateregionid},function(err,candidatereg){
		console.log(candidatereg);
		if(!candidatereg)
		{
			var error="";
		res.render('search_single_candidateregion',{candidateregion:error});
		}
		else
		res.render('search_single_candidateregion',{candidateregion:candidatereg});
	
	})
}
});

router.post('/picture_updated',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	upload(req,res,function(err) {
		if(err) {
				return res.end("Error uploading file.");
		}
	
	Voter.findOne({_id: req.body.id},function(err,foundvoter){
	if(foundvoter)
	{
		console.log(foundvoter);
		if(picname!="")
		{
			foundvoter.Picture='Files/'+ picname;
		}
		foundvoter.save(function(err){
			if(err) 
			return next(err);
			Voter.find({},function(err,voters){
				res.render('show_records',{voters:voters});
			});

		})
	}	
	})

	})
}
});
router.post('/candidatepicture_updated',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	upload(req,res,function(err) {
		if(err) {
				return res.end("Error uploading file.");
		}
	
	Candidates.findOne({_id: req.body.id},function(err,foundcandidate){
	if(foundcandidate)
	{
		console.log(foundcandidate);
		if(picname!="")
		{
			foundcandidate.PartyMark='Files/'+ picname;
		}
		foundcandidate.save(function(err){
			if(err) 
			return next(err);
			Candidates.find({},function(err,voters){
				res.render('ShowCandidates',{candidates:voters});
			});

		})
	}	
	})

	})
}
});



router.post('/details_updated_c',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Voter.findOne({_id: req.body.id},function(err,foundvoter){
	if(foundvoter)
	{
		
		 foundvoter.Name=req.body.name;
		 foundvoter.CNIC=req.body.cnic;
		 foundvoter.VoterId=req.body.voterid;
		 foundvoter.Fname=req.body.fname;
		 foundvoter.Email=req.body.email;
		 foundvoter.Halka=req.body.halka;

		foundvoter.save(function(err){
			if(err) 
			return next(err);
			Voter.find({},function(err,voters){
				res.render('show_records',{voters:voters});
			});

		})
	}	
	})
}
});
router.post('/candidate_added_c',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Candidates.findOne({_id: req.body.id},function(err,foundcandidate){
	if(foundcandidate)
	{
		
		 foundcandidate.VoterID=req.body.candidateid;
		 foundcandidate.PartyName=req.body.partyname;
		 foundcandidate.Status=req.body.status;
		 foundcandidate.save(function(err){
			if(err) 
			return next(err);
			Candidates.find({},function(err,voters){
				res.render('ShowCandidates',{candidates:voters});
			});

		})
	}
	else
	{
		console.log("sorry no record found");
	}	
	})
}
});
router.post('/facedataset_update_c',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Face.findOne({_id: req.body.id},function(err,foundvoter){
	console.log(req.body);
		if(foundvoter)
	{
		
		 foundvoter.VoterID=req.body.cnic;
		 foundvoter.VoterName=req.body.name;
		 foundvoter.DatasetPath=req.body.path
		 
		 foundvoter.save(function(err){
			if(err) 
			return next(err);
			Face.find({},function(err,voters){
				res.render('show_dataset',{voters:voters});
			});

		})
	}
	else
	{
		console.log("sorry no record found");
	}	
	})
}
});
router.post('/thumbdataset_update_c',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Thumb.findOne({_id: req.body.id},function(err,foundvoter){
	console.log(req.body);
		if(foundvoter)
	{
		
		 foundvoter.VoterID=req.body.cnic;
		 foundvoter.Template=req.body.template;
		
		 
		 foundvoter.save(function(err){
			if(err) 
			return next(err);
			Thumb.find({},function(err,voters){
				var myData = [];
		var myData2 = [];
		for(var i =0; i<voters.length ; i++)
		{
        myData.push(voters[i].Template)
		}
		 for(var i=0;i<myData.length;i++)
		 {
					 var chararray=myData[i].split('');
					 var template="";
					 for(var j=0;j<40;j++)
					 {
							template+=chararray[j];
							if(j==39)
							{
								template+="....";
							}
					 }
					 myData2.push(template);
					 

		 }
				res.render('show_thumbdataset',{voters:voters,template:myData2});
			});

		})
	}
	else
	{
		console.log("sorry no record found");
	}	
	})
}
});



router.post('/Election_added_c',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	Election.findOne({_id: req.body.id},function(err,foundelection){
	if(foundelection)
	{
		
		 foundelection.ElectionYear=req.body.electionyear;
		 
		 foundelection.save(function(err){
			if(err) 
			return next(err);
		Election.find({},function(err,voters){
				res.render('Show_Election',{election:voters});
			});

		})
	}
	else
	{
		console.log("sorry no record found");
	}	
	})
}
});
router.post('/CandidateRegion_added_c',function(req,res,next){
	if(!req.session.email)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	CandidateRegion.findOne({_id: req.body.id},function(err,Candidatereg){
		console.log(req.body);
	if(Candidatereg)
	{
		
		 Candidatereg.VoterID=req.body.cnic;
		 Candidatereg.RegionNo=req.body.regionno;
		 Candidatereg.save(function(err){
			if(err) 
			return next(err);
		CandidateRegion.find({},function(err,candidatereg){
				res.render('ShowCandidateRegion',{candidateregion:candidatereg});
			});

		})
	}
	else
	{
		console.log("sorry no record found");
	}	
	})
}
});

router.get('/logout',(req,res) => {
	if(req.session.email)
	{
		req.session.destroy((err) => {
			if(err) {
					return console.log(err);
			}
			res.redirect('Admin_login');
	});
	}
	else
	{
		req.session.destroy((err) => {
			if(err) {
					return console.log(err);
			}
			res.redirect('login');
	});
	}

});


router.get('/user', (req, res) => {
	if(!req.session.halkano)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
	
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
				 var labels = [];
				 var final_labels=[];
				 var values=[];
				 var final_values=[];
		  
		  //console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
         console.log("All Random votes:",myData)
		 myData=JSON.parse(myData);

		//console.log("All Random votes parsed:",myData)
		
		 res.render('user', { record:myData
		 });
		  
		  
		   
		
		
 	
		}
	} else {
		console.log("No payloads were returned from query");
	}
	 
}).catch((err) => {

	console.error('Failed to query successfully :: ' + err);


});
	 //console.log(myData2);
	
}
	
})
router.get('/totalvotes', (req, res) => {
	if(!req.session.halkano)
	{console.log("plz login");
	res.redirect('login');
	}
	else
	{
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
				var MNA = [];
				 var MPA =[];
				 var labels=[];
				 var final_labels=[];
				 var values=[];
				 var final_values=[];
		 // console.log(myData);
		  //console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        
		var cnic=[];
		
		Candidates.find({},function(err,candidate){
			for(var i=0;i<candidate.length; i++)
			{
			cnic.push(candidate[i].VoterID)
			}
			Voter.find({CNIC:cnic},function(err,candidateData){	
         console.log("Candidates Records:",candidateData);
         myData=JSON.parse(myData);
		//console.log("Blockchain data:",myData);
		 var allResult=[];
		 for(var r=0;r<candidateData.length;r++)
		 {
			 var candidateName= candidateData[r].Name
			 var count=0;
			 for(var y=0;y<myData.length;y++)
			 {
				 if(candidateName==myData[y].Record.position)
				 count++;
			 }
			 if (count>0)
			 {
				 allResult.push({Name:candidateName,votes:count})
			 }
		 }
		 console.log("all conted votes:",allResult);
		 console.log("Blockchain Responce",myData);
		 res.render('totalvotes', { 
			 record:allResult
		 });
		});
	});
	
		   
		
		
 	
		}
	} else {
		console.log("No payloads were returned from query");
	}
	 
}).catch((err) => {

	console.error('Failed to query successfully :: ' + err);


});
	 //console.log(myData2);
	
	
	}	
})
	

var dd=0;
router.post('/display',(req, res) => {
	
	var dd=req.body;
	console.log("incoming body:",dd);
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
	var dateTime = date+'/'+time;
	dd.time=dateTime;
	console.log("Curent Date/Time:",dd.time);
    console.log(dd);
	/////////////////////////////////mail code/////////////////////////
	// var transporter = nodemailer.createTransport({
	// 	service: 'Gmail',
	// 	host: 'smtp.gmail.com',
	// 	port: 587,
	// 	secure: false,
	// 	requireTLS: true,
	// 	auth: {
	// 		user: 'info.evotinghyperledgerfabric@gmail.com',
	// 		pass: 'moonchand786'
	// 	},
	// 	tls: {
	// 		rejectUnauthorized: false
	// 	}
	// });

	// var mailOptions = {
	// 	from: 'Evoting Hyperledger Blockchain',
	// 	to: dd.email,
	// 	subject: 'Evoting Hyperledger Blockchain',
	// 	html:'<h1>Welcome to Evoting Hyperledger Fabric Technology!</h1><h2>This is your Unique key:<span style="color:#21CB65">'+dd.voterid+'</span></h2> <h2>copy this key and past in following link (http://localhost:3001/single) to veirfy your vote</h2>'

	// };
	
	// transporter.sendMail(mailOptions, function(error, info){
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log('Email sent: ' + info.response);
	// 	}
	// });



		
  'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);

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
}).then(async(user_from_store) => {
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}

	// get a transaction id object based on the current user assigned to fabric client
	tx_id = fabric_client.newTransactionID();
	console.log("Assigning transaction_id: ", tx_id._transaction_id);

	// createCar chaincode function - requires 5 args, ex: args: ['CAR12', 'Honda', 'Accord', 'Black', 'Tom'],
	// changeCarOwner chaincode function - requires 2 args , ex: args: ['CAR10', 'Dave'],
	// must send the proposal to endorsing peers
	
	// let response= await axios({
	// 	method: "get",
	// 	url: 'http://192.168.0.193:3000/getHash',
	// 	timeout: 10000
	// });
    //  let hash=response.data;
	// let response2= await axios({
	// 	method: "get",
	// 	url: 'http://192.168.0.151:3000/getHash',
	// 	timeout: 10000
	// });
	// let hash2= response2.data;
	// console.log("Hash from Minor node 1:",hash);
	// console.log("Hash from Minor node 2:",hash2);
	let hash=uniqueString();//dd.voterid
	await Voter.findOneAndUpdate(
		{ VoterId: dd.voterid },
		{VoterId:hash},
		{ useFindAndModify: false }
    );
	var request = {
		//targets: let default to the peer assigned to the client
		chaincodeId: 'fabcar',
		fcn: 'votecast',
		args: [hash,dd.time+",",dd.mpa,dd.electionyear],
		chainId: 'mychannel',
		txId: tx_id
	};
	// const formData = new FormData();
	// formData.append('voterid',dd.voterid);
	// formData.append('time',dd.time);
	// formData.append('mpa',dd.mpa);
	// formData.append('electionyear',dd.electionyear);
	// console.log("form data:",formData);
	// axios.post('http://192.168.1.10:3001/display', {voterid:hash,mpa:dd.mpa,electionyear:dd.electionyear},{
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

	// send the transaction proposal to the peers
	return channel.sendTransactionProposal(request);
}).then((results) => {
	var proposalResponses = results[0];
	var proposal = results[1];
	let isProposalGood = false;
	if (proposalResponses && proposalResponses[0].response &&
		proposalResponses[0].response.status === 200) {
			isProposalGood = true;
			console.log('Transaction proposal was good');
		} else {
			console.error('Transaction proposal was bad');
		}
	if (isProposalGood) {
		console.log(util.format(
			'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			proposalResponses[0].response.status, proposalResponses[0].response.message));

		// build up the request for the orderer to have the transaction committed
		var request = {
			proposalResponses: proposalResponses,
			proposal: proposal
		};

		// set the transaction listener and set a timeout of 30 sec
		// if the transaction did not get committed within the timeout period,
		// report a TIMEOUT status
		var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
		var promises = [];

		var sendPromise = channel.sendTransaction(request);
		promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

		// get an eventhub once the fabric client has a user assigned. The user
		// is required bacause the event registration must be signed
		let event_hub = channel.newChannelEventHub(peer);

		// using resolve the promise so that result status may be processed
		// under the then clause rather than having the catch clause process
		// the status
		let txPromise = new Promise((resolve, reject) => {
			let handle = setTimeout(() => {
				event_hub.unregisterTxEvent(transaction_id_string);
				event_hub.disconnect();
				resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			}, 3000);
			event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
				// this is the callback for transaction event status
				// first some clean up of event listener
				clearTimeout(handle);

				// now let the application know what happened
				var return_status = {event_status : code, tx_id : transaction_id_string};
				if (code !== 'VALID') {
					console.error('The transaction was invalid, code = ' + code);
					resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
				} else {
					console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
					resolve(return_status);
				}
			}, (err) => {
				//this is the callback if something goes wrong with the event registration or processing
				reject(new Error('There was a problem with the eventhub ::'+err));
			},
				{disconnect: true} //disconnect when complete
			);
			event_hub.connect();

		});
		promises.push(txPromise);

		return Promise.all(promises);
	} else {
		console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
	}
}).then((results) => {
	console.log('Send transaction promise and event listener promise have completed');
	// check the results in the order the promises were added to the promise all list
	if (results && results[0] && results[0].status === 'SUCCESS') {
		console.log('Successfully sent transaction to the orderer.');
	} else {
		console.error('Failed to order the transaction. Error code: ' + results[0].status);
	}

	if(results && results[1] && results[1].event_status === 'VALID') {
		console.log('Successfully committed the change to the ledger by the peer');
	} else {
		console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
	}
}).catch((err) => {
	console.error('Failed to invoke successfully :: ' + err);
});

  
  
  
  
  res.render('display', {
    data: req.body, // { message, email }
    
	})

});
router.post('/verification', async(req, res) => {	
	let data=req.body;
	if(data.key1==data.key2)
	{
       console.log("email matched successfully");
	   res.render('verification',{cnic:data.cnic})
	}
	else
	{
		let errors=[];
		let voter={CNIC:data.cnic};
		errors.push("Sorry verification code is doest match");
		res.render('email_verification',{voter:voter,key:data.key2,errors:errors});
	}
})
router.post('/email', async(req, res) => {	
	var qresult=req.body;
    let cnic=qresult.cnic;
	console.log("body:",qresult);
	let voter=await Voter.findOne({CNIC:cnic});
	let testAccount = await nodemailer.createTestAccount();
    var transporter = nodemailer.createTransport({
		host: 'usaf.com.pk',
		port: 465,
		secure: true,
			auth: {
				user: 'alert@usaf.com.pk',
				pass: '.,2^Upx=[Jp2'
			},
			tls: {
				rejectUnauthorized: false
			}
		});

	let key=uniqueString();
	var mailOptions = {
		from: 'info@usaf.com.pk',
		to: 'sagarvivian@gmail.com',
		subject: 'Evoging Hyperledger Blockchain E-Mail Verification',
		html:'<h1>Welcome to Evoting Hyperledger Fabric Email Verification!</h1><h2>This is your Unique key:'+key+'</h2> <h2>copy this key and past in follwoing key to veirfy email</h2>'
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
	res.render('email_verification',{voter:voter,key:key,errors:[]});
});
router.post('/queryledger', (req, res) => {	
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
		args: [qresult.voterid]
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
				 if(myData!="")
				 {
					 console.log("Sorry Voter already casted his/her vote");
					 console.log("Data:",myData);
				 }
				 else
				 {
					 console.log("No Vote Found Against ",qresult.voterid,"Voter Id");
				 }
			   
			
		 res.render('queryledger', { voter: myData, qresult: qresult.voterid, cnic:qresult.cnic});

 	
		}
	} else {
		console.log("No payloads were returned from query");
	}
	 
}).catch((err) => {

	console.error('Failed to query successfully :: ' + err);


});
	 //console.log(myData2);
   
   
   
   
	
});










const request = require('request-promise');
const https = require("https");

router.post('/facereg', async function (req, res) {
	if(!req.session.halkano)
	{console.log("plz login");
	res.redirect('login');
	}
	
	Face.findOne({VoterID: req.body.cnic}, async function(err,foundvoter){
		console.log(foundvoter)
		var datasetpath=foundvoter.DatasetPath;
		
	
	
   
	var data = { // this variable contains the data you want to send
			data1: datasetpath
	}

	var options = {
			method: 'POST',
			uri: 'http://localhost:5000/facereg',
			body: data,
			json: true // Automatically stringifies the body to JSON
	};
	
	var returndata;
	var sendrequest = await request(options)
	.then(function (parsedBody) {
			console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
			returndata = parsedBody // do something with this data, here I'm assigning it to a variable.
			
	})
	.catch(function (err) {
		console.log(err);
		
});
var responce=returndata.newdata.toString();



	console.log(responce);

	Thumb.findOne({VoterID: req.body.cnic}, async function(err,foundvoter){
   
  
res.render('facereg', { result: responce , cnic:req.body.cnic,template:foundvoter.Template
});
});
});
});



/*router.get('/facereg', async function (req, res) {
	const spawn = require("child_process").spawn;
	var name="Mailusman";
	const process = spawn('python',["FaceRecognition/recognition.py",name]);
	
			let result = '';
			var result2="";
			process.stdout.on('data', data => {
					result += data.toString();
					console.log(result);
				/*	for(var i=0;i<result.length;i++)
					{
						if(result[i]=='-')
						{
						
							
							for(var j=i+1;j<result.length;j++)
							{
									result2+=result[j];	
							}
						}
					}
					console.log(result2);
					
					res.render('facereg', { result: result
					});
			} );
			
			process.on('close', code => {
		  
			})
	
		});
			
	*/
	
	
	router.get('/test', (req, res) => {
		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			requireTLS: true,
			auth: {
				user: 'info.evotinghyperledgerfabric@gmail.com',
				pass: 'moonchand786'
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		var mailOptions = {
			from: 'Evoting Hyperledger Blockchain',
			to: 'sagarvivian@gmail.com',
			subject: 'Evoging Hyperledger Blockchain',
			html:'<h1>Welcome to Evoting Hyperledger Fabric Technology!</h1><h2>This is your Unique key:'+ +'</h2> <h2>copy this key and past in follwoing link to veirfy your vote</h2>'
	
		};
		
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		
    
		res.render('test');
		
})	
	



   
module.exports = router