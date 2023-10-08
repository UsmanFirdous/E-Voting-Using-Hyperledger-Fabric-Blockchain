const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const VoterSchema=new Schema({
  Name:{
    type:String,
    required:true
  },
  CNIC:{
    type:String,
    required:true
  },
  VoterId:{
    type:String,
    required:true
  },
  Fname:{
    type:String,
    required:true
  },
  Email:{
    type:String,
    required:true
  },
  Picture:{
    type:String,
    required:true
  },
  Halka:{
    type:String,
    required:true
  }
});
mongoose.model('voters',VoterSchema);