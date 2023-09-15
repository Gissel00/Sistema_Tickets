const { Router } = require("express");
const verifyAccessLevel = require("../middleware/access.level");
var multer = require('multer');
var upload = multer();
const fileStorage = require("../controllers/file.storage.controller");

const app = Router();

app.get("/archivos/:id",
    [
        verifyAccessLevel.isUser
    ],
    fileStorage.downloadFile
);

app.get("/archivos/foto/:id",
    [
        verifyAccessLevel.isUser
    ],
    fileStorage.downloadProfileImg
);

app.get("/archivos/lista/:id", 
    [
        verifyAccessLevel.isUser
    ],
    fileStorage.getListOfFiles
);

app.post("/archivos", 
    [
        verifyAccessLevel.isUser
    ],upload.any(),
    fileStorage.uploadFile
);


module.exports = app;