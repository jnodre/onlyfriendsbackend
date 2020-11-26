const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport')
const controladorUsuario = require('./api/users/users.controller');
const cors = require('cors');
const usersRouter = require('./api/users/users.router')
const app = express();
require('dotenv').config()
const MONGO_URL = `mongodb+srv://admin:${process.env.MONGODB_ADMIN_PASSWORD}@cluster0.by8p6.mongodb.net/onlyfriends?retryWrites=true&w=majority`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err)=>{
  throw err;
  process.exit(1);
})


app.use(session({ 
  secret: 'SECRET',
  resave: true,
  saveUninitialized: true,
  store : new MongoStore({
      url: MONGO_URL,
      autoReconnet: true
  })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)


app.post('/auth/register', controladorUsuario.postSingup);
app.post('/auth/login', controladorUsuario.postLogin);
app.get('/auth/logout',passportConfig.estaAutenticado ,controladorUsuario.logout);
app.get('/auth/usuarioInfo', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user);
})
app.get('/auth/isAuth' , passportConfig.AuthSimple, (req, res) => {
  res.json({"status":"true"});
})

app.listen(3000, ()=>{
  console.log(`escuchando en el puerto 3000`);
})
