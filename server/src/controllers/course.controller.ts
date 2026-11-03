import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { db } from "../db/index.ts";
import { coursesTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await db.select().from(coursesTable);
        return res.status(200).json(courses);
    } catch (error) {
        console.error("Database fetch error:", error);
        res.status(500).json({ error: "Failed to fetch courses from database" });
    }
};

export const getCourse = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id)).limit(1);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        return res.status(200).json(course);
    } catch (error) {
        console.error("Database fetch error:", error);
        res.status(500).json({ error: "Failed to fetch course from database" });
    }
};


export const createCourse = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const {
            title,
            description,
            image,
            price,
            originalPrice
        } = req.body;

        // Get logged-in admin ID from JWT
        const createdBy = req.user!.id;

        if (
            !title?.trim() ||
            !description?.trim() ||
            !image?.trim() ||
            price == null ||
            originalPrice == null
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [course] = await db
            .insert(coursesTable)
            .values({
                title,
                description,
                image,
                price,
                originalPrice,
                createdBy
            })
            .returning();

        return res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("Course creation error:", error);

        return res.status(500).json({
            message: "Failed to create course"
        });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, description, image, price, originalPrice, createdBy,
        } = req.body;
        const [updatedCourse] = await db
            .update(coursesTable)
            .set({
                title,
                description,
                image,
                price,
                originalPrice,
            })
            .where(eq(coursesTable.id, id))
            .returning();
        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        return res.status(200).json(updatedCourse);
    } catch (error) {
        console.error('Course update error:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
};


export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [deletedCourse] = await db
            .delete(coursesTable)
            .where(eq(coursesTable.id, id))
            .returning();
        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        return res.status(200).json({ message: 'Course deleted successfully', courseName: deletedCourse.title });
    } catch (error) {
        console.error('Course deletion error:', error);
        return res.status(500).json({ error: 'Failed to delete course' });
    }
};


export const getAdminCourses = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const adminId = req.user!.id;

        const courses = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.createdBy, adminId));

        const totalCourses = courses.length;

        return res.status(200).json({
            message: "Admin courses fetched successfully",
            totalCourses,
            courses
        });

    } catch (error) {
        console.error("Get admin courses error:", error);

        return res.status(500).json({
            message: "Failed to fetch admin courses"
        });
    }
};
