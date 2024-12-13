// utils
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const bcrypt = require('bcrypt');
const PermissionError = require('./errors/PermissionError.js');

// models
const User = require('../models/User');

// user service
function jwtSign(user, res){
    const userInfo = {
        id: user.id,
        email: user.email,
        nome: user.nome,
    };
    const token = jwt.sign({
        user: userInfo
    }, authConfig.JWT_SECRET,
    {expiresIn: authConfig.JWT_EXPIRATION});

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false
    });
}

const notLoggedIn = (req, res, next) => {
    try {
        const token = cookieExtractor(req);
        if (token) {
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (error) => {
                    if (!(error instanceof jwt.TokenExpiredError)) {
                        let user = jwt.decode(token);
                        throw new PermissionError('Você já está logado como: ' + user.user.nome);
                    }
                },
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};

function cookieExtractor(req){
    let token = null;

    if (req && req.cookies){
        token = req.cookies['jwt'];
    }

    return token;
}

async function loginMiddleware(req, res, next) {
  try {
    const user = await User.findOne({where: {email: req.body.email}});
    if (!user) {
      throw new PermissionError('E-mail e/ou senha incorretos!');
    }

    const matchingPassword = await bcrypt.compare(req.body.senha, user.senha);
    if (!matchingPassword) {
      throw new PermissionError('E-mail e/ou senha incorretos!');
    }

    jwtSign(user, res);

    user.senha = undefined;
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
    notLoggedIn,
    loginMiddleware,
};