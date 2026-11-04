import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { usersTable } from "../db/schema.ts";
import { generateJwt } from "../utils/jwt.ts";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail))
            .limit(1);

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db
            .insert(usersTable)
            .values({
                name,
                email: normalizedEmail,
                password: hashedPassword
            })
            .returning({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
                role: usersTable.role
            });

        // Generate JWT
        const token = generateJwt({
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
        });

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: newUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail))
            .limit(1);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const token = generateJwt({
            id: user.id,
            name: user.name,
            role: user.role,
        });

        return res.status(200).json({
            message: "Signin successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};