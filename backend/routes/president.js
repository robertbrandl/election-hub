import { Router } from "express";
const router = Router();
import { presidentData } from "../data/index.js";
router.route("/polls").get(async (req, res) => {
    try {
        const cycleYear = parseInt(req.query.cycleYear);
        let polls = await presidentData.getPollingData(cycleYear);
        console.log(polls);
        return res.status(200).json({ 
            message: "Got polls", 
            polls: polls
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