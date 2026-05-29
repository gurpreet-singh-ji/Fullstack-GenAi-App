import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true
})

const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    // Validate inputs before sending
    if (!resume) {
        throw new Error("Resume file is required")
    }
    if (!selfDescription || selfDescription.trim() === "") {
        throw new Error("Self description is required")
    }
    if (!jobDescription || jobDescription.trim() === "") {
        throw new Error("Job description is required")
    }

    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)   

    try {
        const res = await api.post("/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return res.data
    } catch (error) {
        // Provide detailed error message
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error)
        }
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

const getInterviewReportById = async (id) => {
    const res = await api.get(`/interview/${id}`)
    return res.data
}

const getAllInterviewReports = async () => {
    const res = await api.get("/interview")
    return res.data
}

export {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports
}