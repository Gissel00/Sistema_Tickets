const Categorias = require("../models/ticket.categorias.model");
const Grupos = require("../models/ticket.grupos.model");

let categoriasOpciones = {}

categoriasOpciones.verifyIfCategoryExist = async (req, res, next) =>{
    const { nombre } = req.body;
    await Categorias.findOne({ nombre })
    .then(categoria =>{
      if(categoria) {
        res.status(409).send("Esta categoria ya existe, intente con otro nombre.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send("Hubo un error contacte al administrador.");
         return;
    });
};

categoriasOpciones.verifyIfGroupIdExist = async (req, res, next) => {
  const { grupo_id } = req.body;
  await Grupos.findById( grupo_id )
  .then(grupo =>{
    if(!grupo){
      res.status(400).send("El grupo que ingreso no existe.");
      return;
    }
    next();
  })
  .catch(err => {
    res.status(500).send("Hubo un error contacte al administrador.");
  });
};

categoriasOpciones.verifyRequiredFields = async (req, res, next) => {
  const { nombre, color, grupo_id } = req.body;
  hasRequestAllRequiredFields = nombre && color && grupo_id;
    if (!hasRequestAllRequiredFields) {
      res.status(400).send("Todos los campos son requeridos.");
      return;
    }
  next();
};

module.exports = categoriasOpciones