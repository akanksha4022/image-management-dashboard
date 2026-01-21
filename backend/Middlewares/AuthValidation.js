const Joi = require('joi');

const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: ''
    }
  }
};


const signupValidation = (req, res, next)=>{
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            "string.empty":"NAme is required",
            "string.min":"Name must be at least 3 characters long"
        }),
        email: Joi.string().email().required().messages(
            {
            "string.email": "Please enter a valid email",
            "string.empty": "Email is required"
        }),
        password: Joi.string().min(6).max(100).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password is required"
      })
    });

    const {error} =schema.validate(req.body, options);

    if(error){
        return res.status(400).json({ 
            message: "Bad Request", 
            errors: error.details.map(err=>err.message)
        });
    }
    next();
}

const loginValidation = (req, res, next)=>{
    const schema = Joi.object({
        
        email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email",
        "string.empty": "Email is required"
      }),
        password: Joi.string().min(6).max(100).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password is required"
      })
    });

    const {error} =schema.validate(req.body, options);

    if(error){
        return res.status(400).json({ 
            message: "Validation Error", 
            errors: error.details.map(err=>err.message)
        })
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}