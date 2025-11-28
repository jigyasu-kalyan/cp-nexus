import app from "./app";
import dotenv from "dotenv";
// import { logRoutes } from "./utils/routeLogger";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Backend server is running at http://localhost:${PORT}`);
    // Log all routes after server starts
    // logRoutes(app);
});