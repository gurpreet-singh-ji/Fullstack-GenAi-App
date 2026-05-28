import {Router} from 'express';
import {
    registerController,
    loginController,
    logoutController,
    getMeController
} from "../controller/auth.controller.js"

import authMiddleware from "../middleware/auth.middleware.js"

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description register a user
 * @access Public
 */
authRouter.post("/register", registerController)

/**
 * @route POST /api/auth/login
 * @description login a user
 * @access Public
    */
authRouter.post("/login",loginController)

/**
 * @route POST /api/auth/logout
 * @description logout a user
 * @access Public
 */
authRouter.post("/logout", logoutController)

/**
 * @route GET /api/auth/get-me
 * @description get the logged in user data by token
 * @access Public
 */
authRouter.get("/get-me", authMiddleware, getMeController)

export default authRouter;