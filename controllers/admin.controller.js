import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import SubjectModel from "../models/subject.model.js";

class AdminController {
  static adminPage = async (req, res) => {
    const [etudiants, professeurs, admins, total] = await Promise.all([
      UserModel.countDocuments({ type_user: "étudiant" }),
      UserModel.countDocuments({ type_user: "professeur" }),
      UserModel.countDocuments({ type_user: "admin" }),
      UserModel.estimatedDocumentCount(),
    ]);

    res.render("admin.ejs", {
      email: req.session.user.email,
      role: req.session.user.type_user,
      etudiants,
      professeurs,
      admins,
      total,
    });
  };

  static adminUserPage = async (req, res) => {
    const search = req.query.q || "";
    const type_user = req.query.type_user || "";

    const query = {
      type_user: { $in: ["étudiant", "professeur"] },
      $or: [
        { full_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ],
    };

    if (["étudiant", "professeur"].includes(type_user)) {
      query.type_user = type_user;
    }

    const users = await UserModel.find(query).sort({ full_name: 1 });

    res.render("admin-user.ejs", {
      email: req.session.user.email,
      role: req.session.user.type_user,
      users,
      search,
      selectedType: type_user,
    });
  };

  static addUser = async (req, res) => {
    const { full_name, email, password, type_user } = req.body;

    const isEmailExist = await UserModel.findOne({ email });

    if (isEmailExist) {
      req.flash("error_msg", "Cette adresse mail existe déjà !");
      return res.redirect("/admin/dashbord/users");
    }

    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);

    const response = await UserModel.create({
      full_name,
      email,
      password: passwordHash,
      type_user,
    });

    if (response) {
      req.flash("success_msg", "Utilisateur ajouté avec succès !");
    } else {
      req.flash(
        "error_msg",
        "Une erreur est survenue, veuillez réessayer plus tard."
      );
    }

    res.redirect("/admin/dashbord/users");
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;

    await UserModel.findByIdAndDelete(id);
    req.flash("success_msg", "Utilisateur supprimé avec succès !");
    res.redirect("/admin/dashbord/users");
  };

  static adminCoursePage = async (req, res) => {
    const { name } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const subject = await SubjectModel.find(filter).sort({ createdAt: -1 });

    res.render("admin-subject.ejs", {
      subject,
      email: req.session.user.email,
      role: req.session.user.type_user,
    });
  };

  static adminCourseAdd = async (req, res) => {
    const { name } = req.body;

    const isNameExist = await SubjectModel.findOne({ name });

    if (isNameExist) {
      req.flash("error_msg", "Cette matière existe déjà !");
      return res.redirect("/admin/dashbord/subject");
    }

    const subject = await SubjectModel.create({ name });

    if (subject) {
      req.flash("success_msg", "Matière ajoutée avec succès !");
    } else {
      req.flash(
        "error_msg",
        "Erreur lors de l'ajout, veuillez réessayer plus tard."
      );
    }

    res.redirect("/admin/dashbord/subject");
  };

  static adminDeleteSubject = async (req, res) => {
    const { id } = req.params;

    await SubjectModel.findByIdAndDelete(id);

    req.flash("success_msg", "Matière supprimée avec succès !");
    res.redirect("/admin/dashbord/subject");
  };
}

export default AdminController;
