const jwt = require('jsonwebtoken');

const verifyAuthorization = (req, res, next) => {
    const header = req.headers['authorization'];

    if (header != null) {
        const bearer = header.split(' ');
        if (bearer.length > 1) {
            const token = bearer[1];
            jwt.verify(token, 'secret key', (err, auth) => {
                console.info(err, auth);
                if (err) {
                    return res.status(403).json({message: 'Unauthorized'});
                } else {
                    req.userID = auth.id;
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