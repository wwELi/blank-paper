const passport = require('passport');
const { queryUserByName } = require('../repository/user');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy; //jwt策略
const ExtractJwt = passportJwt.ExtractJwt; //提取jwt

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'SECRET'
}

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    const user = await queryUserByName(jwtPayload.username);
    done(null, user ? user : false);
}))

// 3. 配置 Passport.js 序列化和反序列化用户
passport.serializeUser((user, done) => {
    done(null, user.name);
});

passport.deserializeUser(async (name, done) => {
    const user = await queryUserByName(name);
    done(null, user);
});

passport.authenticateMiddleware = function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
};

module.exports = passport;