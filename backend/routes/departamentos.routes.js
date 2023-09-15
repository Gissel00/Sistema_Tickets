const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const departamentosControllers = require("../controllers/departamentos.controller");


const app = Router();

app.post("/departamentos",
[
    verifyAccessLevel.isAdmin,
    verifyAccessLevel.isUser,
],
    departamentosControllers.crearDepartamento
);

app.get("/departamentos",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    departamentosControllers.obtenerDepartamentos
);

app.get("/departamentos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    departamentosControllers.obtenerDepartamentoPorId
);

app.put("/departamentos/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    departamentosControllers.modificarDepartamento
);

app.delete("/departamentos/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    departamentosControllers.cambiarDisponibilidadDepartamento
)

app.put("/departamentos/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    departamentosControllers.cambiarDisponibilidadDepartamento
)

module.exports = app;