const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const ThumbSchema=new Schema({
  
  VoterID:{
    type:String,
    required:true
  },
  
  Template:{
    type:String,
    required:true
  }
  
});
mongoose.model('thumb',ThumbSchema);