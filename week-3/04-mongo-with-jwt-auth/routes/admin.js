const { z } = require("zod")
const jwt = require("jsonwebtoken")
const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db")
const router = Router();

const CourseSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    imageLink: z.string()
}).strict()

// Admin Routes
router.post('/signup', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const admin = await Admin.findOne({
        username: username,
        password: password
    })
    if (admin) {
        return res.status(200).json(admin);
    }
    const response = await Admin.create({
        username: username,
        password: password
    })
    return res.status(201).json(response);
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const courseBody = req.body;
    const parser = CourseSchema.safeParse(courseBody);
    if (!parser.success) {
        return res.status(400).send("Invalid data entered");
    }

    const createdCourse = await Course.create({
        ...courseBody
    })
    return res.status(201).json({
        courseId: createdCourse._id,
        title: createdCourse.title
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const courses = await Course.find({})
    return res.status(200).json({ data: courses });
});


router.post('/signin', (req, res) => {
    const token = jwt.sign({
        username: req.headers.username
    }, "secret")
    return res.json({
        token: token
    })
});

module.exports = router;