const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const handleErrors = (err) => {
    // err.message property contain all the type of error we get
    console.log(err.message, err.code)
    let errors =  {email : '', password : ''}
    // Duplicate email
    // validation errors
    if(err.message === 'Incorrect Email'){
        errors.email = 'That email is not registered'
    }
    if(err.message === 'Incorrect password'){
        errors.password = 'Invalid password'
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(err=>{
            const {properties} = err
            errors[properties.path] = properties.message
        })
        console.log(errors.email,errors.password)
    }
    
    return errors
}
const createToken = (id) => {
   return jwt.sign({id}, 'my-secret-key', {expiresIn : 30*24*60*60})
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
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly : true})
        res.status(200).json({
            status: "success",
            user : user._id
        })
    } catch (error) {
        const errors = handleErrors(error)
        res.status(404).json({
            errors
        })
    }
}
module.exports.login_post = async(req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly : true, maxAge : 30*24*60*60*1000})
        res.status(200).json({
            user : user._id
        })
    } catch (error) {
        const errors = handleErrors(error)
        res.status(404).json({
            errors
        })
    }
}   

module.exports.protected = (req,res,next) => {
    const token = req.cookies.jwt
    if(token){
       jwt.verify(token, 'my-secret-key', (err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
       })
    }else{
        res.redirect('/login')
    }
}
module.exports.logout = (req,res) => {
    res.cookie('jwt', '', {maxAge : 1})
    res.redirect('/')
}
module.exports.checkUser = async(req,res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'my-secret-key', async(err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                console.log(decodedToken)
                const user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }else{
        res.locals.user = null
        next()

    }

}