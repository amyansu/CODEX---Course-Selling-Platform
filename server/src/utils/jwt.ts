import jwt from "jsonwebtoken";

export const generateJwt = (payload: {
    id: string;
    name: string;
    role: "user" | "admin";
}) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    return jwt.sign(payload, secret, {
        expiresIn: "1d",
    });
};