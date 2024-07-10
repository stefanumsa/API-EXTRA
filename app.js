const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const app = express();
const fs = require('node:fs');
const usuarios = require('./database/tables/usuarios');
const authMiddleWare = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');
const config = require('./config');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const SQLiteStore = require('connect-sqlite3')(session);
const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2');
const port = 3004;



app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

// Configuración de BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto a tu usuario de MySQL
    password: 'elprimo', // Cambia esto a tu contraseña de MySQL
    database: 'calculadoraIMC' // Cambia esto a tu base de datos de MySQL
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Hacer que la conexión de la base de datos esté disponible globalmente
global.db = db;

// Importar las rutas de la API
const bmiRoutes = require('./routes/bmiRoutes');
app.use('/api', bmiRoutes);

// Configuración de las vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Archivos estáticos
app.use(express.static('public'));

// Importar rutas antiguas (si necesitas mantenerlas)
const oldRoutes = require('./routes/index');
app.use('/', oldRoutes);



// espacio

app.use(bodyParser.urlencoded({ extended: true }));

// Configurar el middleware para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar el motor de plantillas para usar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Importar y usar las rutas definidas en resultado.js
const resultadoRoute = require('./routes/resultado2');
app.use('/', resultadoRoute);

// Define la ruta /calculadora-imc2
app.get('/calculadora-imc2', (req, res) => {
  res.render('calculadora-imc2');
});

app.get('/opciones', (req, res) => {
  res.render('opciones');
});




// Configura el motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Define la ruta /informacion
app.get('/informacion', (req, res) => {
  res.render('informacion');
});

// Configuración de Pug como motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Ruta para los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analizar el cuerpo de los formularios
app.use(bodyParser.urlencoded({ extended: true }));


// Configuración de la sesión
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));



app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
});


app.use(cookieParser());

dotenv.config();

app.use(session({
  secret: process.env.ACCESS_TOKEN_SECRET, // Clave secreta para firmar la cookie de sesión
  resave: false,
  saveUninitialized: true,
  store: new SQLiteStore({ db: 'sessionsDB.sqlite', table: 'sessions' }) // Almacena las sesiones en una base de datos SQLite
}));

app.use(flash());

// Configurar Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configurar estrategia de autenticación local
passport.use(new LocalStrategy(
async (username, password, done) => {
  try {
    const user = await usuarios.obtenerPorNombre(username);
    if (!user) {
      return done(null, false, { message: 'Usuario incorrecto.' });
    }
    const passwordMatch = await authMiddleWare.comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return done(null, false, { message: 'Contraseña incorrecta.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
await usuarios.obtenerPorId(id).then((user) => {
  done(null, user);
}).catch((error) => {
  done(error, null);
});
});

app.use(express.urlencoded({ extended: true }));

// Configuracion de la plantilla pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar archivos estáticos 
app.use(express.static('public'));
app.use(express.json());


app.get('/logout', async (req, res) => {
  await req.logout(async (err) => {
    if (err) {
      // Manejo del error, si es necesario
      console.error(err);
    }
    //req.session.destroy(); // Eliminar la sesión completa
    await req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
        return res.status(500).send('Error al cerrar sesión');
      }
      console.log('req.session.destroy finalizado correctamente');
    });
    // Eliminar el contenido del almacén de sesiones
    await req.sessionStore.clear((err) => {
      if (err) {
        console.error('Error al limpiar el almacén de sesiones:', err);
        return res.status(500).send('Error al cerrar sesión');
      }
      console.log('req.sessionStore.clear finalizado correctamente');
    });
    res.clearCookie('token');
    res.redirect('/'); // Redirigir a la página principal u otra página de tu elección
  });
});




// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const loginRouter = require('./routes/login');
const registrarUsuarioRouter = require('./routes/registrar-usuario');
const registroRouter = require('./routes/registro');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/auth', authRouter); 
app.use('/login', loginRouter);
app.use('/registro', registroRouter);
app.use('/registrar-usuario', registrarUsuarioRouter);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto 3004');
});
