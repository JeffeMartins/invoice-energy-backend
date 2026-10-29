import path from 'node:path';
export const uploadDirectory=path.resolve(process.env.UPLOAD_DIR || 'uploads');
export function safePdfName(value:string):boolean{return /^[a-f0-9]{32}$/.test(value);}
