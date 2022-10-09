const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports=(req,res,next)=>{
  const {authorization} = req.headers
 console.log(authorization)
 next();
}
