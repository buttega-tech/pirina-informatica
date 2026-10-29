import { mkdir, copyFile } from 'node:fs/promises'
const files=['index.html','style.css','app.js','support.client.js','support.html','support.inbox.js','support.css']
await mkdir(new URL('../public/',import.meta.url),{recursive:true})
for(const file of files)await copyFile(new URL('../'+file,import.meta.url),new URL('../public/'+file,import.meta.url))
console.log('Built public site and support inbox: '+files.length+' explicit assets; legacy admin and demo store excluded.')
