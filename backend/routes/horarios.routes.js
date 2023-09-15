const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const horariosController = require("../controllers/horario.operacion.controller");

const app = Router();

app.post("/horarios",
    [   
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser,
    ],
    horariosController.crearHorarioDeOperaciones
);

app.get("/horarios",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    horariosController.obtenerHorarios
);

app.put("/horarios/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    horariosController.actualizarHorarioDeOperaciones
)


module.exports = app;