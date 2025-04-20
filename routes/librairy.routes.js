import { Router } from 'express';

import AuthMiddleware from '../common/middlewares/auth.middlware.js';
import LibraryController from '../controllers/librairy.controller.js';

const route = Router();

route.get(
  "/",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isStudent,
  LibraryController.libraryPage
);

route.get(
  "/forum",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isStudent,
  LibraryController.forumPage
);

route.post(
  "/forum",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isStudent,
  LibraryController.forumAddQuestion
);

route.get(
  "/forum/responses/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isStudent,
  LibraryController.forumGetResponseByQuestionId
);

route.get(
  "/view-video/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isStudent,
  LibraryController.viewVideo
);

route.post(
  "/view-video/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isStudent,
  LibraryController.addNote
);

export default route;
