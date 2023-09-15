const horariosModel = require('../models/horario.operacion.model');


exports.crearHorarioDeOperaciones = async(req, res)=> {
    const horarios = await horariosModel.find({}).lean().exec();
    const hasOneRecord = horarios.length > 0;
    if(hasOneRecord) return res.status(500).send("Solo puede tener un horario.");
    const { horaInicio, horaFinal, incluyeFinesDeSemana } = req.body;
    if(!horaInicio) return res.status(500).send("Debe de incluir la hora de inicio.");
    if(!horaFinal) return res.status(500).send("Debe de incluir la hora final.");
    if(incluyeFinesDeSemana === undefined) return res.status(500).send("Debe de incluir si los fines de semana son necesarios.");
    horariosModel.create({ 
        horaInicio, 
        horaFinal, 
        incluyeFinesDeSemana
    })
    .then(()=>{
        res.status(201).send("Se agregaron los registros exitosamente.");
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Hubo un error, no se agregaron los registros.");
    })
};

exports.actualizarHorarioDeOperaciones = (req, res)=> {
    const id = req.params.id;
    const { horaInicio, horaFinal, incluyeFinesDeSemana } = req.body;
    const data = {
        ...( horaInicio                      &&  { horaInicio } ),
        ...( horaFinal                       &&  { horaFinal } ),
        ...( (incluyeFinesDeSemana !== undefined) &&  { incluyeFinesDeSemana } ),
    }

    horariosModel.updateOne({ _id: id}, data, {
        new: true
    })
    .then(()=>{
        res.status(201).send("Se actualizo el registro exitosamente.");
    })
    .catch(err =>{
        res.status(500).send("Hubo un error, no se actualizo el registro.");
    })
};

exports.obtenerHorarios = (req, res)=>{
    horariosModel.find({})
    .then(data=>{
        res.status(201).send(data);
    })
    .catch(err=>{
        res.status(500).send({message: "Hubo un error, no se pudo obtener el horario."})
    })
}