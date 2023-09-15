const Prioridad = require("../models/ticket.prioridades.model");

exports.crearPrioridad = async (req, res) => {
    currentUserId = req.user.user_id;
    const {nombre, color} = req.body;
     await Prioridad.create({
        nombre: nombre,
        color: color,
        creador_id: currentUserId
    })
    .then(()=>{
        res.status(201).send("La prioridad se creo exitosamente.")
    })
    .catch((err)=>{
        res.status(400).send(
            {
                error: err,
                message: "Hubo un error al crear la prioridad."
            }
        );
    });
}

exports.obtenerPrioridades = async (req, res) => {
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };
    await Prioridad.find(filtro)
    .then(prioridades => {
        res.status(201).send(prioridades);
    })
    .catch(err => {
        res.status(400).send("No se pudo encontrar ninguna prioridad.")
    })
};

exports.obtenerPrioridadPorId = async (req, res) => {
    const id = req.params.id;

    await Prioridad.findById( id )
    .then(prioridad => {
        res.status(200).send(prioridad);
    })
    .catch(err =>{
        res.status(400).send(`No se encontro la prioridad con id: ${id}`)
    })
}

exports.actualizarPrioridad = async (req, res) => {
    const filter  = { _id: req.params.id }

    console.log(filter);

    const { nombre, color } = req.body;

    let update = {
        ...( nombre && { nombre }),
        ...( color  && { color  })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;

    await Prioridad.findOneAndUpdate(
        filter, update, {
        new: true
    }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(400).send("No se pudo modificar el documento.")
    })
}

exports.cambiarDisponibilidadDeUnaPrioridad = async (req, res) => {
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
        let categoria = await Prioridad.findOneAndUpdate(filtro, update, {
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