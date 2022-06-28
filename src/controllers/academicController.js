const { Department, Subject } = require("../models/academic");
const { createResponse } = require("../utils/responseGenarate");
const cloudinary = require("../lib/cloudinary");

// Department Create
module.exports.createDepartment = async (req, res) => {
    const { semester, name } = req.body;
    // if exist this semester
    const isDepartmentExist = await Department.findOne({ semester, name });
    if (isDepartmentExist) {
        return res
            .status(409)
            .json(createResponse(null, "Department already exist", true, null));
    }

    // upload image on cloudinary
    const upload = cloudinary.uploader.upload(req.file.path);

    const department = new Department({
        semester,
        name,
        image: (await upload).public_id,
    });

    await department.save();
    res.status(201).json(
        createResponse(department, "Department Created", false, null)
    );
};

// get all department
module.exports.getDepartments = async (req, res) => {
    const departments = await Department.find({});
    res.status(200).json(createResponse(departments, "Departments", false));
};

// Delete al department
module.exports.deleteDepartment = async (req, res) => {
    try {
        let id = req.params.id;

        // check if department is exist
        const department = await Department.findById(id);
        cloudinary.uploader.destroy(department.image);
        await Department.deleteOne({ _id: id });
        return res.status(202).json(createResponse(null, "Department Deleted"));
    } catch (error) {
        res.status(404).json(
            createResponse(null, "Department not found", true, null)
        );
    }
};

// update a department
module.exports.updateDepartment = async (req, res) => {
    const { semester, name } = req.body;

    try {
        // check if the department is exist
        const deparrtment = await Department.findOne({ _id: req.params.id });

        if (req.file) {
            // remove the old image from cloudinary
            cloudinary.uploader.destroy(deparrtment.image);

            // upload new image to cloudinary
            const uploader = cloudinary.uploader.upload(req.file.path);

            await Department.findOneAndUpdate(
                { _id: req.params.id },
                { semester, name, image: (await uploader).public_id }
            );

            return res
                .status(404)
                .json(createResponse(null, "Department not found", true, null));
        } else {
            await Department.findOneAndUpdate(
                { _id: req.params.id },
                { semester, name }
            );

            return res
                .status(202)
                .json(createResponse(null, "Department Updated", true, null));
        }
    } catch (error) {
        res.status(202).json(
            createResponse(null, "Department Updated", true, null)
        );
    }

    res.send("update Department");
};

// Create a subject
module.exports.createSubject = async (req, res) => {
    const { semester, department, name } = req.body;

    try {
        // checking if department is exist
        // eslint-disable-next-line no-unused-vars
        const isDepartmentExist = await Department.findOne({ _id: department });

        // checking if subject is exist
        let subject = await Subject.findOne({ semester, department });
        if (!subject) {
            const uploader = cloudinary.uploader.upload(req.file.path);
            subject = new Subject({
                semester,
                department,
                name,
                image: (await uploader).public_id,
            });
            subject.save();
            return res
                .status(201)
                .json(createResponse(subject, "Subject added"));
        } else {
            return res
                .status(202)
                .json(createResponse(null, "Subject already exist"));
        }
    } catch (error) {
        return res
            .status(404)
            .json(createResponse(null, "Department not found", true, null));
    }
};

// get all subject
module.exports.getSubjects = async (req, res) => {
    const subjects = await Subject.find({});
    return res.status(200).json(createResponse(subjects, "All Subject"));
};

// delete a subject
module.exports.deleteSubject = async (req, res) => {
    try {
        const id = req.params.id;
        const subject = await Subject.findOne({ _id: id });

        // delete image from cloudinary
        cloudinary.uploader.destroy(subject.image);

        await Subject.findOneAndDelete({ _id: id });
        return res
            .status(202)
            .json(createResponse(null, "Subject Deleted Deleted"));
    } catch (error) {
        return res.status(404).json(createResponse(null, "Subject not found"));
    }
};

// update a subject
module.exports.updateSubject = async (req, res) => {
    const { semester, department, name } = req.body;
    try {
        // check if subject is exist or not
        const subject = await Subject.findOne({ _id: req.params.id });

        if (req.file) {
            // remove old photo from cloudinary
            cloudinary.uploader.destroy(subject.image);

            // uplaod new image on cloudinary
            const image = cloudinary.uploader.upload(req.file.path);

            // finaly update the subject
            await Subject.findOneAndUpdate(
                { _id: req.params.id },
                { semester, department, name, image: (await image).public_id },
                { new: true }
            );
            return res
                .status(200)
                .json(createResponse(null, "Subject Updated"));
        } else {
            // update the subject without image
            await Subject.findOneAndUpdate(
                { _id: req.params.id },
                { semester, department, name },
                { new: true }
            );
            return res
                .status(200)
                .json(createResponse(null, "Subject Updated"));
        }
    } catch (error) {
        return res.status(404).json(createResponse(null, "Subject not found"));
    }
};
