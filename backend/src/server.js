import {connectDB} from "./db/db.js"

import app from "./app.js"

const PORT = process.env.PORT || 5000
connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})