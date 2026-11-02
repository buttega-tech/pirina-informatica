import { mkdir, copyFile, rm } from 'node:fs/promises'
// Public site and support intake only: the operator inbox lives in the Fraiga sites operators
// console (operatori.sites.fraiga.it); /operatore redirects there.
const files=['index.html','style.css','app.js','support.client.js']
const output = new URL('../public/',import.meta.url)
await rm(output,{recursive:true,force:true})
await mkdir(output,{recursive:true})
for(const file of files)await copyFile(new URL('../'+file,import.meta.url),new URL(file,output))
console.log('Built public site and support intake: '+files.length+' explicit assets; operator inbox served by operatori.sites.fraiga.it.')
