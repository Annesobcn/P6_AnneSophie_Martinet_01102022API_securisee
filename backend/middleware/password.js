const passwordValidator = require("password-validator");

//Gestion de la protection du mot de passe
const passwordSchema = new passwordValidator();

//Schéma pour obliger l'utilisateur à entrer un mot de passe suffisement fort
passwordSchema
  .is()
  .min(8)
  .is()
  .max(25)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd1", "Password123", "Azerty123", "Motdepasse123"]);

//Vérification de la qualité du mot de passe
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error:
        "Le mot de passe doit comporter entre 8 et 25 caractères, au moins un chiffre, une minuscule, une majuscule et aucun espace.",
    });
  }
};
