const TicketHistorico = require("../models/ticket.historico.actualizaciones.model");
const Flujo = require('../models/flujos.model');
const helper = require("../config/helpers/index");
const horariosModel = require('../models/horario.operacion.model');

function workingHoursBetweenDates(startDate, endDate, dayStart, dayEnd, includeWeekends) {
  var minutesWorked = 0;
  if (endDate < startDate) { return 0; }
  var current = startDate;
  var workHoursStart = dayStart;
  var workHoursEnd = dayEnd;
  while(current <= endDate){      
      var currentTime = current.getHours() + (current.getMinutes() / 60);             
      if(currentTime >= workHoursStart && 
         currentTime < workHoursEnd && 
         (includeWeekends ? current.getDay() !== 0 && current.getDay() !== 6 : true)
         ) minutesWorked++;
      current.setTime(current.getTime() + 1000 * 60);
  }
  return (minutesWorked / 60).toFixed(2);
}

exports.crearActualizacion = async (req, res) => {
    currentUserId = req.user.user_id;

    const { ticket_id, departamento_id, asignado_id } = req.body;

    let actividadesDelTicket = await TicketHistorico.find({ticket_id: ticket_id, esta_completado: false}).lean().exec();

    if(actividadesDelTicket.length > 1) return res.status(500).send({message: "Todas las actividades anteriores, deben de haber sido completada, para poder agregar una siguiente."})

     await TicketHistorico.create({
        ticket_id: ticket_id,
        departamento_id: departamento_id,
        completado_a: null,
        asignado_id: asignado_id,
        creador_id: currentUserId,
        esta_completado: false,
        modificador_id: null,
        esta_eliminado: false
    })
    .then(()=>{
        res.status(201).send({message: "Actualizacion creada correctamente."})
    })
    .catch((err)=>{
        res.status(400).send({error: err, message: "Hubo un error al crear la actualizacion."})
    });
};

exports.obtenerHistorico = async (req, res) => {
    await TicketHistorico.find()
    .then(historicos => {
        res.status(200).send(historicos);
    })
    .catch(err => {
        res.status(400).send(`No se pudo encontrar ningun ticket.`)
    })
  };
  
exports.obtenerHistoricoPorId = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      const historyByTicket = await TicketHistorico.find({ ticket_id: id })
        .populate('ticket_id')
        .populate('departamento_id')
        .populate('creador_id')
        .populate('asignado_id')
        .populate('modificador_id');
      res.status(200).json(historyByTicket);
    } catch (err) {
      res.status(400).json({ message: `El ticket id: ${id} no tiene ningun comentario.` });
    }
  };

  exports.completarActividadHistorico = async (req, res) =>{
    currentUserId = req.user.user_id;
    const id = req.params.id;
    TicketHistorico.findOneAndUpdate({ ticket_id: id, esta_completado: false }, {
      compleado_a: new Date(Date.now()),
      esta_completado: true,
      modificador_id: currentUserId
    })
    .then(()=>{
      res.status(201).send({message: "La actividad se actualizo correctament."})
    })
    .catch(err =>{
      res.status(500).send({error: err, message: "Hubo un error, no se puedo actualizar la actividad."})
    })
  };

  exports.reasignarActividadHistorico = async (req, res) =>{
    const currentUserId = req.user.user_id;
    const id = parseInt(req.params.id);
    const { asignado_id } = req.body;

    TicketHistorico.findOneAndUpdate({ ticket_id: id, esta_completado: false }, {
      asignado_id: asignado_id,
      modificador_id: currentUserId
    })
    .then(()=>{
      res.status(201).send({message: "La actividad se reasigno correctament."})
    })
    .catch(err => {
      res.status(500).send({message: "Hubo un error, no se pudo reasignar el ticket."})
    })
  }

exports.obtenerReporte = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  const dateStart = new Date(fechaInicio);
  const dateEnd = new Date(fechaFin);

    if(helper.isNullOrUndefined(dateStart) || helper.isNullOrUndefined(dateEnd) ) return res.status(400).send({message: "Las fechas son requeridas."});
  if(dateStart > dateEnd) return res.status(400).send({message: "La fecha de inicio no puede ser mayor a la fecha de fin."})
  const dateStartISO = dateStart.toISOString();
  const dateEndISO = dateEnd.toISOString();

  try {
    const historicos = await TicketHistorico.find({
      $and: [
        { creado_a: { $gte: dateStartISO } },
        { creado_a: { $lte: dateEndISO } },
      ],
    })
      .populate('ticket_id')
      .populate('departamento_id')
      .populate('creador_id')
      .populate('asignado_id')
      .populate('modificador_id');
    const flujo = await Flujo.find();

    const horario = await horariosModel.findOne({}).lean().exec();

    const reporte = historicos.map(historico => {
      const {
        ticket_id,
        creador_id,
        asignado_id,
        compleado_a,
        creado_a,
      } = historico;
      const {  email } = creador_id;
      const { _id: ticketId, trabajo_flujo_id: flujoId } = ticket_id;
      return {
        ticketId,
        creado_a: helper.formateDateShort(creado_a),
        compleado_a: helper.isNullOrWhitespace(compleado_a)
          ? 'Sin completar'
          : helper.formateDateShort(compleado_a),
        email_creador: email,
        asignado: helper.isNullOrUndefined(asignado_id)
          ? 'Sin asignar'
          : `${asignado_id.nombres} ${asignado_id.apellidos}`,
        email_asignado: asignado_id?.email,
        tiempoEstimadoResolucion: flujo.find(f => f.id == flujoId).tiempo_resolucion,
        tiempoRealResolucion: helper.isNullOrWhitespace(compleado_a)
          ? '0'
          : helper.getDiffInHours(creado_a, compleado_a),
          tiempoResolucionHorasOficina: workingHoursBetweenDates(creado_a, compleado_a, horario.horaInicio, horario.horaFinal, horario.incluyeFinesDeSemana)
      };
    });

    const reporteAgrupado = helper.groupBy(reporte, 'ticketId');
    const reporteAgrupadoArray = Object.keys(reporteAgrupado).map(key => {
      return reporteAgrupado[key];
    });

    const reporteFinal = reporteAgrupadoArray.map((reporte) => {
      const { ticketId, creado_a, asignado, email_creador, compleado_a, tiempoEstimadoResolucion, tiempoResolucionHorasOficina } = reporte[0];
      const tiempoRealResolucion = reporte.reduce((a, b) => {
        return a + parseFloat(b.tiempoRealResolucion);
      }, 0);
      const SLA = tiempoResolucionHorasOficina != 0 ? (parseInt(tiempoEstimadoResolucion) / tiempoResolucionHorasOficina) : 100;
      const percentageSLA = SLA != 0 ? (SLA * 100) >= 100 ? '100 %' : `${(SLA * 100).toFixed(2)} %`  : `${SLA} %` ;
      return {
        ticketId,
        email_creador,
        asignado,
        fechaCreacion: creado_a,
        fechaCompletado: compleado_a,
        tiempoEstimadoResolucion: tiempoEstimadoResolucion + ' horas',
        tiempoRealResolucion: tiempoRealResolucion.toFixed(2) + ' horas',
        percentageSLA,
        tiempoResolucionHorasOficina: tiempoResolucionHorasOficina + ' horas'
      };
    });

    res.status(200).json(reporteFinal);
  } catch (err) {
    console.log(err);
    res.status(400).json([]);
  }
};

exports.obtenerReportePorDepto = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  const dateStart = new Date(fechaInicio);
  const dateEnd = new Date(fechaFin);
  
  if(helper.isNullOrUndefined(dateStart) || helper.isNullOrUndefined(dateEnd) ) return res.status(400).send({message: "Las fechas son requeridas."});
  if(dateStart > dateEnd) return res.status(400).send({message: "La fecha de inicio no puede ser mayor a la fecha de fin."})
  const dateStartISO = dateStart.toISOString();
  const dateEndISO = dateEnd.toISOString();

  try {
    const historicos = await TicketHistorico.find({
      $and: [
        { creado_a: { $gte: dateStartISO } },
        { creado_a: { $lte: dateEndISO } },
      ],
    })
      .populate('ticket_id')
      .populate('departamento_id')
      .populate('creador_id')
      .populate('asignado_id')
      .populate('modificador_id');
    const reporte = historicos.map(historico => {
      const {
        ticket_id,
        creador_id,
        asignado_id,
        compleado_a,
        creado_a,
        departamento_id
      } = historico;
      const {  email } = creador_id;
      const { _id: ticketId } = ticket_id;
      const { nombreDepartamento } = departamento_id;
      return {
        ticketId,
        fechaCreacion: helper.formateDateShort(creado_a),
        fechaCompletado: helper.isNullOrWhitespace(compleado_a)
          ? 'Sin completar'
          : helper.formateDateShort(compleado_a),
        email_creador: email,
        nombreDepartamento,
        asignado: helper.isNullOrUndefined(asignado_id)
          ? 'Sin asignar'
          : `${asignado_id.nombres} ${asignado_id.apellidos}`,
        tiempoRealResolucion: helper.isNullOrWhitespace(compleado_a)
          ? '0.00 horas'
          : helper.getDiffInHours(creado_a, compleado_a) + ' horas',
      };
    });
    const reporteOrdenado = [...reporte].sort((a, b) => {
      if (a.ticketId < b.ticketId) {
        return -1;
      } else if (a.ticketId > b.ticketId) {
        return 1;
      } else {
        return 0;
      }
    });
    res.status(200).json(reporteOrdenado);
  }catch(error){
    console.log(error);
    res.status(400).json([]);
  }
}




  