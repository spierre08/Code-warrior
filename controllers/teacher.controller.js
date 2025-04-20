import CourseModel from '../models/course.model.js';
import QuestionModel from '../models/question.model.js';
import ResponseModel from '../models/response.model.js';
import SubjectModel from '../models/subject.model.js';

class TeacherController {
  static TeacherPage = async (req, res) => {
    try {
      const subject = await SubjectModel.find();
      const courses = await CourseModel.find({ author_id: req.session.user.id })
        .populate("subject_id")
        .populate("author_id")
        .sort({ createdAt: -1 });

      res.render("teacher.ejs", {
        email: req.session.user.email,
        role: req.session.user.type_user,
        subject,
        courses,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des cours :", error);
      req.flash(
        "error_msg",
        "Une erreur est survenue. Veuillez réessayer plus tard."
      );
      res.redirect("/teacher");
    }
  };

  static AddCourse = async (req, res) => {
    try {
      if (req.multerError) {
        return res.redirect("/teacher/space");
      }

      const { title, during, level, subject_id, description, file_type } =
        req.body;
      const author_id = req.session.user.id;

      if (!req.file) {
        req.flash("error_msg", "Veuiller choisir un fichier");
        res.redirect("/teacher/space");
      }

      const course = await CourseModel.create({
        title,
        during,
        level,
        subject_id,
        url: req.file.filename,
        description,
        author_id,
        file_type,
      });

      if (course) {
        req.flash("success_msg", "Cours ajouté avec succès !");
      } else {
        eq.flash("error_msg", "Erreur interne lors de l'ajout du cours.");
      }

      res.redirect("/teacher/space");
    } catch (error) {
      console.error("Erreur lors de l'ajout du cours :", error.message);
      req.flash("error_msg", "Erreur interne lors de l'ajout du cours.");
      res.redirect("/teacher/space");
    }
  };

  static questionPage = async (req, res) => {
    try {
      const subject = await SubjectModel.find();
      const questions = await QuestionModel.find()
        .populate("user_id")
        .populate("subject_id")
        .sort({ createdAt: -1 });

      res.render("teacher-questions.ejs", {
        email: req.session.user.email,
        role: req.session.user.type_user,
        subject,
        questions,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des cours :", error);
      req.flash(
        "error_msg",
        "Une erreur est survenue. Veuillez réessayer plus tard."
      );
      res.redirect("/teacher/space/questions");
    }
  };

  static getQuestionById = async (req, res) => {
    const { id } = req.params;

    try {
      const response = await QuestionModel.findById({ _id: id });

      res.render("teacher-questions-id.ejs", {
        email: req.session.user.email,
        role: req.session.user.type_user,
        question: response,
      });
    } catch (error) {
      req.flash(
        "error_msg",
        "Une erreur est survenue. Veuillez réessayer plus tard."
      );
      res.redirect("/teacher/space");
    }
  };

  static ReplyByQuestionId = async (req, res) => {
    const { opinion } = req.body;
    const questionId = req.params.id;

    try {
      const question = await QuestionModel.findById(questionId);
      if (!question) {
        req.flash("error_msg", "La question n'existe pas.");
        return res.redirect("/teacher/space/questions");
      }

      const user_id = req.session.user.id;

      const response = await ResponseModel.create({
        opinion,
        question_id: questionId,
        user_id,
      });

      if (response) {
        req.flash("success_msg", "Réponse ajoutée avec succès !");
      } else {
        req.flash("error_msg", "Échec de l'enregistrement de la réponse.");
      }

      res.redirect("/teacher/space/questions");
    } catch (error) {
      console.error("Erreur lors de la réponse à une question :", error);
      req.flash("error_msg", "Une erreur est survenue.");
      res.redirect("/teacher/space/questions");
    }
  };

  static getAllResponseByQuestionId = async (req, res) => {
    const { id } = req.params;

    try {
      const response = await ResponseModel.find({ question_id: id })
        .populate("question_id")
        .populate("user_id")
        .sort({ createdAt: -1 });

      res.render("teacher-questions-response.ejs", {
        email: req.session.user.email,
        role: req.session.user.type_user,
        responses: response,
      });
    } catch (error) {
      console.error("Erreur lors de la réponse à une question :", error);
      req.flash("error_msg", "Une erreur est survenue.");
      res.redirect("/teacher/space/questions");
    }
  };
}

export default TeacherController;
