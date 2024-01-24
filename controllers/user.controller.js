var bcrypt = require("bcryptjs");

const User = require("../models/user.model");

exports.create = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });

  user
    .save(user)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Não foi possível criar o user.",
      });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Utilizador não encontrado", error: true });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Password inválida!",
          error: true,
        });
      }

      res.status(200).send({
        id: user._id,
        error: false,
        message: "Login efetuado com sucesso!",
        username: user.username,
        email: user.email,
        password: user.password,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.addWaypoint = async (req, res) => {
  try {
    // Assume que o waypoint é enviado no corpo da requisição
    const long = req.body.long;
    const lat = req.body.lat;

    // Encontra o usuário pelo id e adiciona o waypoint ao array de markers
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { markers: long, lat } },
      { new: true, useFindAndModify: false }
    );

    if (!user) {
      return res.status(404).send({ message: "User não encontrado" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Erro ao adicionar waypoint" });
  }
};

exports.passwordchange = async (req, res) => {
  try {
    const update = await User.findByIdAndUpdate(
      req.params.id,
      { password: bcrypt.hashSync(req.body.password) },
      { new: true }
    );
    res.send(update);
  } catch (error) {
    res.status(500).send("Não foi possível atualizar a password");
  }
};

exports.get = (req, res) => {
 res.send("Hello World");
}
