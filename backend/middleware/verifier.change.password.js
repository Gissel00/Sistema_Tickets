const Usuario = require('../models/usuario.model');
const helper = require('../config/helpers');
const bcrypt = require('bcryptjs');

const verifyPassword = {};

verifyPassword.validateExistingUser = async (req, res, next) => {
  const { id } = req.body;
  try {
    const response = await getUserById(id);
    if (helper.isNullOrWhitespace(response)) {
      res.status(404).send({ message: 'No se encontro el usuario.' });
      return;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

verifyPassword.verifyCurrentPassword = async (req, res, next) => {
  const { id, currentPassword } = req.body;
  try {
    const response = await getUserById(id);
    if (helper.isNullOrWhitespace(currentPassword)) {
      next();
      return;
    }
    if(helper.isNullOrWhitespace(response)){
      res.status(404).send({ message: 'No se encontro el usuario.' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      response.password
    );
    if (!isPasswordValid) {
      res
        .status(400)
        .send({ message: 'La contraseña ingresada es distinta a la actual.' });
      return;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

verifyPassword.verifyNewPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  try {
    if ([newPassword, confirmPassword].some(e=> helper.isNullOrWhitespace(e))) {
      next();
      return;
    }
    if (newPassword !== confirmPassword) {
      res.status(400).send({ message: 'Las contraseñas no coinciden.' });
      return;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const getUserById = async (id) => {
  try{
    const response = await Usuario.findById({ _id: id });
    return !helper.isNullOrUndefined(response) ? response : '';
  }catch(err){
    console.log(err);
    return '';
  }
}

module.exports = verifyPassword;
