const express = require("express");
const bodyParser = require("body-parser");
//Acces au path du server pur gérer les routes images
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");

require("dotenv").config({ path: process.cwd() + "/.env" });

//Appel de nos routes
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const app = express();
app.use(helmet());

//Connection à la BD MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywkious.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussi!"))
  .catch(() => console.log("Connexion à MongoDB échoué!"));

//Définition des headers pour accéder  l'API depuis n'importe quelle origine

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "*");
  res.setHeader(
    "Acces-Control-Allow-Headers",
    "Origin, X-requested-With, Content, Accept, Content-Type, Authorization"
  );
  //et envoyer les requêtes avec les méthodes requises
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader( "accept-version", "1" );
  next();
});

//Attribution des middlewares pour les routes requises
app.use(bodyParser.json());

app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
