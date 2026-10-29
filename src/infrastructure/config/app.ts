import express from 'express';
import path from 'path';
import { json } from 'body-parser';
import { InitializeRoutes } from '../../interface/http/rest/router';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

export class App {
    application() {
        app.disable('x-powered-by');app.use(require('helmet')());
        app.use(json());
        app.use(cors({origin:process.env.CORS_ORIGIN || 'http://localhost:3000'}));

        const routes = new InitializeRoutes();
        app.use(routes.router);

        app.use((error:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{res.status(error.code==='LIMIT_FILE_SIZE' ? 413 : 400).json({message:'Upload or request rejected'});});
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}
