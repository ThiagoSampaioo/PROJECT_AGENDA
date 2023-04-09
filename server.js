
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const Mongostore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash');
mongoose.connect(process.env.CONNECTIONSTRING,
     { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
     })
    .then(() => {
        app.emit('pronto');
    })
    .catch(e => console.log(e));
const sessionOptions = session({
    secret: 'Aleatorio()',
    store: Mongostore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60*24*7,
        httpOnly:true
    }
});
app.use(sessionOptions);
app.use(flash());
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')))
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Esta escutando na porta 3000');
    });

});
