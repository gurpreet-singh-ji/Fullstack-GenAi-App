import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import Blacklist from "../models/blacklist.model.js";
import jwt from "jsonwebtoken"

/**
 * @route POST /api/auth/register
 * @description register a new user requires email,useranem and password
 * @access public
 */
async function registerController(req,res) {
    const {username,email,password} = req.body
    console.log("📝 Register request received:", {username, email})

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "please provide all info"
        })
    }

    const isUserAlreadyExists = await User.findOne({
        $or: [{username},{email}]
    })

    if (isUserAlreadyExists) {
        console.log("❌ Account already exists:", {username, email})
        return res.status(400).json({
            message: "Account already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password,10)

    const createUser = await User.create({
        username,
        email,
        password: hashPassword
    })

    console.log("✅ Account created successfully:", {username, email})
    const token = jwt.sign({id: createUser._id, username: createUser.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token",token)

    return res.status(201).json({
        message: "Account create success",
        user: {
            id: createUser._id,
            username: createUser.username,
            email: createUser.email
        }
        })
}

/**
 * @name loginController
 * @description login a user requires email and password
 * @access Public
 */
async function loginController(req,res) {
    const {email,password} = req.body
    console.log("🔐 Login request received:", {email})
     
    const user = await User.findOne({email})
    
    if (!user) {
        console.log("❌ No user found with email:", email)
        return res.status(404).json({
            message: "no user with this email existes. try to register first"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if (!isPasswordValid) {
        console.log("❌ Invalid password for user:", email)
        return res.status(400).json({
            message: "incorrect password"
        })
    }

    console.log("✅ Login successful for:", email)
    const token = jwt.sign({id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token",token)

    return res.status(200).json({
            message: "user logged in success",
            user: {
                id:user._id,
                username: user.username
            }
        })

}

/**
 * @route POST /api/auth/logout
 * @description logout a user by clearing the token cookie and add the token in blacklist
 * @access public
 */

async function logoutController(req,res) {
    const { token } = req.cookies;

    res.clearCookie("token");

    if (!token) {
        return res.status(400).json({
            message: "No token found"
        })
    }

    await Blacklist.create({ token });


    return res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @route GET /api/auth/get-me
 * @description get the logged in user data by token
 * @access Private
 */
async function getMeController(req,res) {
    const user = await User.findById(req.user.id)
    return res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export {
    registerController,
    loginController,
    logoutController,
    getMeController
}
