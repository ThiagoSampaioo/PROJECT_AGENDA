
const { async } = require('regenerator-runtime');
const Contato = require('../models/ContatoModel');
exports.index=(req,res)=>{
    res.render('contato',{
        contato:{}
    });
}

exports.register= async (req,res)=>{
    try{
        const contato = new Contato(req.body);
        await contato.register();
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(()=> res.redirect('/contato/index'));
            return;
        };

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(()=> res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    }catch(e){
        console.log(e);
        return res.render('ERRO');
    }

};
exports.editIndex = async (req,res)=>{
    try{
        if(!req.params.id) return res.render('ERRO');
        const contato = await Contato.buscaPorId(req.params.id);
        if(!contato) return res.render('ERRO');
        res.render('contato',{contato});

    }catch(e){
        console.log(e);
        res.render('ERRO');
    };
};
 exports.edit =async function(req,res){
    try{
        if(!req.params.id) return res.render('ERRO');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(()=> res.redirect('/contato/index'));
            return;
        };
    
        req.flash('success', 'Contato atualizado com sucesso!');
        req.session.save(()=> res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    }catch(e){
        console.log(e);
        res.render('ERRO');
    }

 }

 exports.delete = async function(req,res){
    try{
        if(!req.params.id) return res.render('ERRO');
        const contato = await Contato.delete(req.params.id);
        if(!contato) return res.render('ERRO');
        req.flash('success', 'Contato apagado com sucesso!');
        req.session.save(()=> res.redirect(`/`));
        return;
    }catch(e){
        console.log(e);
        res.render('ERRO');
    };
};
