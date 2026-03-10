import app from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";

dotenv.config();

const startServer = async () => {
    await dbConnect();

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}

startServer();