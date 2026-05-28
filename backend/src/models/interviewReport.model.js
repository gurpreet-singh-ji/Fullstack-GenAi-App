import mongoose from "mongoose";

const skillGapSchema = new mongoose.Schema({
    skill: String,
    severity: {
        type: String,
        enum: ["low", "medium", "high"]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: String,
    answer: String
}, {
    _id: false
})

const prepPlanSchema = new mongoose.Schema({
    day: Number,
    foucusArea: {
        type: String,
        enum: ["technical", "behavioral", "both"]
    },
    tasks: {
        type: [String],
    }
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
        required: [true, "Resume is required"]
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [{
        question: String,
        answer: String, 
        intension: String
    }],
    skillGaps: [skillGapSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    prepPlans: [prepPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

const interviewReport = mongoose.model("InterviewReport", interviewReportSchema)

export default interviewReport