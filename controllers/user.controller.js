import bcrypt from 'bcrypt';
import validator from 'validator';

import UserModel from '../models/user.model.js';

class UserController {
  static registerPage = (req, res) => {
    res.render("register.ejs", { erreur: "", message: "", warning: "" });
  };

  static register = async (req, res) => {
    const { full_name, email, password, type_user } = req.body;

    if (!full_name || !email || !password) {
      res.render("register.ejs", {
        erreur: "Veuillez compléter ces informations",
        message: "",
        warning: "",
      });
    } else {
      if (validator.isEmail(email)) {
        const isEmailExist = await UserModel.findOne({ email });

        if (isEmailExist) {
          res.render("register.ejs", {
            erreur: "",
            message: "",
            warning: "Cette adresse mail existe déjà",
          });
        } else {
          if (password.length < 4) {
            res.render("register.ejs", {
              erreur: "",
              message: "",
              warning: "Le mot de passe doit être 4 caractères ou plus",
            });
          } else {
            const response = await UserModel.create({
              full_name,
              email,
              password: bcrypt.hashSync(password, 10),
              type_user,
            });

            if (response) {
              res.redirect("/");
            } else {
              res.render("register.ejs", {
                erreur: "Une erreur est survenur veuillez résessayer plus tard",
                message: "",
                warning,
              });
            }
          }
        }
      } else {
        res.render("register.ejs", {
          erreur: "Email invalide",
          message: "",
          warning: "",
        });
      }
    }
  };

  static resetPassword = async (req, res) => {
    res.render("reset-password.ejs");
  };

  static creatPassword = async (req, res) => {
    const { email, password, cpassword } = req.body;

    if (!email || !password || !cpassword) {
      req.flash("error_msg", "Veuillez compléter ces informations");
    } else {
      if (validator.isEmail(email)) {
        if (password.length < 4) {
          req.flash(
            "error_msg",
            "Le mot de passe doit être 4 caractères au mininum "
          );
        } else {
          if (password != cpassword) {
            req.flash("error_msg", "Les deux mots ne sont conformes");
          } else {
            const hashPassword = bcrypt.hashSync(password, 10);
            const user = await UserModel.findOneAndUpdate(
              { email: email },
              { password: hashPassword },
              { new: true }
            );

            if (!user) {
              req.flash("error_msg", "Utilisateur introuvable ");
            } else {
              req.flash(
                "success_msg",
                "Mot de passe modifié avec succès. Connectez-vous !"
              );
              res.redirect("/");
            }
          }
        }
      } else {
        req.flash("error_msg", "Email invalide ");
      }
    }

    res.redirect("/users/reset-password");
  };
}

export default UserController;
