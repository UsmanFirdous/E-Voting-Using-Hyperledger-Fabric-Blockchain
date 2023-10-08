const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const CandidateRegionSchema=new Schema({
  
  VoterID:{
    type:String,
    required:true
  },
  RegionNo:{
    type:String,
    required:true
  }
  
});
mongoose.model('candidateregion',CandidateRegionSchema);