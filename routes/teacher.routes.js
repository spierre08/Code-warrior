import { Router } from 'express';

import AuthMiddleware from '../common/middlewares/auth.middlware.js';
import upload from '../common/middlewares/fichiers.middleware.js';
import errorHandler
  from '../common/middlewares/haddle-error-multer.middleware.js';
import TeacherController from '../controllers/teacher.controller.js';

const route = Router();

route.get(
  "/space",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isTeacher,
  TeacherController.TeacherPage
);

route.post(
  "/space",
  upload.single("file"),
  errorHandler,
  AuthMiddleware.isLogIn,
  AuthMiddleware.isTeacher,
  TeacherController.AddCourse
);

route.get(
  "/space/questions",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isTeacher,
  TeacherController.questionPage
);

route.get(
  "/space/questions/reply/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isTeacher,
  TeacherController.getQuestionById
);

route.post(
  "/space/questions/reply/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isTeacher,
  TeacherController.ReplyByQuestionId
);

route.get(
  "/space/questions/by-response/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isTeacher,
  TeacherController.getAllResponseByQuestionId
);

export default route;
