import multer from "multer";
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        req.flash(
          "error_msg",
          "La taille du fichier dépasse la limite autorisée (400 Mo)."
        );
        break;
      case "LIMIT_UNEXPECTED_FILE":
        req.flash("error_msg", "Le fichier envoyé n'est pas autorisé.");
        break;
      default:
        req.flash("error_msg", "Erreur inconnue lors de l'upload.");
    }
  } else if (err) {
    // Si c'est une erreur personnalisée de type fichier (extension ou format)
    req.flash("error_msg", err.message || "Une erreur inconnue est survenue.");
  } else if (!req.file) {
    // Si aucun fichier n'est envoyé
    req.flash("error_msg", "Aucun fichier n'a été envoyé.");
  }

  next(); // Passer à l'étape suivante du middleware (contrôleur)
};

export default errorHandler;
