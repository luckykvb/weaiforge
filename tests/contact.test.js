import test from 'node:test'
import assert from 'node:assert/strict'
import { createContactHandler } from '../api/contact.js'
const env = { RESEND_API_KEY: 'test-key', CONTACT_FROM: 'test@example.com', CONTACT_TO: 'inbox@example.com', CONTACT_ORIGIN: 'https://example.com' }
const valid = { name: 'Sample Visitor', email: 'visitor@example.com', interest: 'Discovery and prototype', message: 'A fictional workflow enquiry for testing.' }
function response() { return { setHeader() {}, status(code) {this.code = code;return this}, json(body) {this.body = body;return this} } }
function request(body = valid) {return {method:'POST', headers:{origin:env.CONTACT_ORIGIN,'content-type':'application/json'},body}}
test('missing configuration fails closed without sending', async () => {const res=response();await createContactHandler({env:{},send:()=>assert.fail('must not send')})(request(),res);assert.equal(res.code,503)})
test('rejects foreign origins and invalid fields before sending', async () => {for(const req of [{...request(),headers:{origin:'https://other.example'}},request({...valid,email:'bad'}),request({...valid,website:'bot'}),request({...valid,message:' '})]){const res=response();await createContactHandler({env,send:()=>assert.fail('must not send')})(req,res);assert.ok([400,403].includes(res.code))}})
test('forwards to fixed inbox and only confirms provider acceptance', async () => {let forwarded;const res=response();await createContactHandler({env,send:async(url,options)=>{forwarded=JSON.parse(options.body);return {ok:true,json:async()=>({id:'test-message'})}}})(request(),res);assert.equal(res.code,200);assert.deepEqual(forwarded.to,[env.CONTACT_TO]);assert.equal(forwarded.reply_to,valid.email);assert.equal(forwarded.text.includes(valid.message),true)})
test('provider failures never show success', async () => {for(const send of [async()=>({ok:false}),async()=>{throw new Error('timeout')},async()=>({ok:true,json:async()=>({})})]){const res=response();await createContactHandler({env,send})(request(),res);assert.equal(res.code,502)}})
