//importation des modules: bcrypt pour hasher le mot de passe, jsonwebtoken pour créer un token, cryptojs pour crypter l''email
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");
const dotenv = require("dotenv");
const result = dotenv.config();

//Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  const emailCryptoJS = cryptojs //on encrype l'email avec cryptojs
    .HmacSHA256(req.body.email, `${process.env.MAIL_CRYPTO_JS}`)
    .toString();
  bcrypt
    .hash(req.body.password, 10) //hashage et salage du mot de passe
    .then((hash) => {
      const user = new User({
        email: emailCryptoJS,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) =>
          res.status(400).json({ error: "Création impossible!" })
        );
    })
    .catch((error) => res.status(500).json({ message: "Probleme d'encryptage !" }));
};

//Se connecter à son compte
exports.login = (req, res, next) => {
  const emailCryptoJS = cryptojs
    .HmacSHA256(req.body.email, `${process.env.MAIL_CRYPTO_JS}`)
    .toString();
  User.findOne({ email: emailCryptoJS })
    .then((user) => {
      if (!user) { return res.status(401).json({ message: "Paire login/mot de passe incorrecte" });}
      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          } else {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                `${process.env.SECRET_CRYPTO_KEY}`,
                { expiresIn: "24h" }
              ),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
