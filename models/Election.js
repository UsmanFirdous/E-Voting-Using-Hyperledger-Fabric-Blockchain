const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const ElectionSchema=new Schema({
  ElectionYear:{
    type:String,
    required:true
  }
});
mongoose.model('election',ElectionSchema);