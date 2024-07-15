const mongoose = require('mongoose')
const {isEmail} = require('validator')
const userSchema = mongoose.Schema(
    {
        email : {
            type : String,
            required : [true, 'Please provide email'],
            unique : true,
            lowercase : true,
            validate : [isEmail, 'Please provide a valid email'] 
        },

        password : {
            type : String,
            required : [true, 'Please enter password'],
            minlength : [6, 'Minimum password length is 6 characters']
        }
    },

)
const User = mongoose.model('user', userSchema)
module.exports = User