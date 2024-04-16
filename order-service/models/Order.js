import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    products:[
        {
            name:String,
            description:String,
            price:Number
        }
    ],
    total:Number
})

export default mongoose.model('order', OrderSchema)