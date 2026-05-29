import Groq from "groq-sdk"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert interview preparation assistant. Generate a COMPLETE interview report for a candidate.

CANDIDATE INFORMATION:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

YOU MUST RETURN A JSON OBJECT WITH ALL 6 REQUIRED FIELDS:
1. matchScore (number 0-100)
2. title (string - job title)
3. technicalQuestions (array of objects with question, intention, answer)
4. behavioralQuestions (array of objects with question, intention, answer)
5. skillGaps (array of objects with skill and severity: low/medium/high)
6. preparationPlan (array of objects with day, focus, and tasks array)

EXAMPLE RESPONSE FORMAT (MUST FOLLOW THIS STRUCTURE EXACTLY):
{
  "matchScore": 85,
  "title": "Senior Engineer",
  "technicalQuestions": [
    {"question": "...", "intention": "...", "answer": "..."},
    {"question": "...", "intention": "...", "answer": "..."}
  ],
  "behavioralQuestions": [
    {"question": "...", "intention": "...", "answer": "..."},
    {"question": "...", "intention": "...", "answer": "..."}
  ],
  "skillGaps": [
    {"skill": "...", "severity": "low|medium|high"},
    {"skill": "...", "severity": "low|medium|high"}
  ],
  "preparationPlan": [
    {"day": 1, "focus": "...", "tasks": ["task1", "task2"]},
    {"day": 2, "focus": "...", "tasks": ["task1", "task2"]}
  ]
}

CRITICAL REQUIREMENTS:
- Include 2-3 technical questions
- Include 2-3 behavioral questions
- Include 2-3 skill gaps
- Include 3-5 day preparation plan
- ALL FIELDS ARE MANDATORY - do not omit any field
- Return ONLY valid JSON, NO markdown, NO extra text`

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
        max_tokens: 4096
    })
    
    const rawContent = response.choices[0].message.content
    console.log("AI Response:", rawContent)
    
    // Parse and validate against schema
    const parsedResponse = JSON.parse(rawContent)
    const validatedResponse = interviewReportSchema.parse(parsedResponse)
    
    console.log("Validated Response:", validatedResponse)
    return validatedResponse
}

export default generateInterviewReport