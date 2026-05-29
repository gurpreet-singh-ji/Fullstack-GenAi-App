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
    answer: String,
    intention: String
}, {
    _id: false
})

const prepPlanSchema = new mongoose.Schema({
    day: Number,
    focus: String,
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
        intention: String
    }],
    skillGaps: [skillGapSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    preparationPlan: [prepPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    }
}, {
    timestamps: true
})

const interviewReport = mongoose.model("InterviewReport", interviewReportSchema)

export default interviewReport