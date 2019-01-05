const jwt = require('jsonwebtoken');

// ===========================
// token verification
// ===========================

let tokenVerify = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

// ===========================
// ADMIN_ROLE verification
// ===========================

let adminRoleVerification = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario.role);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'User has not ADMIN role'
            }
        });

    }

};


module.exports = {
    tokenVerify,
    adminRoleVerification
}