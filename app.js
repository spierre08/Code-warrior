import 'moment/locale/fr.js';

import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import moment from 'moment';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import validator from 'validator';

import Utils from './common/utils/utils.js';
import UserModel from './models/user.model.js';
import AdminRoute from './routes/admin.routes.js';
import LibrairyRoute from './routes/librairy.routes.js';
import TeacherRoute from './routes/teacher.routes.js';
import UserRoute from './routes/user.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(helmet());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: Utils.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

moment.locale("fr");
app.locals.moment = moment;

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("login.ejs", { erreur: "", message: "" });
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login.ejs", {
      erreur: "Ces champs sont obligatoires",
      message: "",
    });
  }

  if (!validator.isEmail(email)) {
    return res.render("login.ejs", {
      erreur: "Email invalide",
      message: "",
    });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.render("login.ejs", {
      erreur: "Cette adresse n'existe pas dans notre système !",
      message: "",
    });
  }

  const passwordMatched = bcrypt.compareSync(password, user.password);
  if (!passwordMatched) {
    return res.render("login.ejs", {
      erreur: "Mot de passe incorrecte",
      message: "",
    });
  }

  req.session.user = {
    id: user._id,
    full_name: user.full_name,
    email: user.email,
    type_user: user.type_user,
  };

  if (user.type_user === "admin") {
    res.redirect("/admin/dashbord");
  } else if (user.type_user === "professeur") {
    res.redirect("/teacher/space");
  } else if (user.type_user === "étudiant") {
    res.redirect("/libraries");
  } else {
    res.render("login.ejs", {
      erreur: "Vous ne disposez d'aucun droit d'accès",
      message: "",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(function (erreur) {
    if (erreur) {
      console.log(erreur);
      res.redirect("/");
    }
    res.redirect("/");
  });
});

app.get("/video/:filename", (req, res) => {
  const videoPath = path.join(__dirname, "uploads", req.params.filename);
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lecture vidéo</title>
        <style>
          /* Personnalisation de la taille de la vidéo */
          video {
            width: 100%; /* 100% de la largeur du conteneur */
            max-width: 800px; /* La largeur maximale de la vidéo */
            height: auto; /* Conserver le ratio d'origine */
            margin: 0 auto; /* Centrer la vidéo */
            display: block;
          }
        </style>
      </head>
      <body>
        <video controls>
          <source src="http://localhost:4400/uploads/${req.params.filename}" type="video/mp4">
          Votre navigateur ne supporte pas la balise vidéo ou il y a un problème avec le fichier vidéo.
        </video>
      </body>
    </html>
  `);
});

app.use("/users", UserRoute);
app.use("/admin", AdminRoute);
app.use("/teacher", TeacherRoute);
app.use("/libraries", LibrairyRoute);

app.all(/.*/, (req, res) => {
  res.render("404.ejs");
});

export default app;
