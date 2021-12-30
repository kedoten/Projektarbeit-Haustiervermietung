/*const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "rootUser",
    database: "postgres"
})

client.query(`Select * from users`, (err,res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
} )*/
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./Login/passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

//Hier mit DB Connection ersetzen
const users = []


//Welche Dateien für die Ansicht verwendet werden  -  Muss auf die html Datei umgeschrieben werden 
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session( {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//Bilder
app.use( express.static("public"))


/*  app.get -> Seite durch entsprechende URL aurufbar -> Welche Datei für die Ansicht benutzt wird
*   app.post ->
*/  

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
   try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //Hier DB Push einfügen
    users.push({
        id: Date.now().toString(),
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        birthdate: req.body.birthdate,
        password: hashedPassword
    })
    res.redirect('/login')
   } catch {
    res.redirect('/register')
   }
   console.log(users)
})

app.get('/tiere', (req, res) => {
    res.render('tiere.ejs')
})

app.get('/tiere/hamster', (req, res) => {
    res.render('hamster.ejs')
})

//Website über (Powershell): npm run devStart       (URL): localhost:3000       erreichbar
app.listen(3000)