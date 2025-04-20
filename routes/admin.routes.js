import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import AuthMiddleware from "../common/middlewares/auth.middlware.js";

const route = Router();

route.get(
  "/dashbord",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.adminPage
);
route.post(
  "/dashbord/users",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.addUser
);
route.get(
  "/dashbord/users",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.adminUserPage
);
route.get(
  "/dashbord/users/delete/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.deleteUser
);
route.get(
  "/dashbord/subject",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.adminCoursePage
);
route.post(
  "/dashbord/subject",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.adminCourseAdd
);
route.get(
  "/dashbord/subject/delete/:id",
  AuthMiddleware.isLogIn,
  AuthMiddleware.isAdmin,
  AdminController.adminDeleteSubject
);

export default route;
