import multer from 'multer';import fs from 'node:fs';import {uploadDirectory} from '../../../infrastructure/config/uploads';
fs.mkdirSync(uploadDirectory,{recursive:true});
const upload=multer({dest:uploadDirectory,limits:{fileSize:10*1024*1024,files:1},fileFilter:(_req,file,callback)=>{if(file.mimetype!=='application/pdf')return callback(new Error('Only PDF files are allowed'));callback(null,true);}});
export const uploadMiddleware=upload.single('file');
