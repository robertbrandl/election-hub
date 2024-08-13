import { Router } from "express";
const router = Router();
import { upcomingElectionData } from "../data/index.js";
router.route("/").get(async (req, res) => {
    try {
        let elections = await upcomingElectionData.getUpcomingElections();
        console.log(elections);
        return res.status(200).json({ 
            message: "Got data", 
            elections: elections 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Failed to retrieve data", 
            error: error.message 
        });
    }
})
export default router;