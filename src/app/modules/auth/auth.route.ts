import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { authValidation } from "../../middleware/authValidation";
import { Role } from "../user/user.interface";
import passport from "passport";


const router = Router();

router.post('/login',AuthController.credentialLogin)
router.post('/refreshToken',AuthController.getNewAccessToken)
router.post('/logout',AuthController.logout)
router.post('/reset-password',authValidation(...Object.values(Role)), AuthController.resetPassword)
router.get('/google',async(req : Request, res:Response, next:NextFunction) => {
    const redirect = req.query.redirect || '/';
    passport.authenticate("google",{scope : ["profile", "email"] , state : redirect as string})(req,res,next)
});
router.get('/google/callback',passport.authenticate('google',{failureRedirect : '/login'}), AuthController.googleCallBackController);

export const AuthRouter = router;