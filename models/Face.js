const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const FaceSchema=new Schema({
  
  VoterID:{
    type:String,
    required:true
  },
  VoterName:{
    type:String,
    required:true
  },
  DatasetPath:{
    type:String,
    required:true
  }
  
});
mongoose.model('face',FaceSchema);