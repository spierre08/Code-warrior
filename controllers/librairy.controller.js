import CourseModel from '../models/course.model.js';
import NoteModel from '../models/note.model.js';
import QuestionModel from '../models/question.model.js';
import ResponseModel from '../models/response.model.js';
import SubjectModel from '../models/subject.model.js';

class LibraryController {
  static libraryPage = async (req, res) => {
    try {
      const subjects = await SubjectModel.find().sort({ createdA: -1 });
      const coursesDocuments = await CourseModel.find({ file_type: "document" })
        .populate("subject_id")
        .populate("author_id")
        .sort({ createdAt: -1 });

      const coursesVideos = await CourseModel.find({ file_type: "vidéo" })
        .populate("subject_id")
        .populate("author_id")
        .sort({ createdAt: -1 });

      res.render("librairy.ejs", {
        email: req.session.user.email,
        role: req.session.user.type_user,
        subjects,
        coursesDocuments,
        coursesVideos,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des cours :", error);
      req.flash(
        "error_msg",
        "Une erreur est survenue. Veuillez réessayer plus tard."
      );
      res.redirect("/libraries");
    }
  };

  static forumPage = async (req, res) => {
    const search = req.query.search || "";

    try {
      const query = {};

      if (search) {
        const foundSubject = await SubjectModel.findOne({
          name: { $regex: search, $options: "i" },
        });

        if (foundSubject) {
          query.subject_id = foundSubject._id;
        } else {
          query.question = { $regex: search, $options: "i" };
        }
      }

      const subjects = await SubjectModel.find();
      const questions = await QuestionModel.find(query)
        .populate("user_id")
        .populate("subject_id")
        .sort({ createdAt: -1 });

      res.render("forum.ejs", {
        id: req.session.user.id,
        email: req.session.user.email,
        role: req.session.user.type_user,
        subjects,
        questions,
        search,
      });
    } catch (error) {
      console.log("Erreur de chargement de la page", error),
        req.flash(
          "error_msg",
          "Une erreur est survenue. Veuillez réessayer plus tard."
        );
      res.redirect("/libraries/forum");
    }
  };

  static forumGetResponseByQuestionId = async (req, res) => {
    const { id } = req.params;

    try {
      const getResponse = await ResponseModel.find({ question_id: id })
        .populate("user_id")
        .populate("question_id")
        .sort({ createdAt: -1 });

      res.render("forum-response.ejs", {
        email: req.session.user.email,
        role: req.session.user.type_user,
        response: getResponse,
      });
    } catch (error) {
      console.log("Erreur de chargement de la page", error),
        req.flash(
          "error_msg",
          "Une erreur est survenue. Veuillez réessayer plus tard."
        );
      res.redirect("/libraries/forum");
    }
  };

  static forumAddQuestion = async (req, res) => {
    const { question, subject_id, detail } = req.body;
    const user_id = req.session.user.id;

    const response = await QuestionModel.create({
      question,
      subject_id,
      user_id,
      detail,
    });

    if (response) {
      console.log(req.body);
      req.flash("success_msg", "Question publiée avec succès !");
    } else {
      req.flash(
        "error_msg",
        "Une erreur est survenue, veuillez réessayer plus tard."
      );
    }

    res.redirect("/libraries/forum");
  };

  static viewVideo = async (req, res) => {
    const { id } = req.params;

    try {
      const course = await CourseModel.findById({ _id: id })
        .populate("subject_id")
        .populate("subject_id")
        .populate("author_id");

      res.render("view-video.ejs", {
        course,
        email: req.session.user.email,
        role: req.session.user.type_user,
      });
    } catch (error) {
      console.log(
        "Erreur du récupération de l'élément par son identifiant",
        error
      );
      req.flash(
        "error_msg",
        "Une erreur est survenue lors de la récupération de l'élément par son identifiant. Veuillez réessayer plus tard."
      );
      res.redirect("/libraries");
    }
  };

  static addNote = async (req, res) => {
    const { note, course_id } = req.body;
    const user_id = req.session.user.id;
    const response = await NoteModel.create({ note, course_id, user_id });

    if (!note) {
      req.flash("error_msg", "Le champ est requis.");
    } else {
      if (response) {
        req.flash("success_msg", "Note ajouté avec succès !");
      } else {
        req.flash(
          "error_msg",
          "Une erreur est survenue, veuillez réessayer plus tard."
        );
      }
    }

    res.redirect("/libraries/view-video/" + course_id);
  };
}

export default LibraryController;
