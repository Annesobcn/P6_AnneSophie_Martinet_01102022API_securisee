const express = require("express");
const router = express.Router();

//Appel des controllers et middlewares contenant la logique métier
const userCtrl = require("../controllers/user");
const password = require("../middleware/password");

//Routes pour chaque requête
router.post("/signup", userCtrl.signup);
router.post("/login", password, userCtrl.login);

module.exports = router;
