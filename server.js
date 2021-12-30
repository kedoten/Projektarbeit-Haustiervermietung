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

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

//Hier mit DB Connection ersetzen
const users = []


//Welche Dateien für die Ansicht verwendet werden  -  Muss auf die html Datei umgeschrieben werden 
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

/*  app.get -> Seite durch entsprechende URL aurufbar -> Welche Datei für die Ansicht benutzt wird
*   app.post ->
*/  

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', (req, res) => {
   
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
   try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
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

//Website über (Powershell): npm run devStart       (URL): localhost:3000       erreichbar
app.listen(3000)