import mongoose from 'mongoose'

const appoinmentSchema = new mongoose.Schema({
    userId: {type: String , required: true},
    docId : {type: String, required:true},
    slotDate : {type:String,required:true},
    slotTime : {type:String,required:true},
    userdata : {type:Object,required:true},
    docData : {type:Object,required:true},
    amount : {type:Number,required:true},
    date : {type:Number,required:true},
    cancelled : {type:Boolean,default:false},
    payment : {type:Boolean,default:false},
    isComplete : {type:Boolean,default:false},

})

const appoinmentModel = mongoose.models.appoinment || mongoose.model('appoinment',appoinmentSchema)


export default appoinmentModel
