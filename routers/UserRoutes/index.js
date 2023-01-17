const routes = require("express").Router();

const UserRoutes = require("../../controller/user.controller");

routes.post("/register", UserRoutes.registerUser);

routes.post("/login", UserRoutes.loginUser);

routes.post("/:id/verify/:token", UserRoutes.loginUser);

module.exports = routes;
