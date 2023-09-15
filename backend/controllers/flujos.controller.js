const Flujos = require("../models/flujos.model");
const FlujosPasos = require("../models/flujos.pasos.model");

exports.crearFlujo = async (req, res) => {
    currentUserId = req.user.user_id;
    const { nombre, tiempo_resolucion, departamento } = req.body;
     await Flujos.create({
        nombre: nombre,
        creador_id: currentUserId,
        departamento: departamento,
        tiempo_resolucion: tiempo_resolucion,
        modificador_id: null,
        esta_eliminado: false
    })
    .then(()=>{
        res.status(201).send({message: "El flujo se creo exitosamente."})
    })
    .catch(()=>{
        res.status(400).send({message: "Hubo un error al crear el flujo."})
    });
}

exports.obtenerFlujos = async (req, res) => {
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };

    await Flujos.find(filtro)
    .populate('departamento')
    .then(flujos =>{
        res.status(200).send(flujos);
    })
    .catch(err =>{
        res.status(400).send("No se encontro ningun flujo.")
    });
}

exports.obtenerFlujoPorId = async (req, res) => {
    id = req.params.id;
    await Flujos.findById( id )
    .then(flujo =>{
        res.status(200).send(flujo);
    })
    .catch(err =>{
        res.status(400).send(`El flujo con id: ${id} no pudo ser encontrado.`)
    });
}

exports.modificarFlujo = async (req, res) => {
    const filter  = {_id: req.params.id};
    const { nombre, tiempo_resolucion } = req.body;

    let update = {
        ...( nombre && { nombre }),
        ...( tiempo_resolucion && { tiempo_resolucion })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;
    
    await Flujos.findOneAndUpdate(
        filter, update, {
        new: true
    }).then(doc => {
        res.status(200).send(
            {
                message: "Los cambios fueron aplicados.", 
                payload: doc
            });
    }).catch(err => {
        res.status(400).send("No se pudo modificar el documento.")
    })
}

exports.cambiarDisponibilidadDeUnFlujo = async (req, res) => {
    const flujo_id = req.params.id;

    const flujoFilter  = { _id: flujo_id };
    const pasosFilter = { flujo_id: { $eq : flujo_id } };

    const modificador = req.user.user_id;
    
    const method = req.method;
    const isDeleted = method == 'DELETE';
    const esta_eliminado = isDeleted ? true : false

    const update = {
        modificador_id: modificador,
        esta_eliminado: esta_eliminado
    }
    try{
        let flujo = await Flujos.findOneAndUpdate(flujoFilter, update, {
            new: true
        });
    
        let pasos = await FlujosPasos.updateMany(pasosFilter, update, {
            new: true
        });

        res.status(200).send({
            message: "Se desactivo el flujo y pasos relacionadas a el, de manera exitosa.",
            flujo: flujo,
            pasos: pasos
        })
    } catch(err){
        res.status(400).send({message: "Hubo un error no se pudo modificar el grupo."})
    }
    
}