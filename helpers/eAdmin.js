//Helpers são para ajudar com algumas questôes, nesse casso em concreto esse helper ajuda na questão de ser ou não administrador

module.exports = {

    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }
        req.flash("error_msg","Você precisa ser um administrador")
        res.redirect("/")
    }
}