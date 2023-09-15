const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const pasosController = require("../controllers/flujos.pasos.controller");
const verifyPasos = require('../middleware/verifier.flujos.pasos');

const app = Router();

app.post("/flujos/pasos",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser,
        verifyPasos.verifyIfWorkflowStepExist,
        verifyPasos.verifyIfWorkflowExist,
        verifyPasos.verifyRequiredFields
    ],
    pasosController.crearPaso
);

app.get("/pasos",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    pasosController.obtenerPasos
);

app.get("/pasos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    pasosController.obtenerPasosPorId
);

app.put("/pasos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    pasosController.actualizarPaso
);

app.delete("/pasos/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    pasosController.cambiarDisponibilidadDeUnPaso
)

app.put("/pasos/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    pasosController.cambiarDisponibilidadDeUnPaso
)


module.exports = app;