import mongoose from "mongoose";

const industrySchema = mongoose.Schema({
    industryName : {
        type : String,
        required : true,
        unique : true
    }
})

const Industries = mongoose.model("Industries", industrySchema);
export default Industries;