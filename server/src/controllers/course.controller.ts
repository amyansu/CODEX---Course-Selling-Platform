import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { db } from "../db/index.ts";
import { coursesTable, enrollmentsTable, usersTable } from "../db/schema.ts";
import { desc, eq, gte, sql } from "drizzle-orm";

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

export const getAdminOverview = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const activityStart = new Date(today);
        activityStart.setUTCDate(activityStart.getUTCDate() - 6);
        const enrollmentDay = sql`date_trunc('day', ${enrollmentsTable.enrolledAt})`;

        const [
            courseCount,
            userCount,
            enrollmentCount,
            revenue,
            activity,
            recentEnrollments
        ] = await Promise.all([
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(coursesTable),
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(usersTable),
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(enrollmentsTable),
            db
                .select({
                    amount: sql<number>`coalesce(sum(${coursesTable.price}), 0)::int`
                })
                .from(enrollmentsTable)
                .innerJoin(
                    coursesTable,
                    eq(enrollmentsTable.courseId, coursesTable.id)
                ),
            db
                .select({
                    day: sql<string>`to_char(${enrollmentDay}, 'YYYY-MM-DD')`,
                    count: sql<number>`count(*)::int`
                })
                .from(enrollmentsTable)
                .where(gte(enrollmentsTable.enrolledAt, activityStart))
                .groupBy(enrollmentDay)
                .orderBy(enrollmentDay),
            db
                .select({
                    id: enrollmentsTable.id,
                    userName: usersTable.name,
                    courseTitle: coursesTable.title,
                    enrolledAt: enrollmentsTable.enrolledAt
                })
                .from(enrollmentsTable)
                .innerJoin(usersTable, eq(enrollmentsTable.userId, usersTable.id))
                .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
                .orderBy(desc(enrollmentsTable.enrolledAt))
                .limit(5)
        ]);

        const countsByDay = new Map(
            activity.map(({ day, count }) => [day, Number(count)])
        );
        const dailyEnrollments = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(today);
            date.setUTCDate(date.getUTCDate() - (6 - index));
            const day = date.toISOString().slice(0, 10);
            return { day, count: countsByDay.get(day) ?? 0 };
        });

        return res.status(200).json({
            totalCourses: Number(courseCount[0]?.count ?? 0),
            totalUsers: Number(userCount[0]?.count ?? 0),
            totalEnrollments: Number(enrollmentCount[0]?.count ?? 0),
            estimatedRevenue: Number(revenue[0]?.amount ?? 0),
            dailyEnrollments,
            recentEnrollments: recentEnrollments.map(enrollment => ({
                ...enrollment,
                enrolledAt: enrollment.enrolledAt.toISOString()
            }))
        });
    } catch (error) {
        console.error("Admin overview fetch error:", error);
        return res.status(500).json({
            message: "Failed to fetch admin dashboard overview"
        });
    }
};
