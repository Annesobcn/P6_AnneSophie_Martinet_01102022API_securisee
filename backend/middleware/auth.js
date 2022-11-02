const jwt = require("jsonwebtoken");

//Création d'un token et dot.env pour protéger l'email de l'utilisateur
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_CRYPTO_KEY);
    const userId = decodedToken.userId;
    req.auth = { userId };
    //vérification de l'id de l'utilisateur
    if (req.body.userId && req.body.userId !== userId) {
      throw "Utilisateur non reconnu: Id non valide!";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Attention! Requête non authorisée!" });
  }
};
