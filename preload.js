const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('lume', { hide:()=>ipcRenderer.send('minimize'), close:()=>ipcRenderer.send('close'), resize:v=>ipcRenderer.send('resize',v), notify:(t,b)=>ipcRenderer.invoke('notify',t,b), external:u=>ipcRenderer.invoke('external',u) });
