let signIn = {}

signIn.verifyRequiredFields = (req, res, next) => {
    const { email, password } = req.body;
    hasRequestAllRequiredFields = email && password;
    if (!hasRequestAllRequiredFields) {
        res.status(400).send("Escribe un usuario y una contraseña.");
        return;
      }
    next();
};

module.exports = signIn;