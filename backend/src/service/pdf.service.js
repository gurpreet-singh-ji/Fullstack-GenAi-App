import puppeteer from "puppeteer"

/**
 * Generate a PDF from HTML content using Puppeteer
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {string} fileName - The name of the PDF file
 * @returns {Promise<Buffer>} - The PDF buffer
 */
async function generatePDFFromHTML(htmlContent, fileName = "document.pdf") {
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })

        // Create a new page
        const page = await browser.newPage()

        // Set the HTML content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        })

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            printBackground: true
        })

        await page.close()
        return pdfBuffer

    } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error(`Failed to generate PDF: ${error.message}`)
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

/**
 * Generate a resume PDF from interview report data
 * @param {object} reportData - The interview report data
 * @returns {Promise<Buffer>} - The PDF buffer
 */
async function generateResumePDF(reportData) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${reportData.title || 'Interview Report'}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
            }
            
            .container {
                max-width: 900px;
                margin: 0 auto;
                padding: 40px;
            }
            
            .header {
                border-bottom: 3px solid #ff2d78;
                margin-bottom: 30px;
                padding-bottom: 20px;
            }
            
            .header h1 {
                color: #ff2d78;
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                color: #666;
                font-size: 14px;
            }
            
            .score-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f5f5f5;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            
            .score {
                font-size: 48px;
                font-weight: bold;
                color: #ff2d78;
            }
            
            .score-label {
                font-size: 14px;
                color: #666;
            }
            
            .section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #ff2d78;
                margin-bottom: 15px;
                border-bottom: 2px solid #ff2d78;
                padding-bottom: 10px;
            }
            
            .section-content {
                margin-left: 10px;
            }
            
            .question-item {
                margin-bottom: 20px;
                background: #fafafa;
                padding: 15px;
                border-left: 3px solid #ff2d78;
                border-radius: 4px;
            }
            
            .question-item h4 {
                color: #ff2d78;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .question-item p {
                color: #555;
                font-size: 13px;
                margin-bottom: 8px;
            }
            
            .skill-gap-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                margin-bottom: 10px;
                background: #fafafa;
                border-radius: 4px;
            }
            
            .skill-gap-item .skill {
                font-weight: 500;
            }
            
            .severity {
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .severity.low {
                background: #d4edda;
                color: #155724;
            }
            
            .severity.medium {
                background: #fff3cd;
                color: #856404;
            }
            
            .severity.high {
                background: #f8d7da;
                color: #721c24;
            }
            
            .preparation-day {
                margin-bottom: 20px;
                background: #fafafa;
                padding: 15px;
                border-radius: 4px;
                border-left: 3px solid #ff2d78;
            }
            
            .preparation-day .day-number {
                font-weight: bold;
                color: #ff2d78;
                margin-bottom: 8px;
            }
            
            .preparation-day .day-focus {
                font-weight: 500;
                color: #333;
                margin-bottom: 8px;
            }
            
            .preparation-day ul {
                margin-left: 20px;
                color: #666;
                font-size: 13px;
            }
            
            .preparation-day li {
                margin-bottom: 5px;
            }
            
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                text-align: center;
                color: #999;
                font-size: 12px;
            }
            
            .timestamp {
                margin-top: 10px;
                color: #999;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>Interview Preparation Report</h1>
                <p>Position: <strong>${reportData.title || 'N/A'}</strong></p>
                <div class="timestamp">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
            </div>
            
            <!-- Match Score -->
            <div class="score-section">
                <div>
                    <div class="score">${reportData.matchScore || 0}%</div>
                    <div class="score-label">Match Score</div>
                </div>
                <div style="text-align: right; font-size: 14px; color: #666;">
                    <p>This score represents how well your profile matches the target job position.</p>
                </div>
            </div>
            
            <!-- Technical Questions -->
            ${reportData.technicalQuestions && reportData.technicalQuestions.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Technical Questions</h2>
                <div class="section-content">
                    ${reportData.technicalQuestions.map((q, idx) => `
                        <div class="question-item">
                            <h4>Q${idx + 1}: ${q.question}</h4>
                            <p><strong>Intention:</strong> ${q.intention}</p>
                            <p><strong>Answer:</strong> ${q.answer}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Behavioral Questions -->
            ${reportData.behavioralQuestions && reportData.behavioralQuestions.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Behavioral Questions</h2>
                <div class="section-content">
                    ${reportData.behavioralQuestions.map((q, idx) => `
                        <div class="question-item">
                            <h4>Q${idx + 1}: ${q.question}</h4>
                            <p><strong>Intention:</strong> ${q.intention}</p>
                            <p><strong>Answer:</strong> ${q.answer}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Skill Gaps -->
            ${reportData.skillGaps && reportData.skillGaps.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Skill Gaps to Address</h2>
                <div class="section-content">
                    ${reportData.skillGaps.map(gap => `
                        <div class="skill-gap-item">
                            <span class="skill">${gap.skill}</span>
                            <span class="severity ${gap.severity}">${gap.severity.toUpperCase()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Preparation Plan -->
            ${reportData.preparationPlan && reportData.preparationPlan.length > 0 ? `
            <div class="section">
                <h2 class="section-title">7-Day Preparation Plan</h2>
                <div class="section-content">
                    ${reportData.preparationPlan.map(day => `
                        <div class="preparation-day">
                            <div class="day-number">Day ${day.day}</div>
                            <div class="day-focus">Focus: ${day.focus}</div>
                            <ul>
                                ${day.tasks.map(task => `<li>${task}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
                <p>This report was generated using AI Interview Preparation Assistant.</p>
                <p>Good luck with your interview!</p>
            </div>
        </div>
    </body>
    </html>
    `

    return await generatePDFFromHTML(htmlContent)
}

export { generatePDFFromHTML, generateResumePDF }
