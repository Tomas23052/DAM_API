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
    var title = req.body.title;

    //percorrer todos os markers do user e verificar se já existe um marker com a mesma latitude e longitude
    for (var i = 0; i < user.markers.length; i++) {
      if (user.markers[i].latitude == lat && user.markers[i].longitude == long) {
        return res
          .status(401)
          .send({ message: "Marcador já existente!", error: true });
      }
    }

    //adiciona ao array de markers
    user.markers.push({latitude: lat, longitude: long, title: title});
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


exports.deleteMarker = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    // Encontra o índice do marker pelo id do marker
    const markerIndex = user.markers.findIndex(marker => marker._id.toString() === req.params.id);

    if (markerIndex === -1) {
      return res.status(404).send({ message: "Marker não encontrado" });
    }

    // Remove o marker do array de markers
    user.markers.splice(markerIndex, 1);

    // Salva o usuário atualizado
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Erro ao remover marker" });
  }
};

exports.updateMarker = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    // Encontra o índice do marker pelo id do marker
    const markerIndex = user.markers.findIndex(marker => marker._id.toString() === req.params.id);

    if (markerIndex === -1) {
      return res.status(404).send({ message: "Marker não encontrado" });
    }

    // Atualiza o marker
    user.markers[markerIndex].title = req.body.title;

    // Salva o usuário atualizado
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar marker" });
  }
}  



exports.get = (req, res) => {
  //hello world test
  res.send("Hello World");
  };
