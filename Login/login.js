/*simpler Password vergleich, keine ausreichende Sicherheit
function validate()
{
    var username=document.getElementById("username").value;
    
    if(username=="admin"&& password=="admin")
    {
        alert("login succesfully");
        return false;
    }
    else
    {
        alert("login failed")
    }  
}*/

//Salt + Hash für Password Sicherung = Register 
function register() {

    const bcrypt = require ('bcrypt');

    const saltRounds = 10;
    var password = "ousdihgos";

    bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash) {
            //store hash in database einfügen
        });
    });

}


//Password vergleich
function login() {
   
    var passwordL=document.getElementById("password").value;

    bcrypt.compare(passwordL, hash, function(err, result) {
      if (result) {
        console.log("It matches!")
      }
      else {
        console.log("Invalid password!");
      }
    });

}
