const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const CandidatesSchema=new Schema({
  
  VoterID:{
    type:String,
    required:true
  },
  PartyMark:{
    type:String,
    required:true
  },
  Status:{
    type:String,
    required:true
  },
  PartyName:{
    type:String,
    required:true
  }
});
mongoose.model('candidates',CandidatesSchema);