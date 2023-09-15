const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const auth = require("../middleware/jwt.auth");
const helper = require('../config/helpers');

exports.register = async (req, res) => {
  try {
    const { nombres, apellidos, email, password, isAdministrator, isUser, telefono } = req.body;
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await Usuario.create({
      nombres,
      apellidos,
      email: email.toLowerCase(),
      telefono,
      password: encryptedPassword,
      es_administrador: isAdministrator,
      es_usuario: isAdministrator ? isAdministrator : isUser,
      esta_activo: true
    });

    const token = auth.createToken(user._id, email);

    res.status(201).send(
      {
        message: "Se creo la cuenta exitosamente.",
        token: `Bearer ${token}`,
        userInfo: {
          _id: user._id,
          email,
          rol: isAdministrator ? 'Administrador' : 'Usuario' ,
          nombres,
          apellidos
        }
      });

    } catch (err) {
      res.status(400).send("Hubo un error inesperado.")
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = auth.createToken(user._id, email);

      user.token = token;

      res.status(200).json({
        message: "Las credenciales han sido validadas.",
        token: `Bearer ${token}`,
        userInfo: {
          _id: user._id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          fotoPerfil: user.foto_perfil,
          rol: user.es_administrador ? 'Administrador': 'usuario'
        }
      });
    } else {
      res.status(400).send("Las credenciales son invalidas.");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getUserByEmail = async(req, res) => {
  const { email } = req.query;
  try{
    const userFound = await  Usuario.findOne({ email });
    const token = auth.createToken(userFound._id, email);

    if(!helper.isNullOrWhitespace(userFound)){
      res.status(200).json({
        user: {
          message: "Las credenciales han sido validadas.",
          token: `Bearer ${token}`,
          userInfo: {
          _id: userFound._id,
          nombres: userFound.nombres,
          apellidos: userFound.apellidos,
          email: userFound.email,
          telefono: userFound.telefono,
          fotoPerfil: userFound.foto_perfil,
          rol: userFound.es_administrador ? 'Administrador': 'usuario'
        }
      }});
      return;
    };
    res.status(400).json({ message: 'Is null or whitespace' });
  }catch(err){
    console.error(err);
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
}

exports.updateUser = async (req, res) => {
  const { nombres, apellidos, email, telefono, newPassword } = req.body;
  const userToUpdate = {
    ...(!helper.isNullOrWhitespace(nombres) && { nombres }),
    ...(!helper.isNullOrWhitespace(apellidos) && { apellidos }),
    ...(!helper.isNullOrWhitespace(email) && { email }),
    ...(!helper.isNullOrWhitespace(telefono) && { telefono }),
    ...(!helper.isNullOrWhitespace(newPassword) && {
      password: await bcrypt.hash(newPassword, 10),
    }),
  };

  if(!helper.isObject(userToUpdate)) return;

  try {
    const response = await Usuario.findOneAndUpdate({ email }, userToUpdate, {
      new: true,
    });
    res.status(200).json({
      user: {
        message: 'Usuario actualizado exitosamente.',
        token: '',
        userInfo: {
          _id: response._id,
          nombres: response.nombres,
          apellidos: response.apellidos,
          email: response.email,
          telefono: response.telefono,
          rol: response.es_administrador ? 'Administrador' : 'usuario',
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Hubo un error inesperado.' });
  }
};
