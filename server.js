import { configDotenv } from "dotenv";
import app from "./src/app.js";
import connectDb from "./src/db/db.js";

configDotenv()
connectDb()

const PORT= process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`)
})
