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
  User.findOne({
    username: req.body.username,
  })
  .then((user) => {
    // verifica se o user existe, se existe vai buscar ao req o long: number e a lat: number e adiciona ao array de markers
    if (!user) {
      return res
        .status(404)
        .send({ message: "Utilizador não encontrado", error: true });
    }
    //long e lat são 2 dados separados que vêm do req.body
    var long = req.body.long;
    var lat = req.body.lat;
    //adiciona ao array de markers
    user.markers.push({latitude: lat, longitude: long});
    //guarda na bd
    user.save();
    //envia resposta
    res.status(200).send({
      id: user._id,
      error: false,
      message: "Marcador adicionado com sucesso!",
      username: user.username,
      email: user.email,
      markers: user.markers
    });

  })
};

exports.getMarkers = async (req, res) => {
  User.findOne({username: req.params.username})
  .then((user) => {
    // verifica se o user existe, se existe retorna a lista de markers
    if (!user) {
      return res
        .status(404)
        .send({ message: "Utilizador não encontrado", error: true });
    }
    // envia resposta com a lista de markers
    res.status(200).send(user.markers
    );
  })
  .catch((error) => {
    res.status(500).send({ message: "Erro ao obter markers", error: true });
  });
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
  //hello world test
  res.send("Hello World");
  };
