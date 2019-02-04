const express = require('express');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const Mysql_store = require('express-mysql-session');
const { db_connection } = require('./keys');
const passport = require('passport');
//inicializacion
const app = express();
require('./lib/passport');
//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', 'hbs');

//middelwares
app.use(session({
    secret: 'session',
    resave: false,
    saveUninitialized: false,
    store: new Mysql_store(db_connection)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

//Varias Globales

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//rutas o url

app.use(require('./routes/index'));
app.use(require('./routes/autentication'));
app.use('/links', require('./routes/links'));

//archivos public o static files

app.use(express.static(path.join(__dirname, 'public')));
//Haciendo correr el servidor
app.listen(app.get('port'), () => {
    console.log('server on port ' + app.get('port'));
});