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
ipcMain.handle('external', (_, url) => { if (['https://open.spotify.com/', 'https://ollama.com/download'].includes(url)) return shell.openExternal(url); });
