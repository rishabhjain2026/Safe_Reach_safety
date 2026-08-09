const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");
const prisma = require("../config/prisma");

const register = async (req, res) => {
    try {

        const user = await authService.registerUser(req.body);
        console.log("User registered successfully:", user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const login = async (req, res) => {

    try {

        const user = await authService.loginUser(req.body);

        const token = generateToken(user.id);

        console.log("token :",token);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message
        });

    }
};

const getMe = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};