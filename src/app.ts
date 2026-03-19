import express ,{Request, Response} from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import cors from 'cors';
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFoundHandle";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from 'express-session';
import './app/config/passport';

const app = express();

app.use(expressSession({
    secret : 'Your Secret',
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api/v1',router);

app.get('/',(req : Request, res: Response) => {
    res.status(200).json({
        message : "Server is running on port 5000"
    })
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;