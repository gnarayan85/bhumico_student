module.exports = app => {
  const students = require("../controllers/student.controller.js");

  var router = require("express").Router();

  // Create a new projects
    router.post("/", students.create);

  // Retrieve all projects
    router.get("/", students.findAll);

  // Retrieve a single projects with id
    router.get("/:id", students.findOne);

  // Update a projects with id
    router.put("/:id", students.update);

  app.use("/api/student", router);
};
