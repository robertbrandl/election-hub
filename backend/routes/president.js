import { Router } from "express";
const router = Router();
import { presidentData } from "../data/index.js";
router.route("/polls").get(async (req, res) => {
    try {
        let polls = await presidentData.getPollingData();
        console.log(polls);
        return res.status(200).json({ 
            message: "Got data", 
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