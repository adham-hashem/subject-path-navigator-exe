const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');

let storage;

async function initializeStorage() {
  const { default: Store } = await import('electron-store');
  storage = new Store();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(async () => {
  await initializeStorage();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Existing IPC handlers
ipcMain.handle('save-subject', (event, subject) => {
  const subjects = storage.get('subjects', []);
  const index = subjects.findIndex(s => s.id === subject.id);
  if (index !== -1) {
    subjects[index] = subject;
  } else {
    subjects.push(subject);
  }
  storage.set('subjects', subjects);
  return subjects;
});

ipcMain.handle('get-subjects', () => {
  return storage.get('subjects', []);
});

ipcMain.handle('delete-subject', (event, id) => {
  const subjects = storage.get('subjects', []);
  const updated = subjects.filter(s => s.id !== id);
  storage.set('subjects', updated);
  return updated;
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});

// New IPC handler to open folder
ipcMain.handle('open-folder', async (event, path) => {
  try {
    await shell.openPath(path);
    return true;
  } catch (error) {
    console.error('Failed to open folder:', error);
    return false;
  }
});