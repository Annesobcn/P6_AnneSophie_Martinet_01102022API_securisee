const Sauce = require("../models/Sauce");
const fs = require("fs");

//Créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //Informations requise pour la création de l'objet sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  //enregistrement de la sauce dans la BD
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: " Sauce enregistrée!" });
    })
    .catch((error) =>
      res.status(400).json({ error: "Problème pour ajouter la sauce!" })
    );
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
  //recherche de la sauce à modifier et son image
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //suppression puis modification une fois vérifiée l'identité de l'utilisateur
  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Modification impossible" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // vérification de l'identité de l'utilisateur
      if (sauce.userId !== req.auth.userId) {
        res
          .status(401)
          .json({
            message: "Vous n'etes pas autorisé à faire cette modification",
          });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        if (!sauce) {
          res.status(404).json({ error: new Error("Sauce introuvable!") });
        }
        if (sauce.userId !== req.auth.userId) {
          res
            .status(401)
            .json({
              error: new Error(
                "Vous n'etes pas autorisé à faire cette modification"
              ),
            });
        }
        // supprime la sauce dans la BD
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Sauce supprimée !" });
          })
          .catch((error) => {
            res
              .status(400)
              .json({ error: "La sauce n'a pas pu être supprimée" });
          });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.getOneSauce = (req, res, next) => {
  // méthose pour de trouver la sauce à ajouter
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

// Pour de trouver la sauce à ajouter ou voir une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

//Pour voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//Gestion des LIKES
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // ajout du like/dislike
      const like = req.body.like;
      // si le user a déjà liké
      if (sauce.usersLiked.includes(req.body.userId)) {
        // supprimer le like
        sauce.likes--;
        // supprimer son id
        const index = sauce.usersLiked.indexOf(req.body.userId);
        sauce.usersLiked.splice(index, 1);
        // si le user like
      } else if (like === 1) {
        // rajouter un like
        sauce.likes++;
        // rajouter l'id du user
        sauce.usersLiked.push(req.body.userId);
      }
      // si le user a déjà disliké
      if (sauce.usersDisliked.includes(req.body.userId)) {
        // supprime le dislike
        sauce.dislikes--;
        // supprime son id
        const index = sauce.usersDisliked.indexOf(req.body.userId);
        sauce.usersDisliked.splice(index, 1);
        // si le user dislike
      } else if (like === -1) {
        // rajoute un dislike
        sauce.dislikes++;
        // rajoute l'id du user
        sauce.usersDisliked.push(req.body.userId);
      }
      sauce
        .save()
        .then(() => res.status(200).json({ message: "Sauce notée !" }))
        .catch((error) =>
          res.status(400).json({ error: "Impossible de noter la sauce" })
        );
    })
    .catch((error) => res.status(400).json({ error }));
};
