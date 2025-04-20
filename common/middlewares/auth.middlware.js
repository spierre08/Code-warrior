class AuthMiddleware {
  static isLogIn = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/");
    }
  };

  static isAdmin = (req, res, next) => {
    if (req.session.user?.type_user === "admin") {
      next();
    } else {
      res.render("login.ejs", {
        erreur: "Vous n'avez pas accès à cette page",
        message: "",
      });
    }
  };

  static isTeacher = (req, res, next) => {
    if (req.session.user?.type_user === "professeur") {
      next();
    } else {
      res.render("login.ejs", {
        erreur: "Vous n'avez pas accès à cette page",
        message: "",
      });
    }
  };

  static isStudent = (req, res, next) => {
    if (req.session.user?.type_user === "étudiant") {
      next();
    } else {
      res.render("login.ejs", {
        erreur: "Vous n'avez pas accès à cette page",
        message: "",
      });
    }
  };
}

export default AuthMiddleware;
