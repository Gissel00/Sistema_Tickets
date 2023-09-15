const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const flujosController = require("../controllers/flujos.controller");
const verifyFlujos = require("../middleware/verifier.flujos");

const app = Router();

app.post("/flujos",
[
    verifyAccessLevel.isAdmin,
    verifyAccessLevel.isUser,
    verifyFlujos.verifyRequiredFields,
    verifyFlujos.verifyIfWorkflowExist
],
    flujosController.crearFlujo
);

app.get("/flujos",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    flujosController.obtenerFlujos
);

app.get("/flujos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    flujosController.obtenerFlujoPorId
);

app.put("/flujos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    flujosController.modificarFlujo
);

app.delete("/flujos/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    flujosController.cambiarDisponibilidadDeUnFlujo
)

app.put("/flujos/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    flujosController.cambiarDisponibilidadDeUnFlujo
)

module.exports = app;