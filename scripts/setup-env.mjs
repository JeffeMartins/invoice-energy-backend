import {readFile,writeFile,access} from 'node:fs/promises';import {randomBytes} from 'node:crypto';
try{await access('.env');console.log('.env already exists; credentials preserved.');}catch{
 let template=await readFile('.env.example','utf8');const secrets={};
 template=template.replace(/^([A-Z_]*(?:PASSWORD|SECRET))=.*$/gm,(_,key)=>{const value=randomBytes(32).toString('hex');secrets[key]=value;return key+'='+value;});
 if(secrets.DB_PASSWORD)template=template.replace(':local-only@',':'+secrets.DB_PASSWORD+'@');
 await writeFile('.env',template,{flag:'wx',mode:0o600});console.log('Created .env with random local credentials. Keep it private.');
}
