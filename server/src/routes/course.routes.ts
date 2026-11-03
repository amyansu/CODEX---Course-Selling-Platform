import { Router } from "express";
import {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getAdminCourses
} from "../controllers/course.controller.ts";

import {
    authenticate,
    authorizeAdmin
} from "../middleware/auth.middleware.ts";

const router = Router();

// Public routes
router.get("/courses", getCourses);
router.get("/courses/:id", getCourse);

// Admin only routes
router.post("/courses", authenticate, authorizeAdmin, createCourse);
router.put("/courses/:id", authenticate, authorizeAdmin, updateCourse);
router.delete("/courses/:id", authenticate, authorizeAdmin, deleteCourse);
router.get("/admin/my-courses", authenticate, authorizeAdmin, getAdminCourses);

export default router;