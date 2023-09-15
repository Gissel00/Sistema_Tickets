const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
const categoriaController = require("../controllers/categorias.controller");
const verifyCategory = require("../middleware/verifier.categorias");
const app = Router();

app.post("/categorias",
[
    verifyAccessLevel.isAdmin,
    verifyAccessLevel.isUser,
    verifyCategory.verifyRequiredFields,
    verifyCategory.verifyIfCategoryExist,
    verifyCategory.verifyIfGroupIdExist
],
categoriaController.crearCategoria
);

app.get("/categorias",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    categoriaController.obtenerCategorias
);

app.get("/categorias/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    categoriaController.obtenerCategoriaPorId
);

app.put("/categorias/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    categoriaController.actualizarCategoria
);

app.delete("/categorias/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    categoriaController.cambiarDisponibilidadDeUnaCategoria
);

app.put("/categorias/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    categoriaController.cambiarDisponibilidadDeUnaCategoria
)

module.exports = app;