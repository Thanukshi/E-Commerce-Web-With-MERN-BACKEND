const routes = require("express").Router();

const UserRoutes = require('./UserRoutes');

routes.use("/user", UserRoutes);

module.exports = routes;
