import {Router} from "express"
import generateAIResponse from "../service/ai.service.js"
import AuthMiddleware from "../middleware/auth.middleware.js"
import uploadPdf from "../middleware/multer.middleware.js"
import {generateInterviewReportController} from "../controller/ai.controller.js"
const aiRouter = Router()

/**
 * @route POST /api/interview
 * @description generate ai response for a given prompt
 * @access private
*/

aiRouter.post("/", AuthMiddleware, uploadPdf.single("resume"), generateInterviewReportController)

export default aiRouter
