const Pasos = require("../models/flujos.pasos.model");

exports.crearPaso = async (req, res) => {
    
    currentUserId = req.user.user_id;

    const { nombre, orden, tiempo_de_respuesta_hrs, flujo_id } = req.body;

     await Pasos.create({
        nombre                  : nombre,
        orden                   : orden,
        tiempo_de_respuesta_hrs : tiempo_de_respuesta_hrs,
        flujo_id                : flujo_id,
        creador_id              : currentUserId,
        modificador_id          : null,
        esta_eliminado          : false
    })
    .then(()=>{
        res.status(201).send("El flujo se creo exitosamente.")
    })
    .catch(()=>{
        res.status(400).send("Hubo un error al crear el flujo.")
    });
};

exports.obtenerPasos = async (req, res) => {
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };

    await Pasos.find(filtro)
    .then(pasos =>{
        res.status(200).send(pasos);
    })
    .catch(err =>{
        res.status(400).send("No se encontro ningun paso.")
    });
}

exports.obtenerPasosPorId = async (req, res) => {
    id = req.params.id;
    await Pasos.findById( id )
    .then(pasos =>{
        res.status(200).send(pasos);
    })
    .catch(err =>{
        res.status(400).send(`No se encontro ningun paso, para el id: ${ticket_id} `)
    });
}

exports.actualizarPaso = async (req, res) => {
    const filter  = req.params.id;

    const { nombre, orden, tiempo_de_respuesta_hrs, flujo_id } = req.body;

     let update = {
        ...( nombre                     && { nombre                     }),
        ...( orden                      && { orden                      }),
        ...( tiempo_de_respuesta_hrs    && { tiempo_de_respuesta_hrs    }),
        ...( flujo_id                   && { flujo_id                   })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;
    
    await Pasos.findOneAndUpdate(
        filter, update, {
        new: true
    }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(400).send("No se pudo modificar el documento.")
    })
}

exports.cambiarDisponibilidadDeUnPaso = async (req, res) => {
    const id = req.params.id;
    const filtro  = { _id: id };
    const modificador = req.user.user_id;

    const method = req.method;
    const isDeleted = method == 'DELETE';
    const esta_eliminado = isDeleted ? true : false;

    const update = {
        modificador_id: modificador,
        esta_eliminado: esta_eliminado
    }
    try{
        let paso = await Pasos.findOneAndUpdate(filtro, update, {
            new: true
        });

        res.status(200).send({
            message: "Se desactivo el paso de flujo de manera exitosa.",
            paso: paso
        });
    } catch(err){
        res.status(400).send({message: "Hubo un error no se pudo modificar el documento."})
    }
}