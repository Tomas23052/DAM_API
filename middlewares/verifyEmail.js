const { model } = require("mongoose");
const User = require("../models/user.model");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check for username
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) {
      return res.status(400).send({ message: "Utilizador já está em uso!", error: true });
    }

    // Check for email
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      return res.status(400).send({ message: "Já existe uma conta com este e-mail!", error: true });
    }

    next();
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const verifyEmail = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifyEmail;
