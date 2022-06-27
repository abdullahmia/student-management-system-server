const { Department } = require("../models/academic");
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
