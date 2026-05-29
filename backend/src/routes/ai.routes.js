import {Router} from "express"
import generateAIResponse from "../service/ai.service.js"
import AuthMiddleware from "../middleware/auth.middleware.js"
import uploadPdf from "../middleware/multer.middleware.js"
import {generateInterViewReportController} from "../controller/ai.controller.js"
import { downloadReportPDFController } from "../controller/pdf.controller.js"
const aiRouter = Router()

/**
 * @route POST /api/interview
 * @description generate ai response for a given prompt
 * @access private
*/
aiRouter.post("/", AuthMiddleware, uploadPdf.single("resume"), generateInterViewReportController)

/**
 * @route GET /api/interview/:id/download-pdf
 * @description Download interview report as PDF
 * @access private
*/
aiRouter.get("/:id/download-pdf", AuthMiddleware, downloadReportPDFController)

export default aiRouter
