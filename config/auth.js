//Passport é um midlewere de autentificação que contem várias estrégias de autentificação, vamos usar a estratégia local e se chamam assim pk usamos o nosso própio banco de dados para realizar a autentificação

const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


//Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){

    //Estamos fazendo a autentificação atravez do email, mas poderia também ser feito pelo nome do usuário
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done)=>{
        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorrecta"})
                }
            })
        })
    }))
    

//As duas funções seguintes servem para salvar os dados do usuários

passport.serializeUser((usuario, done)=>{

    done(null, usuario.id)

})

passport.deserializeUser((id, done)=>{

    Usuario.findById(id, (err, usuario)=>{
        done(err, usuario)
    })

})


}
