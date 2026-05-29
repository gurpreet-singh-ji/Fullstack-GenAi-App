import { createRequire } from "module"
import generateInterviewReport from "../service/ai.service.js"
import interviewReport from "../models/interviewReport.model.js"

const require = createRequire(import.meta.url)
const pdfParse = require("pdf-parse")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF file is required",
                error: "No file uploaded"
            })
        }

        const { selfDescription, jobDescription } = req.body
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Self description and job description are required",
                error: "Missing required fields"
            })
        }

        console.log("Processing resume file...", req.file.originalname)
        
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        console.log("Resume extracted successfully")

        console.log("Generating interview report with AI...")
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        console.log("AI Response received:", interViewReportByAi)

        // Map AI response to model schema (handle field name mismatches)
        const reportData = {
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore,
            title: interViewReportByAi.title,
            technicalQuestions: interViewReportByAi.technicalQuestions.map(q => ({
                question: q.question,
                answer: q.answer,
                intention: q.intention
            })),
            behavioralQuestions: interViewReportByAi.behavioralQuestions.map(q => ({
                question: q.question,
                answer: q.answer,
                intention: q.intention
            })),
            skillGaps: interViewReportByAi.skillGaps,
            preparationPlan: interViewReportByAi.preparationPlan.map(plan => ({
                day: plan.day,
                focus: plan.focus,
                tasks: plan.tasks
            }))
        }

        console.log("Mapped data for database:", reportData)

        const createinterviewReport = await interviewReport.create(reportData)

        console.log("Interview report saved successfully")

        res.status(201).json({
            message: "Interview report generated successfully.",
            createinterviewReport
        })
    } catch (error) {
        console.error("Error in generateInterViewReportController:", error)
        
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Invalid AI response format",
                error: error.errors
            })
        }

        if (error instanceof SyntaxError) {
            return res.status(400).json({
                message: "Failed to parse AI response",
                error: error.message
            })
        }

        res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interviewReport by id
 */
async function getInterviewReportByIdController(req,res) {
    const id = req.params
    const report = await interviewReport.findOne({ _id: id, user: req.user.id })
    if(!report) {
        return res.status(404).json({ message: "Interview report not found." })
    }
    res.status(200).json({
        message: "Interview report fetched successfully.",
        report
    })

}

/**
 * @`description Controller to get all interview reports of a user
 */
async function getAllInterviewReportsController(req,res) {
    const reports = await interviewReport.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message: "Interview reports fetched successfully.",
        reports
    })
}

export {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController 
}