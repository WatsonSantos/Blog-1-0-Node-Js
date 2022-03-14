const express = require('express')
const router = express.Router() //metodo para definir rotas e arquivos separado do arquivo separado
const mongoose = require("mongoose")
require("..//models/Categoria") //..significa voltar um pasta/diretório
require('../models/Postagem')
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")
//Importando o helper eAdmin.....{eAdmin} significa que vamos pegar somente a função {eAdmin} dentro no objecto no módulo eAdmin e em cada página que eu quiser proteger é só colocar o "eAdmin"


//Usando um model de forma externa
  //1- Importar o mongoose
  //2-chama o arquivo do model
  //3-chamar a função para passar a referência do model
const Categoria = mongoose.model("categorias")


router.get('/',eAdmin, (req, res)=>{
    res.render("admin/index")
})

router.get('/posts',eAdmin, (req, res)=>{
    res.send("Página de posts")
})

router.get('/categorias',eAdmin, (req, res)=>{
    //lista todas a categorias que existe
    Categoria.findOne().find().lean().then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.post("/categorias/nova",eAdmin, (req, res)=>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null){
        erros.push({texto:"Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome de categoria muito equeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros})
    }else{

        const novaCategoria = {
            //nome e slug fazem referência ao name dos inputs
            nome: req.body.nome,
            slug: req.body.slug
        }
          
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria tente novamente")

            res.redirect("/admin")
        })
    }
})


//Rota para edção de categoarias
router.get("/categorias/edit/:id", eAdmin,(req, res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editcategorias",{categoria: categoria} )
    }).catch((err)=>{
        req.flash("error_msg","Esta categoria não exite!")
        res.redirect("/admin/categorias")
    })
    
})

router.get('/categorias/add',eAdmin, (req, res)=>{
    res.render("admin/addcategorias")
})

router.post("/categorias/edit",eAdmin,(req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})


router.post("/categorias/deletar",eAdmin, (req, res)=>{
    Categoria.deleteOne({__id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
        
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao tentar deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens",eAdmin,(req, res)=>{

    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render("admin/postagens", {postagens: postagens})

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})

//Rota que pegas as Postagens e retorna para a tela
router.get("/postagens/add",eAdmin,(req, res)=>{
    Categoria.findOne().find().lean().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova",eAdmin, (req,res)=>{

    var erros=[]

    if(req.body.categoria == "0"){
        erros.push({texto:"Categoria inválida, registre uma categoria."})
    }

    if(erros.length > 0){

        res.render("admin/addpostagem", {erros: erros})
    }else{

        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso.")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })

    }

})


router.get("/postagens/edit/:id", eAdmin,(req, res)=>{

    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{

        Categoria.find().lean().then((categorias)=>{
            
              res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})


        }).catch((err)=>{
            req.flash("error-msg","Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/postagens")
    })
 
})


router.post("/postagem/edit",eAdmin,(req, res)=>{

    Postagem.findOne({_id: req.body.id}).then((postagem)=>{

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria


        postagem.save().then(()=>{
            req.flash("success_msg","Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro")
            res.redirect("/admin/postagens")
        })

    }).catch((err)=>{
        req.flash("error-msg","Houve um erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })
} )

router.post("/postagens/deletar",eAdmin,(req, res)=>{
 //deletando de outra forma, mas não é muito segura porque é uma rota get
     Postagem.deleteOne({__id: req.body.id}).then(()=>{
         req.flash("success_msg","Postagem deletada com sucesso!")
         res.redirect("/admin/postagens")
     }).catch((err)=>{
         req.flash("error_msg", "Houve um erro interno")
         res.redirect("/admin/postagens")
     })

})

module.exports = router