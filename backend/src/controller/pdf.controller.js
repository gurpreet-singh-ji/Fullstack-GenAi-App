import { generateResumePDF } from "../service/pdf.service.js"
import interviewReport from "../models/interviewReport.model.js"

/**
 * @description Controller to download interview report as PDF
 */
async function downloadReportPDFController(req, res) {
    try {
        const { id } = req.params

        // Fetch the interview report
        const report = await interviewReport.findOne({
            _id: id,
            user: req.user.id
        })

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found",
                error: "Report does not exist or you don't have permission to access it"
            })
        }

        console.log("Generating PDF for report:", id)

        // Generate PDF from report data
        const pdfBuffer = await generateResumePDF(report)

        // Set response headers
        const fileName = `${report.title || 'interview-report'}-${new Date().getTime()}.pdf`.replace(/\s+/g, '-').toLowerCase()
        
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        res.setHeader('Content-Length', pdfBuffer.length)

        // Send PDF
        res.send(pdfBuffer)
        console.log("PDF generated and sent successfully")

    } catch (error) {
        console.error("Error generating PDF:", error)
        res.status(500).json({
            message: "Failed to generate PDF",
            error: error.message
        })
    }
}

export { downloadReportPDFController }
