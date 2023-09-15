const DepartamentosModel = require('../models/departamentos.model');

exports.crearDepartamento = async (req, res) => {
    currentUserId = req.user.user_id;
    const { nombreDepartamento, descripcion } = req.body;

    if(!nombreDepartamento) return res.status(401).send({message: "Debe de agregar el nombre del departamento."});

     await DepartamentosModel.create({
        nombreDepartamento: nombreDepartamento,
        descripcion: descripcion ? descripcion : null,
        creador_id: currentUserId,
        modificador_id: null,
        esta_eliminado: false
    })
    .then(()=>{
        res.status(201).send({message: "El departamento se creo exitosamente."})
    })
    .catch(()=>{
        res.status(400).send({message: "Hubo un error al crear el departamento."})
    });
}

exports.obtenerDepartamentos = async (req, res) => {
    const eliminados = Boolean((req.query.eliminados || "").replace(/\s*(false|null|undefined|0)\s*/i, ""));
    const activos = false;
    const filtro = { esta_eliminado: { $in: [activos, eliminados] } };

    await DepartamentosModel.find(filtro)
    .then(depts =>{
        res.status(200).send(depts);
    })
    .catch(err =>{
        res.status(400).send("No se encontro ningun departamento.")
    });
}

exports.obtenerDepartamentoPorId = async (req, res) => {
    id = req.params.id;
    await DepartamentosModel.findById( {_id: id} )
    .then(depts =>{
        res.status(200).send(depts);
    })
    .catch(err =>{
        res.status(400).send(`El departamento con id: ${id} no pudo ser encontrado.`)
    });
}

exports.modificarDepartamento = async (req, res) => {
    const filter  = {_id: req.params.id};
    const { nombre, descripcion } = req.body;

    let update = {
        ...( nombre && { nombre }),
        ...( descripcion && { tiempo_resolucion })
    }

    const modificador = req.user.user_id;
    update.modificador_id = modificador;
    
    await DepartamentosModel.findOneAndUpdate(
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

exports.cambiarDisponibilidadDepartamento = async (req, res) => {
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
        let depto = await DepartamentosModel.findOneAndUpdate(filtro, update, {
            new: true
        });

        res.status(200).send({
            message: "Se desactivo el departamento de manera exitosa.",
            departamento: depto
        });
    } catch(err){
        res.status(400).send({message: "Hubo un error no se pudo modificar el documento."})
    }
}