const validateID = (req, res, next) => {
    const id = req.query.id;
    if (!id) {
        throw Error("No ID Provided")
    }
    if (isNaN(id)) {
        throw Error("Invalid ID")
    }
    next();
};

exports.validateID = validateID;