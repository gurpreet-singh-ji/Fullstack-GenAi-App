import { createRequire } from "module"
import generateInterviewReport from "../service/ai.service.js"
import interviewReport from "../models/interviewReport.model.js"

const require = createRequire(import.meta.url)
const pdfParse = require("pdf-parse")

async function generateInterviewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const {selfDescription, jobDescription} = req.body

    const interviewReportByAI = await generateInterviewReport(resumeContent.text, selfDescription, jobDescription)
    
    const newinterviewReport = await interviewReport.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAI
    })

    res.status(200).json({
        message: "Interview report generated successfully",
        interviewReport: newinterviewReport
    })

}

export {
    generateInterviewReportController
}