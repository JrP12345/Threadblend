import express from "express";
import { userRegister,userLogin,userProfile,userLogout} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/register",userRegister)
router.post("/login",userLogin)
router.get("/userprofile", isAuthenticated, userProfile)
router.delete("/logout",userLogout)
export default router; 