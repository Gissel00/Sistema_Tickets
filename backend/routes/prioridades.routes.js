const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const prioridadesController = require('../controllers/prioridades.controller');
const verifyPrioridades = require("../middleware/verifier.prioridades");

const app = Router();

app.post("/prioridades",
[
    verifyAccessLevel.isAdmin,
    verifyAccessLevel.isUser,
    verifyPrioridades.verifyRequiredFields,
    verifyPrioridades.verifyIfPriorityExist
],
    prioridadesController.crearPrioridad
);

app.get("/prioridades",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    prioridadesController.obtenerPrioridades
);

app.get("/prioridades/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    prioridadesController.obtenerPrioridadPorId
);


app.put("/prioridades/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    prioridadesController.actualizarPrioridad
);

app.delete("/prioridades/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    prioridadesController.cambiarDisponibilidadDeUnaPrioridad
)

app.put("/prioridades/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    prioridadesController.cambiarDisponibilidadDeUnaPrioridad
)

module.exports = app;