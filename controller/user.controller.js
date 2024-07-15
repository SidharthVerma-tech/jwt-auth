const User = require('../models/user.model')
const handleErrors = (err) => {
    // err.message property contain all the type of error we get
    console.log(err.message, err.code)
    let errors =  {email : '', password : ''}
    // Duplicate email
    if(err.code === 11000){
        errors.email = 'This email is already taken'
        return errors
    }
    // validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(err=>{
            const {properties} = err
            errors[properties.path] = properties.message
        })
        console.log(errors.email,errors.password)
    }
    
    return errors
}
module.exports.signup_get = (req,res) => {
    res.render('signup')
}
module.exports.login_get = (req,res) => {
    res.render('login')
}
module.exports.signup_post = async(req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.create({email, password})   
        res.status(200).json({
            status: "success",
            user
        })
    } catch (error) {
        const {email,password} = handleErrors(error)
        res.status(404).json({
            email : email,
            password: password,
        })
    }
}
module.exports.login_post = (req,res) => {
    const {email, password} = req.body;
    console.log(email)
    console.log(password)
    res.send('login')
}   
