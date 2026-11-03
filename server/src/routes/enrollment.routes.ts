import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.ts";
import { createEnrollment, getMyCourses } from "../controllers/enrollment.controller.ts";

const router = Router();

router.post("/enrollments", authenticate, createEnrollment);
router.get("/my-courses", authenticate, getMyCourses);

export default router;