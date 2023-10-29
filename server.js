import { app } from "./app.js";
import {connectDB} from "./database/db.js"

// Connecting DB
connectDB();

app.listen(4000,()=>{
    console.log("Server Is Working On Port 4000");
})
