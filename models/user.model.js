const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema(
    {
        email : {
            type : String,
            required : [true, 'Please provide email'],
            unique : true,
            lowercase : true,
            // validate : [(val) = {} , ' ']
            validate : [isEmail, 'Please provide a valid email']

        },

        password : {
            type : String,
            required : [true, 'Please enter password'],
            minlength : [6, 'Minimum password length is 6 characters']
        }
    },

)

// UseSchema .post is a middle ware which takes a callback function is called every time when the document
// or object saved in a document
// takes the normal function because we have to point to to this object
userSchema.post('save', function(){
    // after the document is saved
    console.log("After the document is saved")
    console.log(this)
})
userSchema.pre('save', async function(next){
    // before the document is saved
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
userSchema.statics.login = async function (email, password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect Email')
}
const User = mongoose.model('user', userSchema)
module.exports = User