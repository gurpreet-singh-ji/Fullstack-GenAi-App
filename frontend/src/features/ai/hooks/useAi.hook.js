import {useContext} from "react"
import { AIContext } from "../ai.context"
import {generateInterviewReport,getAllInterviewReports,getInterviewReportById} from "../services/ai.service"

export const useAI = () => {
    const context = useContext(AIContext)
    if (!context) {
        throw new Error("useAI must be used within an AIProvider")
    }
    const {report, setReport, loading, setLoading, reports, setReports} = context

    const generateReport = async ({resume, selfDescription, jobDescription}) => {
        setLoading(true)
        let data = null
        try {
            const res = await generateInterviewReport({resume, selfDescription, jobDescription})
            setReport(res.createinterviewReport)
            return res.createinterviewReport
        } catch (error) {
            console.error("Error generating interview report:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getAllReports = async () => {
        setLoading(true)
        let data = null
        try {
            const res = await getAllInterviewReports()
            setReports(res.reports)
        } catch (error) {
            console.error("Error fetching interview reports:", error)
        } finally {
            setLoading(false)
        }
        return data
    }

    const getReportById = async (id) => {
        setLoading(true)
        let res = null
        try {
            res = await getInterviewReportById(id)
            setReport(res.report)
        } catch (error) {
            console.error("Error fetching interview report:", error)
        } finally {
            setLoading(false)
        }
        return res
    }

    return {
        report,
        loading,
        reports,
        generateReport,
        getAllReports,
        getReportById
    }


}