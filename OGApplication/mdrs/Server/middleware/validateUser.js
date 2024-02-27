const validateUserBody = (req, res, next) => {
    const id = req.body.id
    const password = req.body.password
    // console.log(id)
    if(id === 'undefined' || password === 'undefined') {
        throw Error("An ID or a Password was not provided")
    }
    if(!id){
        throw Error("No ID provided")
    }
    if (isNaN(id)) {
        throw Error("Please provide non-special characters as your password or ID")
    }
    if(!password) {
        throw Error("No password provided") 
    }
    next();
}
exports.validateUserBody = validateUserBody;
