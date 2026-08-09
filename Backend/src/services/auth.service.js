const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const registerUser = async ({ name, email, phone, password }) => {

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { phone }
            ]
        }
    });

    if (existingUser) {
        throw new Error("User with this email or phone already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword
        }
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };
};



const loginUser = async ({ email, password }) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Invalid email");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid password");
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser
};