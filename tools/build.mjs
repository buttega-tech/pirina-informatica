import { mkdir, copyFile, rm } from 'node:fs/promises'
const files=['index.html','style.css','app.js','support.client.js','support.html','support.inbox.js','support.css','support.activate.html','support.activate.js']
const published={'support.html':'operatore.html','support.activate.html':'operatore/attiva.html'}
const output = new URL('../public/',import.meta.url)
await rm(output,{recursive:true,force:true})
await mkdir(new URL('operatore/',output),{recursive:true})
for(const file of files)await copyFile(new URL('../'+file,import.meta.url),new URL(published[file]??file,output))
// Pinned @bottega/share-core (vendor/): its compiled module has no imports, so the page loads it as is.
await copyFile(new URL('share.js',import.meta.resolve('@bottega/share-core')),new URL('share-core.js',output))
console.log('Built public site, support inbox and invite activation: '+(files.length+1)+' explicit assets; legacy admin and demo store excluded.')
