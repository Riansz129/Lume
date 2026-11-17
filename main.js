const { app, BrowserWindow, ipcMain, globalShortcut, shell, screen, Notification } = require('electron');
const path = require('path');
let win;
function createWindow() {
 const area = screen.getPrimaryDisplay().workArea;
 win = new BrowserWindow({ width: 440, height: 720, x: Math.round(area.x + (area.width - 440) / 2), y: area.y, frame: false, transparent: true, alwaysOnTop: true, resizable: false, show: false, skipTaskbar: false, webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
 win.loadFile('index.html'); win.once('ready-to-show', () => win.show());
 win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
 win.webContents.on('will-navigate', e => e.preventDefault());
}
app.whenReady().then(() => { createWindow(); globalShortcut.register('CommandOrControl+Shift+Space', () => { if (!win) return; win.isVisible() ? win.hide() : (win.show(), win.focus()); }); });
app.on('window-all-closed', () => app.quit());
app.on('will-quit', () => globalShortcut.unregisterAll());
ipcMain.on('minimize', () => win.hide());
ipcMain.on('close', () => app.quit());
ipcMain.on('resize', (_, expanded) => { const b = win.getBounds(); const h = expanded ? 720 : 86; win.setBounds({ x:b.x, y:b.y, width:440, height:h }); });
ipcMain.handle('notify', (_, title, body) => { if (Notification.isSupported()) new Notification({title: String(title).slice(0,80), body: String(body).slice(0,200)}).show(); });
ipcMain.handle('external', (_, url) => { if (['https://open.spotify.com/', 'https://ollama.com/download', 'https://console.groq.com/keys'].includes(url)) return shell.openExternal(url); });

const fs = require('fs');
const { aiErrorMessage } = require('./ai-errors');
const localTools = require('./local-tools');
const { safeStorage } = require('electron');
const endpoints = {openai:'https://api.openai.com/v1/chat/completions',groq:'https://api.groq.com/openai/v1/chat/completions',gemini:'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',anthropic:'https://api.anthropic.com/v1/messages'};
const keyPath = () => path.join(app.getPath('userData'),'ai-keys.json');
function validateProvider(p){if(!Object.hasOwn(endpoints,p))throw new Error('Provedor inválido.')}
function readKeys(){try{return JSON.parse(fs.readFileSync(keyPath(),'utf8'))}catch(e){if(e.code==='ENOENT')return {};throw new Error('Não foi possível ler as chaves salvas.')}}
ipcMain.handle('key-status',(_,p)=>{validateProvider(p);return !!readKeys()[p]});
ipcMain.handle('save-key',(_,p,k)=>{validateProvider(p);if(typeof k!=='string'||!k.trim()||k.length>4096)throw new Error('Chave inválida.');if(!safeStorage.isEncryptionAvailable())throw new Error('Proteção de chaves indisponível no Windows.');let keys=readKeys();keys[p]=safeStorage.encryptString(k.trim()).toString('base64');fs.writeFileSync(keyPath(),JSON.stringify(keys),{mode:0o600});return true});
ipcMain.handle('delete-key',(_,p)=>{validateProvider(p);let keys=readKeys();delete keys[p];fs.writeFileSync(keyPath(),JSON.stringify(keys),{mode:0o600});return true});
ipcMain.handle('local-tools',()=>localTools.findTools());
ipcMain.handle('ai-chat',async(_,req)=>{
 const {provider,model,prompt}=req||{};if(provider==='codex'||provider==='claude_cli')return localTools.runCli(provider,prompt,{cwd:app.getPath('temp')});if(typeof model!=='string'||!model.trim()||model.length>100||typeof prompt!=='string'||!prompt.trim()||prompt.length>12000)throw new Error('Informe um modelo e uma mensagem válidos.');
 const system='Você é Lume, um assistente gentil e conciso. Responda em português do Brasil.';
 let url,headers={'Content-Type':'application/json'},body;
 if(provider==='ollama'){url='http://127.0.0.1:11434/api/chat';body={model:model.trim(),stream:false,messages:[{role:'system',content:system},{role:'user',content:prompt}]}}
 else {validateProvider(provider);let encrypted=readKeys()[provider];if(!encrypted)throw new Error('Salve a chave de API nas configurações.');let key;try{key=safeStorage.decryptString(Buffer.from(encrypted,'base64'))}catch{throw new Error('Não foi possível abrir a chave salva; cadastre-a novamente.')}url=endpoints[provider];if(provider==='anthropic'){headers['x-api-key']=key;headers['anthropic-version']='2023-06-01';body={model:model.trim(),max_tokens:1024,system,messages:[{role:'user',content:prompt}]}}else{headers.Authorization='Bearer '+key;body={model:model.trim(),messages:[{role:'system',content:system},{role:'user',content:prompt}]}}}
 let response;try{response=await fetch(url,{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(90000)})}catch{throw new Error(provider==='ollama'?'Verifique se o Ollama está aberto.':'Não foi possível conectar ao serviço de IA.')}
 if(!response.ok){let code='';try{const errorBody=await response.json();if(typeof errorBody?.error?.code==='string')code=errorBody.error.code}catch{}throw new Error(aiErrorMessage(provider,response.status,code))}
 const data=await response.json();const answer=provider==='ollama'?data.message?.content:provider==='anthropic'?data.content?.filter(x=>x.type==='text').map(x=>x.text).join('\n'):data.choices?.[0]?.message?.content;if(typeof answer!=='string'||!answer.trim())throw new Error('O serviço não retornou texto.');return answer;
});