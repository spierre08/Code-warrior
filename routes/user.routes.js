import { Router } from 'express';

import UserController from '../controllers/user.controller.js';

const route = Router();

route.get("/register", UserController.registerPage);
route.post("/register", UserController.register);
route.get("/reset-password", UserController.resetPassword);
route.post("/reset-password", UserController.creatPassword);

export default route;
