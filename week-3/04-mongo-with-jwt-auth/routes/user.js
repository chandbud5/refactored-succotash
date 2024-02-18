const { z } = require("zod")
const jwt = require("jsonwebtoken")
const { User, Course } = require("../db")
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");

const UserSchema = z.object({
    username: z.string(),
    password: z.string().min(6)
}).strict();

// User Routes
router.post('/signup', async (req, res) => {
    const userBody = req.body;
    const parser = UserSchema.safeParse(userBody);
    if (!parser.success) {
        return res.status(400).send("password is shorter");
    }
    const user = await User.findOne({
        username: userBody.username,
        password: userBody.password
    })
    if (user) {
        return res.status(200).json(user);
    }
    const response = await User.create({
        username: userBody.username,
        password: userBody.password
    })
    return res.status(201).json(response);
});

router.get('/courses', async (req, res) => {
    const courses = await Course.find({})
    return res.status(200).json({ data: courses });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId
    const updatedUser = await User.updateOne({
        username: req.headers.username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    return res.json(updatedUser);
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.headers.username
    })
    if(!user) {
        return res.status(404).send("User does not exists")
    }
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    return res.json({ courses: courses })
});


router.post('/signin', (req, res) => {
    const token = jwt.sign({
        username: req.headers.username
    }, "secret")
    return res.json({
        token: token
    })
});

module.exports = router