const mongoose =require('mongoose')
const connectionDb=(uri)=>{
    return mongoose.connect(uri)
}
module.exports= connectionDb