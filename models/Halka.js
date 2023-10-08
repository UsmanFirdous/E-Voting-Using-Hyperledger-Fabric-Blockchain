const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const halkaSchema=new Schema({
  HalkaNo:{
    type:String,
    required:true
  }
});
mongoose.model('halka',halkaSchema);