import multer from "multer"

const uploadPdf = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

export default uploadPdf