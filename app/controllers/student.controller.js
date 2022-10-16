const db = require("../models");
const Student = db.student;
var html_to_pdf = require('html-pdf-node');

// Create and Save a new Student
exports.create = (req, res) => {
    var html = "";
    if (req.body.studentId != undefined) {
        html = '<div style="border:1px solid black; width: 250px;border-radius: 5px; padding: 20px;"> <div style= "text-align:center;padding-bottom:5px"> <b>Student Data</b> </div> <hr> <table style="border: none;"> <tbody> <tr> <td >Student ID</td> <td >:</td> <td> ' + req.body.studentId + '</td> </tr> <tr> <td >Student Name</td> <td >:</td> <td >' + req.body.studentName + '</td> </tr> <tr> <td >Budget</td> <td >:</td> <td >' + req.body.class + '</td> </tr> <tr> <td >End Date</td> <td >:</td> <td>' + req.body.marks + '</td> </tr> </tbody> </table> </div>';
    } else {
        var id = Math.floor(100000 + Math.random() * 900000);
        html = '<div style="border:1px solid black; width: 250px;border-radius: 5px; padding: 20px;"> <div style= "text-align:center;padding-bottom:5px"> <b>Student Data</b> </div> <hr> <table style="border: none;"> <tbody> <tr> <td >Student ID</td> <td >:</td> <td> ' + id + '</td> </tr> <tr> <td >Student Name</td> <td >:</td> <td >' + req.body.studentName + '</td> </tr> <tr> <td >Budget</td> <td >:</td> <td >' + req.body.class + '</td> </tr> <tr> <td >End Date</td> <td >:</td> <td>' + req.body.marks + '</td> </tr> </tbody> </table> </div>';
    }
    let options = { format: 'A4' };

    let file = { content: html };

    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {

        if (req.body.studentId != undefined) {
            var condition = { studentId: req.body.studentId };

            Student.find(condition).sort({ _id: -1 })
                .then(data => {
                    Student.findByIdAndUpdate(data[0]._id, { $set: { studentName: req.body.studentName, pdf: pdfBuffer.toString('base64') } }, { useFindAndModify: false })
                        .then(data => {
                            if (!data) {
                                res.status(404).send({
                                    message: `Cannot update Student with id=${id}. Maybe Student was not found!`
                                });
                            } else res.send({ message: "Student was updated successfully." });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating Student with id=" + id
                            });
                        });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving student."
                    });
                });
        } else {
            // Create a Student
            const student = new Student({
                studentId: id,
                studentName: req.body.studentName,
                class: req.body.class,
                marks: req.body.marks,
                pdf: pdfBuffer.toString('base64')
            });

            // Save Student in the database
            student
                .save(student)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Student."
                    });
                });
        }

    });



};

// Retrieve all Student from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Student.find(condition).sort({ _id: -1 })
        .then(data => {
            res.send(data[0]);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving student."
            });
        });
};

// Find a single Student with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Student.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Student with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Student with id=" + id });
        });
};

// Update a Student by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Student with id=${id}. Maybe Student was not found!`
                });
            } else res.send({ message: "Student was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Student with id=" + id
            });
        });
};
