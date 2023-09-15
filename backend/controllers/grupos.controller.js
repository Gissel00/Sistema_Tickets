const Grupos = require("../models/ticket.grupos.model");
const Categorias = require("../models/ticket.categorias.model");

exports.crearGrupo = async (req, res) => {
    currentUserId = req.user.user_id;
    const {nombre, color} = req.body;
     await Grupos.create({
        nombre: nombre,
        color: color,
        creador_id: currentUserId,
        modificador_id: null,
        esta_eliminado: false
    })
    .then(()=>{
        res.status(201).json({message: "El grupo se creo exitosamente."})
    })
    .catch(()=>{
        res.status(400).send("Hubo un error al crear el grupo.")
    });
}

exports.obtenerGrupos = async (req, res) => {
    
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };

    await Grupos.find(filtro)
    .then(grupos => {
        res.status(200).json(grupos);
    })
    .catch(err => {
        res.status(400).send("No se encontro ningun grupo.")
    });
};

exports.obtenerGrupoPorId = async (req, res) => {
    const id = req.params.id;
    await Grupos.findById(id)
    .then(grupo => {
        res.status(200).send(grupo);
    })
    .catch(err => {
        res.status(400).send(`No se encontro el grupo con id: ${id}`)
    });

};

exports.modificarGrupo = async (req, res) => {
    const filter  = {_id: req.params.id};
    const { nombre, color } = req.body;

     let update = {
        ...( nombre && { nombre }),
        ...( color  && { color  })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;
    
    await Grupos.findOneAndUpdate(
        filter, update, {
        new: true
    }).then(doc => {
        res.status(200).send(
            {
                message: "Los cambios fueron aplicados.", 
                payload: doc
            });
    }).catch(err => {
        res.status(400).send(
            {
                message: "No se pudo modificar el documento.", 
                err: err.codeName || null
            });
    })
}

exports.cambiarDisponibilidadDeUnGrupo = async (req, res) => {
    const grupo_id = req.params.id;

    const grupoFilter  = { _id: grupo_id };
    const categoriaFilter = { grupo_id: { $eq : grupo_id } };

    const modificador = req.user.user_id;
    
    const method = req.method;
    const isDeleted = method == 'DELETE';
    const esta_eliminado = isDeleted ? true : false

    const update = {
        modificador_id: modificador,
        esta_eliminado: esta_eliminado
    }
    try{
        let grupo = await Grupos.findOneAndUpdate(grupoFilter, update, {
            new: true
        });
    
        let categorias = await Categorias.updateMany(categoriaFilter, update, {
            new: true
        });

        res.status(200).send({
            message: "Se desactivo el grupo y categorias relacionadas a el, de manera exitosa.",
            grupo: grupo,
            categorias: categorias
        })
    } catch(err){
        res.status(400).send({message: "Hubo un error no se pudo modificar el grupo."})
    }
    
}

