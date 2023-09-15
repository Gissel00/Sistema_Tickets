const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const verifyUpdate = require("../middleware/verifier.ticket.historico");
const historicoController = require("../controllers/historico.controller");

const app = Router();

app.post("/historico",
    [   
        verifyAccessLevel.isUser,
        verifyUpdate.verifyAllRequiredFields,
        verifyUpdate.verifyIfTicketExist,
        verifyUpdate.verifyIfUserExiste,
        verifyUpdate.verifyIfWorkflowStepExist
    ],
    historicoController.crearActualizacion
);

app.put("/historico/completar/:id",  [
    verifyAccessLevel.isUser
    ],
    historicoController.completarActividadHistorico);

app.put("/historico/reasignar/:id",  [
    verifyAccessLevel.isUser
    ],
    historicoController.reasignarActividadHistorico);


app.get("/historico", 
    [
        verifyAccessLevel.isUser
    ],
    historicoController.obtenerHistorico
);

app.get("/historico/:id",
    [ verifyAccessLevel.isUser ],
    historicoController.obtenerHistoricoPorId
);

app.get("/historico-reporte",
    [ verifyAccessLevel.isUser ],
    historicoController.obtenerReporte
)

app.get("/historico-reporte-departamentos",
    [ verifyAccessLevel.isUser ],
    historicoController.obtenerReportePorDepto
)

module.exports = app;
