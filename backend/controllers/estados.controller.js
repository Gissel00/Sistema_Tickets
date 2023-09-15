const Estados = require("../models/ticket.estados.model");

exports.crearEstado = async (req, res) => {
    currentUserId = req.user.user_id;
    const {nombre, color} = req.body;
     await Estados.create({
        nombre: nombre,
        color: color,
        esta_eliminado: false,
        modificador_id: null, 
        creador_id: currentUserId
    })
    .then(()=>{
        res.status(201).send("El estado se creo exitosamente.")
    })
    .catch(()=>{
        res.status(400).send("Hubo un error al crear el estado.")
    });
}

exports.obtenerEstados = async (req, res) => {
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };
    await Estados.find(filtro)
    .then(estados =>{
        res.status(200).send(estados);
    })
    .catch(err => {
        res.status(400).send("No se encontro ningun estado.")
    });
}

exports.obtenerEstadoPorId = async (req, res) => {
    const id = req.params.id;
    await Estados.findById( id )
    .then(estados =>{
        res.status(200).send(estados);
    })
    .catch(err => {
        res.status(400).send("No se encontro ningun estado.")
    });
}

exports.actualizarEstado = async (req, res) => {
    const filter  = {_id: req.params.id};

    const { nombre, color } = req.body;

     let update = {
        ...(nombre  && { nombre }),
        ...(color   && { color  })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;
    
    await Estados.findOneAndUpdate(
        filter, update, {
        new: true
    }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(400).send({message: "No se pudo modificar el documento."})
    })
}

exports.cambiarDisponibilidadDeUnEstado = async (req, res) => {
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
        let estado = await Estados.findOneAndUpdate(filtro, update, {
            new: true
        });

        res.status(200).send({
            message: "Se desactivo el estado de manera exitosa.",
            estado: estado
        });
    } catch(err){
        res.status(400).send({message: "Hubo un error no se pudo modificar el documento."})
    }
}