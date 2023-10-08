
var path = require('path');

const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
require('./models/Voter');
const Voter = mongoose.model('voters');

module.exports = function(app){
  app.route('/voter_insert')
  .get(function(req,res,next){
    res.render('voter_insert');
  })
  .post(function(req,res,next){  
      var v=new Voter();
      v.Name=req.body.name;
      v.CNIC=req.body.cnic;
      v.Fname=req.body.fname;
      v.Email=req.body.email;
      let sampleFile= req.files.sampleFile;
      let fileName = Math.random().toString(26).slice(2) + '.jpg';
      let path = './public/Files/' + fileName;
      v.Picture = '/Files' + fileName;
      sampleFile.mv(path, function(err){
        if(err)
        return res.status(500).send(err);
      })
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
      
    
    
    
    });
    
    


}