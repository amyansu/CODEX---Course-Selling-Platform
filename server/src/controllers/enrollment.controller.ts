import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { db } from "../db/index.ts";
import {
    enrollmentsTable,
    coursesTable
} from "../db/schema.ts";
import { eq, and } from "drizzle-orm";


export const createEnrollment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        
        const { courseId } = req.body;
        const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, Number(courseId))).limit(1);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const [existingEnrollment] = await db
            .select()
            .from(enrollmentsTable)
            .where(
                and(
                    eq(enrollmentsTable.userId, userId),
                    eq(enrollmentsTable.courseId, Number(courseId))
                )
            )
            .limit(1);

        if (existingEnrollment) {
            return res.status(409).json({
                message: "Already enrolled in this course"
            });
        }

        // Create enrollment
        const [enrollment] = await db
            .insert(enrollmentsTable)
            .values({
                userId,
                courseId: Number(courseId)
            })
            .returning();

        return res.status(201).json({
            message: "Enrollment successful",
            enrollment
        });

    } catch (error) {
        console.error("Enrollment error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getMyCourses = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.user!.id;

        const myCourses = await db
            .select({
                enrollmentId: enrollmentsTable.id,
                enrolledAt: enrollmentsTable.enrolledAt,
                courseId: coursesTable.id,
                title: coursesTable.title,
                description: coursesTable.description,
                image: coursesTable.image,
                price: coursesTable.price,
                originalPrice: coursesTable.originalPrice
            })
            .from(enrollmentsTable)
            .innerJoin(
                coursesTable,
                eq(enrollmentsTable.courseId, coursesTable.id)
            )
            .where(eq(enrollmentsTable.userId, userId));

        return res.status(200).json(myCourses);

    } catch (error) {
        console.error("Fetch my courses error:", error);

        return res.status(500).json({
            message: "Failed to fetch my courses"
        });
    }
};