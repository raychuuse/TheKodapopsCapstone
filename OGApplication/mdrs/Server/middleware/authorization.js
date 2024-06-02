const jwt = require('jsonwebtoken');

const verifyAuthorization = (req, res, next) => {
    const header = req.headers['authorization'];

    if (header != null) {
        const bearer = header.split(' ');
        if (bearer.length > 1) {
            const token = bearer[1];
            jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
                if (err) {
                    console.error(err);
                    return res.status(403).json({message: 'Unauthorized'});
                } else {
                    if (auth.userID != null)
                        req.userID = auth.userID;
                    else req.userID = auth.id;
                    return next();
                }
            });
        } else {
            return res.status(403).json({message: 'Unauthorized'});
        }
    } else {
        return res.status(403).json({message: 'Unauthorized'});
    }

}

exports.verifyAuthorization = verifyAuthorization;