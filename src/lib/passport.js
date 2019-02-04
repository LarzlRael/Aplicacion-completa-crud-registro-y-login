const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../dataBase');
const helpers = require('../lib/helpers');



passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);

    const row = await pool.query('SELECT * FROM users WHERE username = ? ', [username]);
    if (row.length > 0) {
        const user = row[0];
        const valid_password = await helpers.comprarContraseña(password, user.password);
        if (valid_password) {
            done(null, user, req.flash('success' + 'Bievenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message' + 'el usuario no existe'));
    }

}));




passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    /* console.log(req.body); */
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    //cifrando la contraseña

    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    console.log(result);

    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
});
