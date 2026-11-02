// Single-use invite: the token arrives in the URL fragment (never sent to servers or referrers) and
// is removed from the address bar at once. The person chooses email and password for the inbox.
const app=document.querySelector('#app'),notice=document.querySelector('#notice')
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const roles={owner:'amministratore',operator:'operatore',viewer:'consultazione'}
const errors={invite_invalid:'Questo link non è più valido: è già stato usato, è scaduto o ne è stato creato uno nuovo. Chiedi un nuovo invito.',email_in_use:'Questa email ha già un accesso. Usa un’altra email oppure accedi dalla pagina operatore.',invalid_email:'Controlla l’indirizzo email.',weak_password:'La password deve avere almeno 10 caratteri.',retry_later:'Troppi tentativi. Riprova tra qualche minuto.'}
const token=new URLSearchParams(location.hash.slice(1)).get('invito')??''
history.replaceState(null,'',location.pathname)
async function api(path,data){const r=await fetch(path,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});const value=await r.json();if(!r.ok)throw Error(errors[value.error]??'Operazione non riuscita. Riprova tra poco.');return value}
function invalid(text){app.innerHTML=`<section class="card"><h1>Link non valido</h1><p class="lede">${escape(text)}</p><p><a href="/operatore">Vai all’accesso operatore</a></p></section>`}
try{
  const invite=await api('/api/public/invites/check',{token})
  app.innerHTML=`<section class="card login"><h1>Attiva il tuo accesso</h1><p class="lede">Accesso ${escape(roles[invite.role])} alla casella di ${escape(invite.siteName)}. Scegli l’email e la password con cui entrerai.</p><form id="activate"><label>Email<input name="email" type="email" required autocomplete="username"></label><label>Password<input name="password" type="password" required minlength="10" autocomplete="new-password"></label><label>Ripeti la password<input name="repeat" type="password" required minlength="10" autocomplete="new-password"></label><button type="submit" class="primary">Attiva accesso</button></form><p class="muted">Il link vale una sola volta, fino al ${escape(new Date(invite.expiresAt).toLocaleString('it-IT',{dateStyle:'long',timeStyle:'short'}))}.</p></section>`
  document.querySelector('#activate').addEventListener('submit',async e=>{
    e.preventDefault();const form=e.currentTarget,button=form.querySelector('button'),data=Object.fromEntries(new FormData(form))
    if(data.password!==data.repeat){notice.textContent='Le due password non coincidono.';notice.hidden=false;return}
    button.disabled=true
    try{await api('/api/public/invites/accept',{token,email:data.email,password:data.password});location.replace('/operatore')}
    catch(error){notice.textContent=error.message;notice.hidden=false;button.disabled=false}
  })
}catch(error){invalid(error.message)}
