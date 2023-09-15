const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");

const verifyGroups = require("../middleware/verifier.grupos");
const grupoController = require("../controllers/grupos.controller");

const app = Router();

app.post("/grupos",
    [   
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser,
        verifyGroups.verifyRequiredFields,
        verifyGroups.verifyIfGroupExist
    ],
    grupoController.crearGrupo
);

app.get("/grupos",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    grupoController.obtenerGrupos
);

app.get("/grupos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    grupoController.obtenerGrupoPorId
);

app.put("/grupos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    grupoController.modificarGrupo
)

app.delete("/grupos/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    grupoController.cambiarDisponibilidadDeUnGrupo
)

app.put("/grupos/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    grupoController.cambiarDisponibilidadDeUnGrupo
)

module.exports = app;