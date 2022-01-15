//Database Connection Config
const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    user: "user",
    port: 5432,
    password: "user",
    database: "haustiervermietung"
})

const users = []
const tiere = []
const ticket= []

//Databasen connecten + User Ausgeben für Login 
client.connect()
    .then(() => console.log("Connected successfuly"))
    .then(() => client.query("Select * from users"))
    .then(result => result.rows.forEach(element => users.push(element)))
    .catch(e => console.log(e))


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./Login/passport-config');
const { user } = require('pg/lib/defaults');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

//Welche Dateien für die Ansicht verwendet werden  -  Muss auf die html Datei umgeschrieben werden 
app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Bilder
app.use(express.static("public"))


/*  app.get     ->  Seite durch entsprechende URL aurufbar -> Welche Datei für die Ansicht benutzt wird
*   app.post    ->  Funktion ausführen
*   app.delete  ->  Aktuelle Sitzung "löschen" = logout button
*   app.use     ->  Packages benutzen
*   app.set     ->  ?Umgebungsvariabeln? setzen  
*/

// index
app.get('/', (req, res) => {
    res.render('index.ejs')
})

// Login
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('Login/login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('Login/register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    
    //Password wird nun gehashed und in der Datenbank gespeichert, Zusätzlich wird der erstellte User in ein 
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        client.query("insert into users(lastname,firstname,email,birthdate,password) values($1, $2, $3, $4, $5)",
            [req.body.lastname, req.body.firstname, req.body.email, req.body.birthdate, hashedPassword])
            .then(() => users.length = 0)
            .then(() => client.query("Select * from users"))
            .then(result => result.rows.forEach(element => users.push(element)))
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    
})

// Tiere
app.get('/tiere', (req, res) => {
    res.render('Tiere/tiere.ejs')
})

app.get('/tiere/hamster', (req, res) => {

    tiere.length = 0
    client.query("Select * from tiere where tierart = 'Hamster'")
        .then(result => result.rows.forEach(element => tiere.push(element)))

        .then(() => res.render('Tiere/hamster.ejs', { tiere }))
})

app.get('/tiere/hund', (req, res) => {

    tiere.length = 0
    client.query("Select * from tiere where tierart = 'Hund'")
        .then(result => result.rows.forEach(element => tiere.push(element)))

        .then(() => res.render('Tiere/hund.ejs', { tiere }))
})

app.get('/tiere/katze', (req, res) => {

    tiere.length = 0
    client.query("Select * from tiere where tierart = 'Katze'")
        .then(result => result.rows.forEach(element => tiere.push(element)))

        .then(() => res.render('Tiere/katze.ejs', { tiere }))
})

app.get('/tiere/schildkroete', (req, res) => {

    tiere.length = 0
    client.query("Select * from tiere where tierart = 'Schildkröte'")
        .then(result => result.rows.forEach(element => tiere.push(element)))

        .then(() => res.render('Tiere/schildkroete.ejs', { tiere }))
})

app.get('/tiere/sonstige', (req, res) => {

    tiere.length = 0
    client.query("Select * from tiere where tierart = ''")
        .then(result => result.rows.forEach(element => tiere.push(element)))

        .then(() => res.render('Tiere/sonstige.ejs', { tiere }))
})

app.get('/tiere/vogel', (req, res) => {

    tiere.length = 0
    client.query("Select * from tiere where tierart = 'vogel'")
        .then(result => result.rows.forEach(element => tiere.push(element)))

        .then(() => res.render('Tiere/vogel.ejs', { tiere }))
})

//Tierheim
app.get('/tierheim', (req, res) => {
    res.render('Tierheim/tierheime.ejs')
})

app.get('/tierheim/kontakt', (req, res) => {
    res.render('Tierheim/kontakt.ejs')
})

app.post('/tierheim/kontakt', (req, res) => {
    
   
    try {
        client.query("insert into ticket (ttart, kname, kemail , kselect, ktext, id) values($1, $2, $3, $4, $5, $6)",
            [req.body.ttart , req.body.kname, req.body.kemail, req.body.kselect, req.body.ktext, req.user.id])
            .then(() => ticket.length = 0)
            .then(() => client.query("Select * from ticket"))
            .then(result => result.rows.forEach(element => ticket.push(element)))
        res.redirect('/tierheim/kontakt')
    } catch {
        res.redirect('/')
    }
    
})

app.get('/tierheim/partner_werden', (req, res) => {
    res.render('Tierheim/partner_werden.ejs')
})
app.post('/tierheim/partner_werden', (req, res) => {
    
   
    try {
        client.query("insert into ticket (ttart, kname, kemail, kadresse, ktext) values($1, $2, $3, $4, $5)",
            [req.body.ttart , req.body.pname, req.body.pemail, req.body.padresse, req.body.ptext])
            .then(() => ticket.length = 0)
            .then(() => client.query("Select * from ticket"))
            .then(result => result.rows.forEach(element => ticket.push(element)))
        res.redirect('/tierheim/partner_werden')
    } catch {
        res.redirect('/')
    }
    
})
//Über uns
app.get('/ueberUns', (req, res) => {
    res.render('UeberUns/ueberUns.ejs')
})

//Adminseite
app.get('/addTiere', checkAdmin, (req, res) => {
    res.render('Admin/addTiere.ejs')
})

app.post('/addTiere', checkAdmin, (req, res) => {
    
   
    try {
        client.query("insert into tiere (tname, tierart, rasse, talter , thid) values($1, $2, $3, $4, $5)",
            [req.body.tname, req.body.tierart, req.body.rasse, req.body.talter, thid])
            .then(() => tiere.length = 0)
            .then(() => client.query("Select * from tiere"))
            .then(result => result.rows.forEach(element => tiere.push(element)))
        res.redirect('/addTiere')
    } catch {
        res.redirect('/')
    }
    
})

app.get('/addTierheim', checkAdmin, (req, res) => {
    res.render('Admin/addTierheim.ejs')
})

app.post('/addTierheim', checkAdmin, (req, res) => {
    
   
    try {
        client.query("insert into tierheim (thname, thadresse) values($1, $2)",
            [req.body.thname, req.body.thadresse,])
            .then(() => tierheim.length = 0)
            .then(() => client.query("Select * from tierheim"))
            .then(result => result.rows.forEach(element => tierheim.push(element)))
        res.redirect('/addTierheim')
    } catch {
        res.redirect('/')
    }
    
})
//Logout
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


//wenn man nicht eingeloggt ist wird man zum login weitergeleitet 
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}


//wenn nicht angemeldet wird man normal weitergeleitet
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}

//wenn man kein Admin ist wird man zur Start Seite weitergeleitet
function checkAdmin(req, res, next) {
     if (req.isAuthenticated() && req.user.id == 1) {
          return next() 
        } 
        
        res.redirect('/') 
    }



//Website über (Powershell): npm run devStart       (URL): localhost:3000       erreichbar
app.listen(3000)