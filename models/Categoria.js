//como boa prática os models devem ser criados com letra maiúsculo no início e de estra no singular

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Categoria = new Schema({
    nome:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
        //Se o usuário não passar a data, por padrão ele vai passar a hora atual
    }
})

mongoose.model("categorias", Categoria)