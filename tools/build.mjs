import { mkdir, copyFile, rm } from 'node:fs/promises'
const files=['index.html','style.css','app.js','support.client.js','support.html','support.inbox.js','support.css']
const output = new URL('../public/',import.meta.url)
await rm(output,{recursive:true,force:true})
await mkdir(output,{recursive:true})
for(const file of files)await copyFile(new URL('../'+file,import.meta.url),new URL(file==='support.html'?'operatore.html':file,output))
console.log('Built public site and support inbox: '+files.length+' explicit assets; legacy admin and demo store excluded.')
