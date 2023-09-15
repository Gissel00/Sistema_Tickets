const Categoria = require("../models/ticket.categorias.model");

exports.crearCategoria = async (req, res) => {
    currentUserId = req.user.user_id;
    const {nombre, color, grupo_id} = req.body;

     await Categoria.create({
        nombre: nombre,
        color: color,
        grupo_id: grupo_id,
        modificador_id: null,
        creador_id: currentUserId, 
        esta_eliminado: false
    })
    .then(()=>{
        res.status(201).json({message: "La categoria se creo exitosamente."})
    })
    .catch((err)=>{
        res.status(400).send(err)
    })
}

exports.obtenerCategorias = async (req, res) =>{
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };
    await Categoria.find(filtro)
    .then(categorias => {
        res.status(200).send(categorias)
    })
    .catch(err =>{
        res.status(400).send("No se pudieron obtener las categorias.")
    });
}

exports.obtenerCategoriaPorId = async (req, res) =>{
    const id  = req.params.id;
    await Categoria.findById( id )
    .then(categorias => {
        res.status(200).send(categorias)
    })
    .catch(err =>{
        res.status(400).send(`No se encontro la categoria, con id: ${id}`)
    });
}

exports.actualizarCategoria = async (req, res) => {
    const filter  = req.params.id;
    const { nombre, color, grupo_id } = req.body;
    
     let update = {
        ...( nombre     && { nombre   }),
        ...( color      && { color    }),
        ...( grupo_id   && { grupo_id })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;

    await Categoria.findByIdAndUpdate(
        filter, update, {
        new: true
    }).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(400).send("No se pudo modificar el documento.")
    })
}

exports.cambiarDisponibilidadDeUnaCategoria = async (req, res) => {
    const id = req.params.id;
    const filtro  = { _id: id };
    const modificador = req.user.user_id;

    const method = req.method;
    const isDeleted = method == 'DELETE';
    const esta_eliminado = isDeleted ? true : false

    const update = {
        modificador_id: modificador,
        esta_eliminado: esta_eliminado
    }
    try{
        let categoria = await Categoria.findOneAndUpdate(filtro, update, {
            new: true
        });

        res.status(200).send({
            message: "Se desactivo la categoria de manera exitosa.",
            categoria: categoria
        });
    } catch(err){
        res.status(400).send({message: "Hubo un error no se pudo modificar el documento."})
    }
}