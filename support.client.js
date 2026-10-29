// Site support consumer. Requests are confirmed only after the shared backend saves them.
// Requesters do not sign up. The source-of-truth is the site's support API.
const form = document.querySelector('#support-ticket-form')
const button = form.querySelector('button[type="submit"]')
const result = document.createElement('p')
result.id = 'support-result'
result.setAttribute('role', 'status')
result.setAttribute('aria-live', 'polite')
form.append(result)
let pending = null, busy = false
const label = button.textContent
const fields = [...form.querySelectorAll('input,select,textarea')]
const read = id => document.getElementById(id).value.trim()
form.addEventListener('submit', async event => {
  event.preventDefault()
  if (busy) return
  if (!pending && !form.reportValidity()) return
  if (!pending) pending = {
    requestKey: crypto.randomUUID(), customerName: read('supp-name'), customerPhone: read('supp-phone'),
    deviceType: read('supp-device-type'), deviceModel: read('supp-device-model'),
    urgency: read('supp-urgency'), subject: read('supp-subject'), message: read('supp-message'),
  }
  busy = true; button.disabled = true
  fields.forEach(field => { field.disabled = true })
  result.textContent = 'Invio della richiesta…'
  try {
    const response = await fetch('/api/public/sites/pirina-informatica/support', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pending),
      signal: AbortSignal.timeout(15000),
    })
    const receipt = await response.json()
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        pending = null
        fields.forEach(field => { field.disabled = false })
      }
      throw Error(receipt.error === 'invalid_support_phone' ? 'Controlla il numero di telefono.' : 'Richiesta non confermata. Riprova tra poco.')
    }
    const ticket = pending
    document.querySelector('#ticket-pill-ref').textContent = receipt.ticketRef
    document.querySelector('#ticket-pill-date').textContent = 'Registrato adesso'
    document.querySelector('#ticket-display-name').textContent = ticket.customerName
    document.querySelector('#ticket-display-device').textContent = `${ticket.deviceType} · ${ticket.deviceModel}`
    document.querySelector('#ticket-display-subject').textContent = ticket.subject
    const message = `Ciao Pirina Informatica, ho inviato la richiesta ${receipt.ticketRef}.\nDispositivo: ${ticket.deviceModel}\nOggetto: ${ticket.subject}\n${ticket.message}`
    document.querySelector('#ticket-whatsapp-btn').href = 'https://wa.me/393297245039?text=' + encodeURIComponent(message)
    document.querySelector('#support-initial-view').style.display = 'none'
    document.querySelector('#support-success-view').style.display = 'block'
    result.textContent = 'Richiesta ricevuta da Pirina Informatica. Riferimento: ' + receipt.ticketRef
    pending = null; form.reset(); fields.forEach(field => { field.disabled = false }); button.textContent = label
  } catch (error) {
    result.textContent = pending ? 'Invio non confermato. Premi «Riprova invio»: riuseremo lo stesso riferimento per evitare duplicati.' : error.message
    button.textContent = pending ? 'Riprova invio' : label
  } finally { busy = false; button.disabled = false }
})
document.querySelector('#ticket-new-btn').addEventListener('click', () => {
  document.querySelector('#support-success-view').style.display = 'none'
  document.querySelector('#support-initial-view').style.display = 'block'
  result.textContent = ''
})
